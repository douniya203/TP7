<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-8">Mon Profil</h1>

        <div v-if="success" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Profil mis à jour avec succès !
        </div>

        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {{ error }}
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="flex items-center space-x-6 mb-8">
            <div class="w-24 h-24 bg-primary rounded-full flex items-center justify-center text-white text-4xl">
              {{ authStore.user?.displayName?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h2 class="text-2xl font-semibold text-gray-900">{{ authStore.user?.displayName }}</h2>
              <p class="text-gray-600">{{ authStore.user?.email }}</p>
              <p v-if="authStore.isModerator" class="text-sm text-purple-600 font-semibold mt-1">
                🛡️ Modérateur
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom d'utilisateur</label>
            <input
              v-model="displayName"
              type="text"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea
              v-model="bio"
              rows="4"
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Parlez-nous de vous..."
            ></textarea>
          </div>

          <div class="flex space-x-4">
            <button
              type="submit"
              :disabled="loading"
              class="bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              {{ loading ? 'Enregistrement...' : 'Enregistrer' }}
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
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import NavBar from '@/components/NavBar.vue'

const authStore = useAuthStore()

const displayName = ref('')
const bio = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

onMounted(() => {
  if (authStore.user) {
    displayName.value = authStore.user.displayName || ''
    bio.value = authStore.user.bio || ''
  }
})

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    success.value = false
    
    await authStore.updateUserProfile({
      displayName: displayName.value,
      bio: bio.value
    })
    
    success.value = true
    setTimeout(() => {
      success.value = false
    }, 3000)
  } catch (err) {
    error.value = 'Une erreur est survenue lors de la mise à jour'
  } finally {
    loading.value = false
  }
}
</script>