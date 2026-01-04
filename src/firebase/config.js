import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAZLcRK0FjGePQjHPW6VNf7aUEbkYdUl0w",
  authDomain: "forum-929d5.firebaseapp.com",
  projectId: "forum-929d5",
  storageBucket: "forum-929d5.firebasestorage.app",
  messagingSenderId: "656696292876",
  appId: "1:656696292876:web:de5e1e374519f4f53ce029"
};

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }