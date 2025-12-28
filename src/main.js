import './style.css';
import { app as firebase } from './firebase-config.js';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot 
} from "firebase/firestore";

// 1. Initialize Services
const auth = getAuth(firebase);
const db = getFirestore(firebase);
const googleAuthProvider = new GoogleAuthProvider();

// 2. Select DOM Elements
const loginBtn = document.querySelector('.login');
const logoutBtn = document.querySelector('.logout');
const h3 = document.querySelector('h3');
const section = document.querySelector('section');
const form = document.querySelector('form');
const input = document.querySelector('input');

// 3. References
const toDosColRef = collection(db, 'toDos');

// 4. Authentication Logic
loginBtn.addEventListener('click', () => {
  signInWithPopup(auth, googleAuthProvider).catch(err => console.error(err));
});

logoutBtn.addEventListener('click', () => {
  signOut(auth);
});

// 5. THE BRAIN: Auth State & Data Loading
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("Logged in as:", user.displayName);
    logoutBtn.classList.add('show');
    loginBtn.classList.remove('show');
    h3.innerHTML = '';

    // START LISTENING TO DATA ONLY AFTER LOGIN
    onSnapshot(toDosColRef, (snapshot) => {
      section.innerHTML = ''; 
      const currentList = [];
      
      snapshot.forEach((doc) => {
        const item = doc.data();
        currentList.push(item);
        
        // Add to UI
        section.innerHTML += `<div><p>${item.toDo}</p></div>`;
      });
      console.log("Database updated:", currentList);
    }, (error) => {
      console.error("Firestore Error:", error.message);
    });

  } else {
    console.log("No user.");
    loginBtn.classList.add('show');
    logoutBtn.classList.remove('show');
    section.innerHTML = ''; // Clear list on logout
  }
});

// 6. Form Submission
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (auth.currentUser) {
    const docRef = doc(toDosColRef); 
    await setDoc(docRef, {
      toDo: input.value,
      createdAt: new Date() // Optional: helps with sorting later!
    });
    input.value = '';
  } else {
    h3.innerHTML = 'Please log in to add a to do';
  }
});