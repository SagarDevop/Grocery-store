const admin = require('firebase-admin');

/**
 * Initializes Firebase Admin SDK using environment variables.
 * For production, use a full Service Account JSON.
 */
if (!admin.apps.length) {
    try {
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;
        if (privateKey) {
            // 1. Extract the raw base64 core
            // Remove headers, footers, quotes, and ALL whitespace/escapes
            let core = privateKey
                .replace(/-----BEGIN PRIVATE KEY-----/, '')
                .replace(/-----END PRIVATE KEY-----/, '')
                .replace(/['"\\\s]/g, '')
                .trim();
            
            // 2. Clean any remaining non-base64 characters (just in case)
            core = core.replace(/[^A-Za-z0-9+/=]/g, '');
            
            // 3. Reconstruct the PEM format perfectly
            // We break it into 64-character lines which is the standard PEM format
            const lines = core.match(/.{1,64}/g);
            if (lines) {
                privateKey = `-----BEGIN PRIVATE KEY-----\n${lines.join('\n')}\n-----END PRIVATE KEY-----`;
            }

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
