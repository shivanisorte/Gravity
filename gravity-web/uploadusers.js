const admin = require("firebase-admin");
const fs = require("fs");

// Load your JSON data
const data = JSON.parse(fs.readFileSync("firestore-seed.json", "utf-8"));

// Initialize Firebase Admin SDK with your service account key
admin.initializeApp({
  credential: admin.credential.cert(require("./serviceAccountKey.json"))
});

const db = admin.firestore();

async function uploadUsers() {
  const users = data.users;
  
  console.log("Starting upload...");

  // Loop through users and upload data to Firestore
  for (const [uid, user] of Object.entries(users)) {
    console.log(`Uploading user: ${uid}`);
    try {
      await db.collection("users").doc(uid).set(user);
      console.log(`✅ Uploaded: ${user.name}`);
    } catch (error) {
      console.error(`❌ Failed to upload ${user.name}:`, error);
    }
  }

  console.log("All users uploaded!");
}

uploadUsers();
