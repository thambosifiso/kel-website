// upload-firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ✅ Same config as your auth.js
const firebaseConfig = {
  apiKey: "AIzaSyC0V3HNsxGM8EqKmvaVoG78zF94QmWpvXE",
  authDomain: "kel-website.firebaseapp.com",
  projectId: "kel-website",
  storageBucket: "kel-website.firebasestorage.app",
  messagingSenderId: "954488607948",
  appId: "1:954488607948:web:7694ccb088374543895e69",
};

const app = window.__kelFirebaseApp || (window.__kelFirebaseApp = initializeApp(firebaseConfig));
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

const form = document.getElementById("uploadForm");
const statusBox = document.getElementById("statusBox");
const who = document.getElementById("who");

let currentUser = null;

function showStatus(title, text) {
  statusBox.style.display = "block";
  statusBox.innerHTML = `<strong>${title}</strong><span>${text}</span>`;
}

onAuthStateChanged(auth, (user) => {
  currentUser = user;

  // Protect the page: redirect if not logged in
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  if (who) who.textContent = user.displayName || user.email;
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!currentUser) return;

  const jobRef = document.getElementById("jobRef").value.trim();
  const photoType = document.getElementById("photoType").value;
  const files = document.getElementById("files").files;

  if (!files || files.length === 0) {
    alert("Please select at least one image.");
    return;
  }

  showStatus("Uploading...", "Please wait while your photos upload.");

  try {
    let uploadedCount = 0;

    for (const file of files) {
      // basic file guard
      if (!file.type.startsWith("image/")) continue;

      const safeName = file.name.replace(/\s+/g, "_");
      const path = `uploads/${currentUser.uid}/${Date.now()}_${safeName}`;

      // upload to Storage
      const storageRef = ref(storage, path);
      await uploadBytes(storageRef, file);

      // get URL
      const url = await getDownloadURL(storageRef);

      // save metadata to Firestore
      await addDoc(collection(db, "uploads"), {
        uid: currentUser.uid,
        email: currentUser.email,
        displayName: currentUser.displayName || "",
        jobRef: jobRef || "",
        photoType,
        fileName: safeName,
        storagePath: path,
        url,
        createdAt: serverTimestamp(),
      });

      uploadedCount++;
    }

    showStatus("Done ✅", `${uploadedCount} file(s) uploaded successfully.`);
    form.reset();
  } catch (err) {
    console.error(err);
    showStatus("Upload failed ❌", err.message);
  }
});
