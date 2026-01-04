import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ PASTE your Firebase config here (from Firebase console)
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0V3HNsxGM8EqKmvaVoG78zF94QmWpvXE",
  authDomain: "kel-website.firebaseapp.com",
  projectId: "kel-website",
  storageBucket: "kel-website.firebasestorage.app",
  messagingSenderId: "954488607948",
  appId: "1:954488607948:web:7694ccb088374543895e69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ SIGN UP (clients create accounts)
window.signup = async () => {
  try {
    const email = $("email").value.trim();
    const password = $("password").value;

    if (!email || !password) return alert("Please enter email & password.");
    if (password.length < 6) return alert("Password must be at least 6 characters.");

    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created! You are now logged in.");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
};

// ✅ LOGIN
window.login = async () => {
  try {
    const email = $("email").value.trim();
    const password = $("password").value;

    if (!email || !password) return alert("Please enter email & password.");

    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
};

// ✅ LOGOUT
window.logout = async () => {
  await signOut(auth);
  window.location.href = "login.html";
};

// ✅ PROTECT PAGES
onAuthStateChanged(auth, (user) => {
  const protectedPage = document.body.dataset.protected === "true";
  if (protectedPage && !user) window.location.href = "login.html";

  // show email if element exists
  const who = document.getElementById("who");
  if (who && user) who.textContent = user.email;
});
