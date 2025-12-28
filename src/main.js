import './style.css';
import { app as firebase } from './firebase-config.js';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut 
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  onSnapshot, 
  deleteDoc,
  query,
  orderBy 
} from "firebase/firestore";

// Initialize Services (ONLY ONCE)
const auth = getAuth(firebase);
const db = getFirestore(firebase);
const googleAuthProvider = new GoogleAuthProvider();

// Select Elements
const loginBtn = document.querySelector('.login');
const logoutBtn = document.querySelector('.logout');
const h3 = document.querySelector('h3');
const section = document.querySelector('section');
const form = document.querySelector('form');
const input = document.querySelector('input');

const toDosColRef = collection(db, 'toDos');

//Authentication Logic
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

    // Create a query that sorts by the 'createdAt' field
    const q = query(toDosColRef, orderBy('createdAt', 'desc'));

    // Listen to the SORTED query instead of the whole collection
    onSnapshot(q, (snapshot) => {
      section.innerHTML = ''; 
      
      snapshot.forEach((snapshotDoc) => {
        const item = snapshotDoc.data();
        const id = snapshotDoc.id;

        const todoDiv = document.createElement('div');
        todoDiv.className = 'todo-item';
        todoDiv.innerHTML = `
          <p>${item.toDo}</p>
          <button class="delete-btn">Delete</button>
        `;

        const deleteBtn = todoDiv.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
          const docRef = doc(db, 'toDos', id);
          await deleteDoc(docRef);
        });

        section.appendChild(todoDiv);
      });
    });

  } else {
    console.log("No user.");
    loginBtn.classList.add('show');
    logoutBtn.classList.remove('show');
    section.innerHTML = ''; 
  }
});

// Adding To-Do Items
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  if (auth.currentUser && input.value.trim() !== "") {
    const docRef = doc(toDosColRef); 
    await setDoc(docRef, {
      toDo: input.value,
      createdAt: new Date() // This is what the 'orderBy' uses!
    });
    input.value = '';
  } else if (!auth.currentUser) {
    h3.innerHTML = 'Please log in to add a to do';
  }
});