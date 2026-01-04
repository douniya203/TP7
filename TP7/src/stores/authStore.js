import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '@/firebase/config'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(true)
  const error = ref(null)

  const isAuthenticated = computed(() => !!user.value)
  const isModerator = computed(() => user.value?.role === 'moderator' || user.value?.role === 'admin')

  const initAuth = () => {
    return new Promise((resolve) => {
      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
          user.value = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            ...userDoc.data()
          }
        } else {
          user.value = null
        }
        loading.value = false
        resolve()
      })
    })
  }

  const register = async (email, password, displayName) => {
    try {
      error.value = null
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(userCredential.user, { displayName })
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        displayName,
        email,
        photoURL: null,
        bio: '',
        role: 'user',
        createdAt: new Date().toISOString()
      })

      user.value = {
        uid: userCredential.user.uid,
        email,
        displayName,
        photoURL: null,
        bio: '',
        role: 'user'
      }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const login = async (email, password) => {
    try {
      error.value = null
      await signInWithEmailAndPassword(auth, email, password)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const logout = async () => {
    try {
      error.value = null
      await signOut(auth)
      user.value = null
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const resetPassword = async (email) => {
    try {
      error.value = null
      await sendPasswordResetEmail(auth, email)
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  const updateUserProfile = async (updates) => {
    try {
      error.value = null
      const userRef = doc(db, 'users', user.value.uid)
      await updateDoc(userRef, updates)
      user.value = { ...user.value, ...updates }
    } catch (err) {
      error.value = err.message
      throw err
    }
  }

  return {
    user,
    loading,
    error,
    isAuthenticated,
    isModerator,
    initAuth,
    register,
    login,
    logout,
    resetPassword,
    updateUserProfile
  }
})