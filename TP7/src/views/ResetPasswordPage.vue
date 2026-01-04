<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="max-w-md w-full">
      <div class="bg-white rounded-lg shadow-lg p-8">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-gray-900">Réinitialisation</h2>
          <p class="text-gray-600 mt-2">Entrez votre email pour réinitialiser votre mot de passe</p>
        </div>

        <form v-if="!success" @submit.prevent="handleSubmit" class="space-y-6">
          <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {{ error }}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="votre@email.com"
            >
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full bg-primary text-white py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Envoi...' : 'Envoyer le lien' }}
          </button>
        </form>

        <div v-else class="space-y-4">
          <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            Un email de réinitialisation a été envoyé à {{ email }}
          </div>
          <router-link 
            to="/login" 
            class="block w-full text-center bg-primary text-white py-3 rounded-lg hover:bg-blue-600"
          >
            Retour à la connexion
          </router-link>
        </div>

        <div class="mt-6 text-center">
          <router-link to="/login" class="text-primary hover:underline">
            Retour à la connexion
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleSubmit = async () => {
  try {
    loading.value = true
    error.value = ''
    await authStore.resetPassword(email.value)
    success.value = true
  } catch (err) {
    error.value = 'Une erreur est survenue. Vérifiez votre email.'
  } finally {
    loading.value = false
  }
}
</script>