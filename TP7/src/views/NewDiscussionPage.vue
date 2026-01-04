<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Nouvelle Discussion</h1>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
            <select
              v-model="categoryId"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">Sélectionnez une catégorie</option>
              <option 
                v-for="cat in categoryStore.categories" 
                :key="cat.id" 
                :value="cat.id"
              >
                {{ cat.icon }} {{ cat.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Titre</label>
            <input
              v-model="title"
              type="text"
              required
              maxlength="200"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Donnez un titre à votre discussion..."
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Contenu</label>
            <textarea
              v-model="content"
              required
              rows="10"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Décrivez votre question ou sujet de discussion..."
            ></textarea>
          </div>

          <div class="flex space-x-4">
            <button
              type="submit"
              :disabled="loading"
              class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {{ loading ? 'Publication...' : 'Publier' }}
            </button>
            <router-link
              to="/"
              class="bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Annuler
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useDiscussionStore } from '@/stores/discussionStore'
import { useCategoryStore } from '@/stores/categoryStore'
import NavBar from '@/components/NavBar.vue'

const router = useRouter()
const authStore = useAuthStore()
const discussionStore = useDiscussionStore()
const categoryStore = useCategoryStore()

const categoryId = ref('')
const title = ref('')
const content = ref('')
const loading = ref(false)
const error = ref('')

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    
    const discussionId = await discussionStore.createDiscussion({
      title: title.value,
      content: content.value,
      categoryId: categoryId.value,
      authorId: authStore.user.uid,
      authorName: authStore.user.displayName
    })
    
    router.push(`/discussion/${discussionId}`)
  } catch (err) {
    error.value = 'Une erreur est survenue lors de la création'
  } finally {
    loading.value = false
  }
}
</script>