// 🔥 FIREBASE CONFIG (APNA REAL CONFIG YAHAN PASTE KARO)

const firebaseConfig = {
     apiKey: "AIzaSyD2cPJcIYsGs3ftlWRHpDRyJxJTwItNdIo",
  authDomain: "homzo-f3f58.firebaseapp.com",
  projectId: "homzo-f3f58",
  storageBucket: "homzo-f3f58.firebasestorage.app",
  messagingSenderId: "597971565492",
  appId: "1:597971565492:web:bcc69393e7a902c1db50e1",
  measurementId: "G-Q18FS31YK6"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();


// ===============================
// AUTH CHECK
// ===============================

function checkAuth(roleRequired) {
    auth.onAuthStateChanged(async (user) => {
        if (!user) {
            window.location.href = "index.html";
        } else {
            const doc = await db.collection("users").doc(user.uid).get();
            if (!doc.exists) {
                alert("User not found in database.");
                auth.signOut();
                return;
            }

            const role = doc.data().role;

            if (role !== roleRequired) {
                alert("Access Denied");
                auth.signOut();
            }
        }
    });
}


// ===============================
// LOGOUT
// ===============================

function logout() {
    auth.signOut().then(() => {
        window.location.href = "index.html";
    });
}


// ===============================
// PASSWORD CHANGE
// ===============================

function changePassword() {
    const newPass = prompt("Enter new password:");
    if (!newPass) return;

    auth.currentUser.updatePassword(newPass)
        .then(() => alert("Password updated"))
        .catch(err => alert(err.message));
}


// ===============================
// GET CURRENT LOCATION
// ===============================

function getLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            callback({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });
        });
    } else {
        alert("Location not supported");
    }
}


// ===============================
// NOTIFICATION PERMISSION
// ===============================

function requestNotification() {
    if ("Notification" in window) {
        Notification.requestPermission();
    }
}
