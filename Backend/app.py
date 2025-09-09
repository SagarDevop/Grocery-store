from flask import Flask, request, jsonify
from flask_cors import CORS
import random, smtplib
from datetime import datetime, timedelta
from email.message import EmailMessage
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash
from email_validator import validate_email, EmailNotValidError
from bson.json_util import dumps
from bson.objectid import ObjectId
from dotenv import load_dotenv
import os
from bson.objectid import ObjectId
from flask import jsonify

load_dotenv()




# --- CONFIG ---
app = Flask(__name__)

OTP_EXPIRY_MINUTES = 1  # OTP valid for 1 minutes
CORS(app)

MONGO_URI = os.getenv("MONGO_URI")
name = os.getenv("ADMIN_NAME")
email = os.getenv("ADMIN_EMAIL")
password = os.getenv("ADMIN_PASSWORD")

client = MongoClient(MONGO_URI)
db = client["groceryDB"]
pending_users = db["pending_users"]
sellers_collection = db["sellers"]
pending_sellers = db["pending_sellers"]
users_collection = db["users"]
products = db["products"]
admin_user = {
    "name": name,
    "email": email,
    "password": generate_password_hash(password),
    "is_verified": True,
    "is_admin": True,
}

if not users_collection.find_one({"email": admin_user["email"]}):
    users_collection.insert_one(admin_user)


# --- ROUTES ---



def send_otp_email_signup(receiver_email, otp):
    try:
        sender_email = "Sagar.singh44818@gmail.com"
        sender_password = "wjyv znpq ondf qlky"

        msg = EmailMessage()
        msg["Subject"] = "🔐 Verify Your Grocery Store Account - OTP Inside"
        msg["From"] = "Grocery Store <Sagar.singh44818@gmail.com>"
        msg["To"] = receiver_email

        msg.set_content(f"""
Hi there,

Thank you for signing up at **Grocery Store** 🛒!

To complete your registration, please enter the following One-Time Password (OTP) in the app:

🔑 OTP: {otp}

This OTP is valid for {OTP_EXPIRY_MINUTES} minutes.

If you did not initiate this request, you can safely ignore this email.

Warm regards,  
The Grocery Store Team

--------------------------------------
Grocery Store | Freshness Delivered.
        """.strip())

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(sender_email, sender_password)
            smtp.send_message(msg)

        return True
    except Exception as e:
        print("Email sending error:", e)
        return False
    
def send_seller_email(receiver_email, status, name):
    try:
        sender_email = "Sagar.singh44818@gmail.com"
        sender_password = "wjyv znpq ondf qlky"

        msg = EmailMessage()
        msg["From"] = "Grocery Store <Sagar.singh44818@gmail.com>"
        msg["To"] = receiver_email

        if status == "approved":
            msg["Subject"] = "✅ Your Grocery Seller Registration is Approved!"
            msg.set_content(f"""
Hi {name},

Great news! 🎉  
Your seller registration for **Grocery Store** has been approved.  

You can now get in touch with us to activate your store panel.

Thanks for joining us!  
- Grocery Store Team
""")
        else:
            msg["Subject"] = "❌ Seller Registration Rejected"
            msg.set_content(f"""
Hi {name},

Thank you for your interest in **Grocery Store**.  
After reviewing your application, we’re sorry to inform you that it has been rejected.

You may contact support for more info.

- Grocery Store Team
""")

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(sender_email, sender_password)
            smtp.send_message(msg)

    except Exception as e:
        print("Email error:", e)



@app.route("/signup", methods=["POST"])
def signup():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not name or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    try:
        validate_email(email)
    except EmailNotValidError as e:
        return jsonify({"error": str(e)}), 400

    # Check and remove expired pending user (if any)
    existing_pending = pending_users.find_one({"email": email})
    if existing_pending:
        if datetime.utcnow() > existing_pending["otp_expiry"]:
            pending_users.delete_one({"email": email})  # clean up expired
        else:
            return jsonify({"error": "A verification is already in progress"}), 409

    if users_collection.find_one({"email": email}):
        return jsonify({"error": "User already exists"}), 409

    hashed_password = generate_password_hash(password)
    otp = str(random.randint(100000, 999999))
    otp_expiry = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)

    email_sent = send_otp_email_signup(email, otp)
    if not email_sent:
        return jsonify({"error": "Failed to send OTP email"}), 500

    pending_users.insert_one({
        "name": name,
        "email": email,
        "password": hashed_password,
        "otp": otp,
        "otp_expiry": otp_expiry
    })

    return jsonify({"message": "OTP sent to your email. Please verify."}), 201

