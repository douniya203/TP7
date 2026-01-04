<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div v-if="category" class="mb-8">
        <div class="flex items-center space-x-4 mb-4">
          <span class="text-5xl">{{ category.icon }}</span>
          <div>
            <h1 class="text-3xl font-bold text-gray-900">{{ category.name }}</h1>
            <p class="text-gray-600">Discussions dans cette catégorie</p>
          </div>
        </div>
      </div>

      <div class="mb-6 flex items-center justify-between">
        <router-link
          to="/"
          class="text-primary hover:underline flex items-center space-x-2"
        >
          <span>←</span>
          <span>Retour aux catégories</span>
        </router-link>

        <router-link 
          v-if="authStore.isAuthenticated"
          to="/discussion/new" 
          class="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Nouvelle Discussion
        </router-link>
      </div>

      <div v-if="discussionStore.loading" class="text-center py-8">
        <p class="text-gray-600">Chargement...</p>
      </div>

      <div v-else-if="discussionStore.discussions.length === 0" class="text-center py-8 bg-white rounded-lg shadow p-8">
        <p class="text-gray-600 mb-4">Aucune discussion dans cette catégorie</p>
        <router-link 
          v-if="authStore.isAuthenticated"
          to="/discussion/new" 
          class="inline-block bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600"
        >
          Créer la première discussion
        </router-link>
      </div>

      <div v-else class="space-y-4">
        <DiscussionCard
          v-for="discussion in discussionStore.discussions"
          :key="discussion.id"
          :discussion="discussion"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useDiscussionStore } from '@/stores/discussionStore'
import { useCategoryStore } from '@/stores/categoryStore'
import NavBar from '@/components/NavBar.vue'
import DiscussionCard from '@/components/DiscussionCard.vue'

const route = useRoute()
const authStore = useAuthStore()
const discussionStore = useDiscussionStore()
const categoryStore = useCategoryStore()

const category = computed(() => categoryStore.getCategoryById(route.params.id))

onMounted(() => {
  discussionStore.fetchDiscussions(route.params.id)
})

// Recharger les discussions quand la catégorie change
watch(() => route.params.id, (newId) => {
  if (newId) {
    discussionStore.fetchDiscussions(newId)
  }
})
</script>