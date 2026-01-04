import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  Timestamp,
  increment
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useReplyStore = defineStore('reply', () => {
  const replies = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchReplies = async (discussionId) => {
    try {
      loading.value = true
      error.value = null
      const q = query(
        collection(db, 'replies'), 
        where('discussionId', '==', discussionId),
        orderBy('createdAt', 'asc')
      )
      const snapshot = await getDocs(q)
      replies.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (err) {
      error.value = err.message
      console.error('Error fetching replies:', err)
    } finally {
      loading.value = false
    }
  }

  const createReply = async (replyData) => {
    try {
      loading.value = true
      error.value = null
      const docRef = await addDoc(collection(db, 'replies'), {
        ...replyData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      })

      const discussionRef = doc(db, 'discussions', replyData.discussionId)
      await updateDoc(discussionRef, {
        replyCount: increment(1),
        updatedAt: Timestamp.now()
      })

      return docRef.id
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateReply = async (id, updates) => {
    try {
      loading.value = true
      error.value = null
      const docRef = doc(db, 'replies', id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.now()
      })
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteReply = async (id, discussionId) => {
    try {
      loading.value = true
      error.value = null
      await deleteDoc(doc(db, 'replies', id))

      const discussionRef = doc(db, 'discussions', discussionId)
      await updateDoc(discussionRef, {
        replyCount: increment(-1)
      })
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    replies,
    loading,
    error,
    fetchReplies,
    createReply,
    updateReply,
    deleteReply
  }
})