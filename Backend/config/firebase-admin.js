const admin = require('firebase-admin');

/**
 * Initializes Firebase Admin SDK using environment variables.
 * For production, use a full Service Account JSON.
 */
if (!admin.apps.length) {
    try {
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;
        if (privateKey) {
            // Remove all quotes and handle escaped newlines
            privateKey = privateKey.replace(/['"]+/g, '').replace(/\\n/g, '\n').trim();
            
            // Safe debugging
            console.log(`Firebase Debug: Key length: ${privateKey.length}, Lines: ${privateKey.split('\n').length}`);
            console.log(`Firebase Debug: Header: ${privateKey.substring(0, 27)}...`);
            console.log(`Firebase Debug: Footer: ...${privateKey.substring(privateKey.length - 25)}`);
        }
        
        const projectId = process.env.FIREBASE_PROJECT_ID ? process.env.FIREBASE_PROJECT_ID.replace(/['"]+/g, '').trim() : undefined;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL ? process.env.FIREBASE_CLIENT_EMAIL.replace(/['"]+/g, '').trim() : undefined;

        if (!projectId || !clientEmail || !privateKey) {
            const missing = [];
            if (!projectId) missing.push("FIREBASE_PROJECT_ID");
            if (!clientEmail) missing.push("FIREBASE_CLIENT_EMAIL");
            if (!privateKey) missing.push("FIREBASE_PRIVATE_KEY");
            throw new Error(`Missing environment variables: ${missing.join(', ')}`);
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            }),
        });
        console.log("✅ Firebase Admin Initialized");
    } catch (error) {
        console.error("❌ Firebase Admin Initialization Error:", error.message);
    }
}

module.exports = admin;
