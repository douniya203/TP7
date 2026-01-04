import { defineStore } from 'pinia'
import { ref } from 'vue'
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore'
import { db } from '@/firebase/config'

export const useDiscussionStore = defineStore('discussion', () => {
  const discussions = ref([])
  const currentDiscussion = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetchDiscussions = async (categoryId = null, searchTerm = null) => {
    try {
      loading.value = true
      error.value = null
      
      let q
      
      // Si une catégorie est sélectionnée
      if (categoryId) {
        // Sans orderBy pour éviter le problème d'index
        q = query(
          collection(db, 'discussions'), 
          where('categoryId', '==', categoryId)
        )
      } else {
        // Sinon, récupérer toutes les discussions avec tri
        q = query(
          collection(db, 'discussions'), 
          orderBy('createdAt', 'desc')
        )
      }

      const snapshot = await getDocs(q)
      let results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))

      // Trier manuellement par date si on a filtré par catégorie
      if (categoryId) {
        results.sort((a, b) => {
          const dateA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0
          const dateB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0
          return dateB - dateA
        })
      }

      // Appliquer le filtre de recherche si nécessaire
      if (searchTerm && searchTerm.trim()) {
        const lowerSearch = searchTerm.toLowerCase()
        results = results.filter(d => 
          d.title?.toLowerCase().includes(lowerSearch) ||
          d.content?.toLowerCase().includes(lowerSearch)
        )
      }

      discussions.value = results
    } catch (err) {
      error.value = err.message
      console.error('Error fetching discussions:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchDiscussionById = async (id) => {
    try {
      loading.value = true
      error.value = null
      const docRef = doc(db, 'discussions', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        currentDiscussion.value = {
          id: docSnap.id,
          ...docSnap.data()
        }
      } else {
        error.value = 'Discussion non trouvée'
      }
    } catch (err) {
      error.value = err.message
      console.error('Error fetching discussion:', err)
    } finally {
      loading.value = false
    }
  }

  const createDiscussion = async (discussionData) => {
    try {
      loading.value = true
      error.value = null
      
      // Vérifier que categoryId existe
      if (!discussionData.categoryId) {
        throw new Error('La catégorie est requise')
      }
      
      const docRef = await addDoc(collection(db, 'discussions'), {
        title: discussionData.title,
        content: discussionData.content,
        categoryId: discussionData.categoryId,
        authorId: discussionData.authorId,
        authorName: discussionData.authorName,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        replyCount: 0,
        views: 0
      })
      return docRef.id
    } catch (err) {
      error.value = err.message
      console.error('Error creating discussion:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateDiscussion = async (id, updates) => {
    try {
      loading.value = true
      error.value = null
      const docRef = doc(db, 'discussions', id)
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

  const deleteDiscussion = async (id) => {
    try {
      loading.value = true
      error.value = null
      await deleteDoc(doc(db, 'discussions', id))
      
      const repliesQuery = query(collection(db, 'replies'), where('discussionId', '==', id))
      const repliesSnapshot = await getDocs(repliesQuery)
      repliesSnapshot.forEach(async (replyDoc) => {
        await deleteDoc(doc(db, 'replies', replyDoc.id))
      })
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchRecentDiscussions = async (limitCount = 5) => {
    try {
      const q = query(collection(db, 'discussions'), orderBy('createdAt', 'desc'), limit(limitCount))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (err) {
      console.error('Error fetching recent discussions:', err)
      return []
    }
  }

  return {
    discussions,
    currentDiscussion,
    loading,
    error,
    fetchDiscussions,
    fetchDiscussionById,
    createDiscussion,
    updateDiscussion,
    deleteDiscussion,
    fetchRecentDiscussions
  }
})