def send_otp_email_forgot_password(receiver_email, otp):
    try:
        sender_email = "Sagar.singh44818@gmail.com"
        sender_password = "wjyv znpq ondf qlky"

        msg = EmailMessage()
        msg["Subject"] = "🔑 Reset Your Grocery Store Password - OTP Inside"
        msg["From"] = "Grocery Store <Sagar.singh44818@gmail.com>"
        msg["To"] = receiver_email

        msg.set_content(f"""
Hi there,

We received a request to reset your password for your **Grocery Store** 🛒 account.

To proceed, please enter the following One-Time Password (OTP) in the app:

🔑 OTP: {otp}

This OTP is valid for {OTP_EXPIRY_MINUTES} minutes.

If you did not request a password reset, please ignore this message. Your account is safe.

Warm regards,  
The Grocery Store Team

--------------------------------------
Grocery Store | Freshness Delivered.
        """.strip())

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(sender_email, sender_password)
            smtp.send_message(msg)

        return True
    except Exception as e:
        print("Email sending error (Forgot Password):", e)
        return False


@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("email")
    otp_input = data.get("otp")

    pending_users = db["pending_users"]
    user = pending_users.find_one({"email": email})
    if not user:
        return jsonify({"error": "No pending signup found"}), 404

    if datetime.utcnow() > user["otp_expiry"]:
        pending_users.delete_one({"email": email})  # Clean up expired
        return jsonify({"error": "OTP expired. Please sign up again."}), 400

    if user["otp"] != otp_input:
        return jsonify({"error": "Invalid OTP"}), 400

    # Insert verified user
    insert_result = users_collection.insert_one({
        "name": user["name"],
        "email": user["email"],
        "password": user["password"],
        "is_verified": True,
        "cart": [] 
    })

    # Delete from pending
    pending_users.delete_one({"email": email})

    return jsonify({
    "message": "Account verified successfully",
    "user": {
        "_id": str(insert_result.inserted_id),
        "name": user["name"],
        "email": user["email"],
        "is_admin": False,
        "role": "user"
    }
}), 200

@app.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.json
    email = data.get("email")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404

    otp = str(random.randint(100000, 999999))
    otp_expiry = datetime.utcnow() + timedelta(minutes=OTP_EXPIRY_MINUTES)

    # Update user with OTP
    users_collection.update_one(
        {"email": email},
        {"$set": {"reset_otp": otp, "reset_otp_expiry": otp_expiry}}
    )

    if send_otp_email_forgot_password(email, otp):
        return jsonify({"message": "OTP sent to your email"}), 200
    else:
        return jsonify({"error": "Failed to send OTP"}), 500

@app.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    email = data.get("email")
    otp = data.get("otp")
    new_password = data.get("new_password")

    if not email or not otp or not new_password:
        return jsonify({"error": "All fields are required"}), 400

    user = users_collection.find_one({"email": email})
    if not user or user.get("reset_otp") != otp:
        return jsonify({"error": "Invalid OTP"}), 400

    if datetime.utcnow() > user.get("reset_otp_expiry", datetime.utcnow()):
        return jsonify({"error": "OTP expired"}), 400

    hashed_password = generate_password_hash(new_password)

    users_collection.update_one(
        {"email": email},
        {
            "$set": {"password": hashed_password},
            "$unset": {"reset_otp": "", "reset_otp_expiry": ""}
        }
    )

    return jsonify({"message": "Password reset successful"}), 200



