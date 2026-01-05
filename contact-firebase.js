// contact-firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ✅ Use the SAME Firebase config you used in auth.js
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

// Your form IDs from contact.html
const form = document.getElementById("quoteForm");

// ✅ Save to Firestore + then open WhatsApp
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const service = document.getElementById("service").value;
  const location = document.getElementById("location").value.trim();
  const date = document.getElementById("date").value.trim();
  const message = document.getElementById("message").value.trim();

  // 1) Save to Firestore
  try {
    await addDoc(collection(db, "requests"), {
      name,
      phone,
      service,
      location,
      date,
      message,
      status: "New",
      source: "Website Contact Page",
      createdAt: serverTimestamp(),
    });
  } catch (err) {
    console.error("Firestore save failed:", err);
    // even if save fails, still let WhatsApp open
  }

  // 2) Build WhatsApp message (same behavior you want)
  const text =
    `Hi KEL, I need a quote.%0A%0A` +
    `Name: ${encodeURIComponent(name)}%0A` +
    `Phone: ${encodeURIComponent(phone)}%0A` +
    `Service: ${encodeURIComponent(service)}%0A` +
    `Location: ${encodeURIComponent(location)}%0A` +
    `Date/Period: ${encodeURIComponent(date || "Not specified")}%0A%0A` +
    `Details: ${encodeURIComponent(message)}`;

  // KEL WhatsApp number (South Africa +27)
  const waUrl = `https://wa.me/27768641645?text=${text}`;

  window.open(waUrl, "_blank", "noopener");

  // Optional: clear form after opening WhatsApp
  form.reset();
});
