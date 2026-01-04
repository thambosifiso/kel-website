// auth.js (FINAL FIX for GitHub Pages)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ✅ Your Firebase configuration (KEEP THESE VALUES)
const firebaseConfig = {
  apiKey: "AIzaSyC0V3HNsxGM8EqKmvaVoG78zF94QmWpvXE",
  authDomain: "kel-website.firebaseapp.com",
  projectId: "kel-website",
  storageBucket: "kel-website.firebasestorage.app",
  messagingSenderId: "954488607948",
  appId: "1:954488607948:web:7694ccb088374543895e69",
};

// ✅ Initialize Firebase ONCE (prevents double init issues)
const app = window.__kelFirebaseApp || (window.__kelFirebaseApp = initializeApp(firebaseConfig));
const auth = getAuth(app);

// helper for inputs
const $ = (id) => document.getElementById(id);

// ✅ SIGN UP
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
    console.error(err);
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
    console.error(err);
  }
};

// ✅ LOGOUT
window.logout = async () => {
  try {
    await signOut(auth);
    window.location.href = "login.html";
  } catch (err) {
    console.error(err);
  }
};

// ✅ PROTECT PAGES + show logged-in email
onAuthStateChanged(auth, (user) => {
  const protectedPage = document.body.dataset.protected === "true";
  if (protectedPage && !user) window.location.href = "login.html";

  const who = document.getElementById("who");
  if (who) who.textContent = user ? user.email : "";
});
