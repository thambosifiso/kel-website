// auth.js — FINAL, CLEAN VERSION (GitHub Pages compatible)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

/* 🔐 FIREBASE CONFIG (YOUR REAL DETAILS) */
const firebaseConfig = {
  apiKey: "AIzaSyC0V3HNsxGM8EqKmvaVoG78zF94QmWpvXE",
  authDomain: "kel-website.firebaseapp.com",
  projectId: "kel-website",
  storageBucket: "kel-website.firebasestorage.app",
  messagingSenderId: "954488607948",
  appId: "1:954488607948:web:7694ccb088374543895e69",
};

/* INIT FIREBASE SAFELY */
const app = window.__kelFirebaseApp || (window.__kelFirebaseApp = initializeApp(firebaseConfig));
const auth = getAuth(app);

/* HELPER */
const $ = (id) => document.getElementById(id);

/* =======================
   SIGN UP (WITH FULL VALIDATION)
   ======================= */
window.signup = async () => {
  try {
    const firstName = $("firstName").value.trim();
    const lastName = $("lastName").value.trim();
    const email = $("email").value.trim();
    const password = $("password").value;

    /* NAME VALIDATION */
    if (!firstName) return alert("First name is required.");
    if (!lastName) return alert("Surname is required.");

    /* EMAIL VALIDATION */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return alert("Email is required.");
    if (!emailRegex.test(email)) return alert("Enter a valid email address.");

    /* PASSWORD VALIDATION */
    if (password.length < 8)
      return alert("Password must be at least 8 characters.");
    if (!/[A-Z]/.test(password))
      return alert("Password must include an uppercase letter.");
    if (!/[a-z]/.test(password))
      return alert("Password must include a lowercase letter.");
    if (!/[0-9]/.test(password))
      return alert("Password must include a number.");
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
      return alert("Password must include a special character.");

    /* CREATE ACCOUNT */
    const cred = await createUserWithEmailAndPassword(auth, email, password);

    /* SAVE NAME + SURNAME */
    await updateProfile(cred.user, {
      displayName: `${firstName} ${lastName}`,
    });

    alert("Account created successfully!");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
};

/* =======================
   LOGIN
   ======================= */
window.login = async () => {
  try {
    const email = $("email").value.trim();
    const password = $("password").value;

    if (!email || !password)
      return alert("Please enter email and password.");

    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
    console.error(err);
  }
};

/* =======================
   LOGOUT
   ======================= */
window.logout = async () => {
  await signOut(auth);
  window.location.href = "login.html";
};

/* =======================
   PAGE PROTECTION + DISPLAY NAME
   ======================= */
onAuthStateChanged(auth, (user) => {
  const protectedPage = document.body.dataset.protected === "true";
  if (protectedPage && !user) {
    window.location.href = "login.html";
  }

  const who = document.getElementById("who");
  if (who && user) {
    who.textContent = user.displayName || user.email;
  }
});
