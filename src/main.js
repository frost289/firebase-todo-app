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


import { 
  getFirestore, 
  collection, 
  doc,           
  setDoc, 
  onSnapshot,
  deleteDoc     
} from "firebase/firestore";
// 1. Initialize Services
const auth = getAuth(firebase);
const db = getFirestore(firebase);
const googleAuthProvider = new GoogleAuthProvider();


const loginBtn = document.querySelector('.login');
const logoutBtn = document.querySelector('.logout');
const h3 = document.querySelector('h3');
const section = document.querySelector('section');
const form = document.querySelector('form');
const input = document.querySelector('input');

const toDosColRef = collection(db, 'toDos');

// Authentication Logic
loginBtn.addEventListener('click', () => {
  signInWithPopup(auth, googleAuthProvider).catch(err => console.error(err));
});

logoutBtn.addEventListener('click', () => {
  signOut(auth);
});

// Auth State & Data Loading
auth.onAuthStateChanged(user => {
  if (user) {
    console.log("Logged in as:", user.displayName);
    logoutBtn.classList.add('show');
    loginBtn.classList.remove('show');
    h3.innerHTML = '';

   onSnapshot(toDosColRef, (snapshot) => {
  section.innerHTML = ''; 
  
  snapshot.forEach((snapshotDoc) => {
    const item = snapshotDoc.data();
    const id = snapshotDoc.id; // Get the document ID

    // to-Do container
    const todoDiv = document.createElement('div');
    todoDiv.className = 'todo-item';
    todoDiv.innerHTML = `
      <p>${item.toDo}</p>
      <button class="delete-btn">Delete</button>
    `;

    // delete button event listener
    const deleteBtn = todoDiv.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', async () => {
      // This targets the specific document in Firestore by its ID
      const docRef = doc(db, 'toDos', id);
      await deleteDoc(docRef);
    });

    // display to-do item o the screen
    section.appendChild(todoDiv);
  });
});

  } else {
    console.log("No user.");
    loginBtn.classList.add('show');
    logoutBtn.classList.remove('show');
    section.innerHTML = ''; // Clear list on logout
  }
});

// Adding To-Do Items
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (auth.currentUser) {
    const docRef = doc(toDosColRef); 
    await setDoc(docRef, {
      toDo: input.value,
      createdAt: new Date() //timestamp(sorting)
    });
    input.value = '';
  } else {
    h3.innerHTML = 'Please log in to add a to do';
  }
});