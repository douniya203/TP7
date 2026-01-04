<template>
  <nav class="bg-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center">
          <router-link to="/" class="flex items-center space-x-2">
            <span class="text-2xl">💬</span>
            <span class="text-xl font-bold text-primary">Forum Communautaire</span>
          </router-link>
        </div>

        <div class="hidden md:flex items-center space-x-4">
          <router-link to="/" class="text-gray-700 hover:text-primary px-3 py-2 rounded-md">
            Accueil
          </router-link>
          <router-link 
            v-if="authStore.isAuthenticated" 
            to="/discussion/new" 
            class="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Nouvelle Discussion
          </router-link>
        </div>

        <div class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated">
            <router-link to="/profile" class="flex items-center space-x-2 text-gray-700 hover:text-primary">
              <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white">
                {{ authStore.user.displayName?.charAt(0).toUpperCase() }}
              </div>
              <span class="hidden md:block">{{ authStore.user.displayName }}</span>
            </router-link>
            <button 
              @click="handleLogout" 
              class="text-gray-700 hover:text-red-600 px-3 py-2"
            >
              Déconnexion
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="text-gray-700 hover:text-primary px-3 py-2">
              Connexion
            </router-link>
            <router-link to="/register" class="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Inscription
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  await authStore.logout()
  router.push('/')
}
</script>