<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="discussionStore.loading" class="text-center py-8">
        <p class="text-gray-600">Chargement...</p>
      </div>

      <div v-else-if="discussionStore.error" class="text-center py-8">
        <p class="text-red-600">{{ discussionStore.error }}</p>
        <router-link to="/" class="text-primary hover:underline mt-4 inline-block">
          Retour à l'accueil
        </router-link>
      </div>

      <div v-else-if="discussion">
        <div class="bg-white rounded-lg shadow-lg p-8 mb-6">
          <div class="flex items-center space-x-2 mb-4">
            <span class="text-2xl">{{ categoryIcon }}</span>
            <span class="text-sm text-gray-500">{{ categoryName }}</span>
          </div>

          <h1 class="text-3xl font-bold text-gray-900 mb-4">{{ discussion.title }}</h1>

          <div class="flex items-center space-x-4 text-sm text-gray-500 mb-6">
            <div class="flex items-center space-x-1">
              <span>👤</span>
              <span>{{ discussion.authorName }}</span>
            </div>
            <div class="flex items-center space-x-1">
              <span>🕒</span>
              <span>{{ formatDate(discussion.createdAt) }}</span>
            </div>
          </div>

          <div class="prose max-w-none text-gray-700 whitespace-pre-wrap mb-6">
            {{ discussion.content }}
          </div>

          <div v-if="canEdit" class="flex space-x-2">
            <button 
              @click="handleDelete"
              class="text-red-600 hover:text-red-800 text-sm font-semibold"
            >
              🗑️ Supprimer la discussion
            </button>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-lg p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            Réponses ({{ replyStore.replies.length }})
          </h2>

          <div v-if="authStore.isAuthenticated" class="mb-8">
            <textarea
              v-model="newReply"
              rows="4"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Écrivez votre réponse..."
            ></textarea>
            <button
              @click="handleReply"
              :disabled="!newReply.trim() || replyLoading"
              class="mt-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {{ replyLoading ? 'Publication...' : 'Répondre' }}
            </button>
          </div>

          <div v-else class="mb-8 bg-gray-100 p-4 rounded-lg text-center">
            <p class="text-gray-600">
              <router-link to="/login" class="text-primary hover:underline">Connectez-vous</router-link>
              pour répondre à cette discussion
            </p>
          </div>

          <div class="space-y-4">
            <ReplyCard
              v-for="reply in replyStore.replies"
              :key="reply.id"
              :reply="reply"
              @deleted="loadReplies"
              @updated="loadReplies"
            />
          </div>

          <div v-if="replyStore.replies.length === 0" class="text-center py-8 text-gray-500">
            Aucune réponse pour le moment. Soyez le premier à répondre !
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useDiscussionStore } from '@/stores/discussionStore'
import { useReplyStore } from '@/stores/replyStore'
import { useCategoryStore } from '@/stores/categoryStore'
import NavBar from '@/components/NavBar.vue'
import ReplyCard from '@/components/ReplyCard.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const discussionStore = useDiscussionStore()
const replyStore = useReplyStore()
const categoryStore = useCategoryStore()

const newReply = ref('')
const replyLoading = ref(false)

const discussion = computed(() => discussionStore.currentDiscussion)
const category = computed(() => categoryStore.getCategoryById(discussion.value?.categoryId))
const categoryIcon = computed(() => category.value?.icon || '📌')
const categoryName = computed(() => category.value?.name || 'Non catégorisé')

const canEdit = computed(() => {
  return authStore.user?.uid === discussion.value?.authorId || authStore.isModerator
})

onMounted(async () => {
  await discussionStore.fetchDiscussionById(route.params.id)
  await loadReplies()
})

const loadReplies = async () => {
  await replyStore.fetchReplies(route.params.id)
}

const handleReply = async () => {
  if (!newReply.value.trim()) return

  try {
    replyLoading.value = true
    await replyStore.createReply({
      discussionId: route.params.id,
      content: newReply.value,
      authorId: authStore.user.uid,
      authorName: authStore.user.displayName
    })
    newReply.value = ''
    await loadReplies()
  } catch (error) {
    alert('Erreur lors de la publication de la réponse')
  } finally {
    replyLoading.value = false
  }
}

const handleDelete = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette discussion ?')) {
    try {
      await discussionStore.deleteDiscussion(route.params.id)
      router.push('/')
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleString('fr-FR')
}
</script>