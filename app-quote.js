import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// SAME CONFIG (copy from your auth.js)
const firebaseConfig = {
  apiKey: "AIzaSyC0V3HNsxGM8EqKmvaVoG78zF94QmWpvXE",
  authDomain: "kel-website.firebaseapp.com",
  projectId: "kel-website",
  storageBucket: "kel-website.firebasestorage.app",
  messagingSenderId: "954488607948",
  appId: "1:954488607948:web:7694ccb088374543895e69",
};

const app = window.__kelFirebaseApp || (window.__kelFirebaseApp = initializeApp(firebaseConfig));
const db = getFirestore(app);

const form = document.getElementById("quoteForm");
const result = document.getElementById("quoteResult");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    fullName: document.getElementById("fullName").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    service: document.getElementById("service").value,
    location: document.getElementById("location").value.trim(),
    details: document.getElementById("details").value.trim(),
    status: "New",
    createdAt: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, "requests"), payload);
    result.style.display = "block";
    result.innerHTML = `<strong>Request sent!</strong><span>We received your request. WhatsApp KEL if urgent: 076 864 1645</span>`;
    form.reset();
  } catch (err) {
    console.error(err);
    result.style.display = "block";
    result.innerHTML = `<strong>Error</strong><span>${err.message}</span>`;
  }
});
