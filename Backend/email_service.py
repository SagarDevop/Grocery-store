import os
import requests

def send_email_brevo(to, subject, html):
    url = "https://api.brevo.com/v3/smtp/email"

    payload = {
        "sender": {
            "name": "Grocery Store",
            "email": os.getenv("BREVO_SENDER_EMAIL"),
        },
        "to": [{"email": to}],
        "subject": subject,
        "htmlContent": html,
    }

    headers = {
        "api-key": os.getenv("BREVO_API_KEY"),
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        print("Email sent:", response.json())
        return True
    except Exception as e:
        print("Email error:", e)
        return False


def send_otp_email_signup(receiver_email, otp):
    html = f"""
    <h2>Verify Your Grocery Store Account</h2>
    <p>Your OTP is:</p>
    <h1>{otp}</h1>
    <p>This OTP is valid for 1 minutes.</p>
    """
    return send_email_brevo(
        receiver_email,
        "🔐 Verify Your Grocery Store Account - OTP Inside",
        html
    )


def send_otp_email_forgot_password(receiver_email, otp):
    html = f"""
    <h2>Reset Your Grocery Store Password</h2>
    <p>Your OTP is:</p>
    <h1>{otp}</h1>
    <p>This OTP is valid for 1 minutes.</p>
    """
    return send_email_brevo(
        receiver_email,
        "🔑 Reset Your Grocery Store Password - OTP Inside",
        html
    )


def send_seller_email(receiver_email, status, name):
    if status == "approved":
        subject = "✅ Your Grocery Seller Registration is Approved!"
        html = f"""
        <h2>Hello {name},</h2>
        <p>Your seller registration has been <b>APPROVED</b>.</p>
        """
    else:
        subject = "❌ Seller Registration Rejected"
        html = f"""
        <h2>Hello {name},</h2>
        <p>Your seller registration has been <b>REJECTED</b>.</p>
        """

    return send_email_brevo(receiver_email, subject, html)


def send_admin_notification_new_seller(data):
    admin_email = "Sagar.singh44818@gmail.com"

    html = f"""
    <h2>New Seller Registration Request</h2>
    <p><b>Name:</b> {data.get('name')}</p>
    <p><b>Phone:</b> {data.get('phone')}</p>
    <p><b>Email:</b> {data.get('email')}</p>
    <p><b>City:</b> {data.get('city')}</p>
    <p><b>Store:</b> {data.get('store')}</p>
    <p><b>Products:</b> {data.get('products')}</p>
    """

    return send_email_brevo(
        admin_email,
        "📢 New Seller Registration Request",
        html
    )