@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    # Always check users_collection first
    user = users_collection.find_one({"email": email})

    # If user exists, check password
    if user:
        if not check_password_hash(user["password"], password):
            return jsonify({"error": "Invalid credentials"}), 401

        if not user.get("is_verified", False):
            return jsonify({"error": "Please verify your account first."}), 403

        # Now ALSO check if this user is in sellers_collection
        seller = sellers_collection.find_one({"email": email})
        role = "seller" if seller else "user"

        return jsonify({
            "message": "Login successful",
            "user": {
    "_id": str(user["_id"]),
    "name": user["name"],
    "email": user["email"],
    "is_admin": user.get("is_admin", False),
    "role": role
}

        }), 200

    # If not found in users, maybe it's a seller-only account
    seller = sellers_collection.find_one({"email": email})
    if seller:
        if not check_password_hash(seller["password"], password):
            return jsonify({"error": "Invalid credentials"}), 401
        if not seller.get("is_verified", False):
            return jsonify({"error": "Please verify your account first."}), 403

        return jsonify({
            "message": "Login successful",
           "user": {
    "_id": str(seller["_id"]),
    "name": seller["name"],
    "email": seller["email"],
    "is_admin": False,
    "role": "seller"
}

        }), 200

    return jsonify({"error": "User not found"}), 404



@app.route("/api/cart/<email>", methods=["GET"])
def get_user_cart(email):
    user = users_collection.find_one({"email": email})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"cart": user.get("cart", [])})

@app.route("/api/cart/update", methods=["POST"])
def update_user_cart():
    data = request.json
    email = data.get("email")
    cart = data.get("cart", [])

    if not email:
        return jsonify({"error": "Email is required"}), 400

    result = users_collection.update_one(
        {"email": email},
        {"$set": {"cart": cart}}
        
    )

    if result.modified_count > 0:
        return jsonify({"message": "Cart updated"}), 200
    else:
        return jsonify({"message": "No changes made"}), 200
    
@app.route('/register-seller', methods=['POST'])
def register_seller():
    data = request.get_json()

    # Optional: check if email already exists
    if pending_sellers.find_one({"email": data.get("email")}):
        return jsonify({"message": "Seller with this email already registered"}), 400

    pending_sellers.insert_one(data)
    return jsonify({"message": "Seller registration received"}), 201


@app.route('/pending-sellers', methods=['GET'])
def get_pending_sellers():
    sellers = list(pending_sellers.find())
    return dumps(sellers), 200

#new seller notification to admin
def send_admin_notification_new_seller(data):
    try:
        sender_email = "Sagar.singh44818@gmail.com"
        sender_password = "wjyv znpq ondf qlky"
        admin_email = "sagar.singh44818@gmail.com"  # Change to your actual admin email

        msg = EmailMessage()
        msg["Subject"] = "📢 New Seller Registration Request"
        msg["From"] = "Grocery Store <Sagar.singh44818@gmail.com>"
        msg["To"] = admin_email

        msg.set_content(f"""
A new seller has submitted a registration request at Grocery Store 🛒:

🔹 Name: {data.get('name')}
🔹 Phone: {data.get('phone')}
🔹 Email: {data.get('email')}
🔹 City: {data.get('city')}
🔹 Store Name: {data.get('store')}
🔹 Products: {data.get('products')}

Please review and approve this seller via the admin panel.

- Green Cart Team
        """.strip())

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as smtp:
            smtp.login(sender_email, sender_password)
            smtp.send_message(msg)

        print("Admin notified successfully")
        return True
    except Exception as e:
        print("Admin notification email error:", e)
        return False


@app.route('/notify-new-seller', methods=['POST'])
def notify_admin():
    data = request.json

    if not data:
        return jsonify({"error": "Invalid data"}), 400

    success = send_admin_notification_new_seller(data)
    if success:
        return jsonify({"message": "Admin notified successfully"}), 200
    else:
        return jsonify({"error": "Failed to send email to admin"}), 500


@app.route('/approve-seller/<string:seller_id>', methods=['POST'])
def approve_seller(seller_id):
    seller = pending_sellers.find_one({"_id": ObjectId(seller_id)})
    if not seller:
        return jsonify({"message": "Seller not found"}), 404

    # Move to sellers collection
    sellers_collection.insert_one({
        **seller,
        "role": "seller",
        "approved_at": datetime.utcnow()
    })

    # Delete from pending_sellers
    pending_sellers.delete_one({"_id": ObjectId(seller_id)})

    # ✅ Update role in users_collection if user exists
    user = users_collection.find_one({"email": seller["email"]})
    if user:
        users_collection.update_one(
            {"email": seller["email"]},
            {"$set": {"role": "seller"}}
        )

    # Send confirmation email
    send_seller_email(seller["email"], "approved", seller["name"])

    return jsonify({"message": "Seller approved"}), 200


@app.route('/reject-seller/<string:seller_id>', methods=['DELETE'])
def reject_seller(seller_id):
    seller = pending_sellers.find_one({"_id": ObjectId(seller_id)})
    if not seller:
        return jsonify({"message": "Seller not found"}), 404

    pending_sellers.delete_one({"_id": ObjectId(seller_id)})

    # ✅ Send rejection email
    send_seller_email(seller["email"], "rejected", seller["name"])

    return jsonify({"message": "Seller rejected"}), 200

# Seller side api 


from bson import ObjectId

@app.route('/add-product', methods=['POST'])
def add_product():
    data = request.json

    required_fields = ['seller_id', 'name', 'price', 'stock', 'amount', 'unit', 'category', 'images']
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing fields"}), 400

    try:
        # Convert seller_id to ObjectId
        data['seller_id'] = ObjectId(data['seller_id'])
    except Exception as e:
        return jsonify({"error": "Invalid seller_id format"}), 400

    data['created_at'] = datetime.utcnow()
    result = products.insert_one(data)

    return jsonify({"message": "Product added", "product_id": str(result.inserted_id)}), 201



@app.route('/products', methods=['GET'])
def get_all_products():
    all_products = list(products.find())
    for product in all_products:
        product['_id'] = str(product['_id'])  # Convert ObjectId to string
        product['seller_id'] = str(product['seller_id'])  # Optional, if stored
    return jsonify(all_products), 200


@app.route('/products/<string:product_id>', methods=['GET'])
def get_product_by_id(product_id):
    try:
        product = products.find_one({"_id": ObjectId(product_id)})
        if not product:
            return jsonify({"error": "Product not found"}), 404

        # Keep ObjectId type for lookup
        seller_id = product["seller_id"]

        # Fetch seller details
        seller = sellers_collection.find_one({"_id": seller_id})

        if seller:
            seller_info = {
                "name": seller.get("name"),
                "phone": seller.get("phone"),
                "email": seller.get("email"),
                "store": seller.get("store"),
            }
            product["seller"] = seller_info
        else:
            product["seller"] = None

        # Convert ObjectIds to strings for frontend
        product["_id"] = str(product["_id"])
        product["seller_id"] = str(product["seller_id"])

        return jsonify(product), 200

    except Exception as e:
        print(f"Error fetching product by ID: {e}")
        return jsonify({"error": "Invalid product ID"}), 400


    
@app.route('/products/category/<string:category_name>', methods=['GET'])
def get_products_by_category(category_name):
    try:
        matched_products = list(products.find({"category": category_name}))
        for product in matched_products:
            product["_id"] = str(product["_id"])
            product["seller_id"] = str(product["seller_id"])
        return jsonify(matched_products), 200
    except Exception as e:
        print("Error fetching category products:", e)
        return jsonify({"error": "Internal server error"}), 500


@app.route('/categories', methods=['GET'])
def get_all_categories():
    categories = products.distinct("category")
    return jsonify(categories), 200

@app.route("/api/seller-dashboard-summary", methods=["GET"])
def seller_dashboard_summary():
    seller_id = request.args.get("sellerId")
    if not seller_id:
        return jsonify({"error": "Missing sellerId"}), 400

    # Optional: Only if your DB uses ObjectId
    try:
        seller_object_id = ObjectId(seller_id)
    except:
        return jsonify({"error": "Invalid seller ID"}), 400

    # Use seller_object_id only if it's needed
    total_products = products.count_documents({"seller_id": seller_id})
    orders_count = random.randint(20, 40)
    earnings = total_products * 400
    pending_orders = random.randint(0, 5)

    out_of_stock_count = products.count_documents({
        "seller_id": seller_id,
        "stock": {"$lte": 0}
    })

    notifications = []
    if out_of_stock_count > 0:
        notifications.append(f"{out_of_stock_count} products are out of stock.")

    notifications.append("You have a new order.")

    return jsonify({
        "totalProducts": total_products,
        "orders": orders_count,
        "earnings": earnings,
        "pendingOrders": pending_orders,
        "notifications": notifications
    })

    

@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "Grocery Auth Backend is running ✅"})


if __name__ == "__main__":
    app.run(debug=True)
