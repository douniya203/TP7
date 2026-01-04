<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar />
    
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-4">Bienvenue sur le Forum</h1>
        <p class="text-gray-600">Partagez vos idées, posez vos questions et rejoignez la discussion</p>
      </div>

      <div class="mb-8">
        <div class="relative">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Rechercher des discussions..."
            class="w-full p-4 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            @input="handleSearch"
          >
          <span class="absolute left-4 top-4 text-gray-400 text-xl">🔍</span>
        </div>
      </div>

      <div class="mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Catégories</h2>
        <CategoryGrid />
      </div>

      <div>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <h2 class="text-2xl font-bold text-gray-900">Discussions Récentes</h2>
          <div class="flex items-center gap-2">
            <select
              v-model="filterCategory"
              @change="handleFilter"
              class="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary"
            >
              <option value="">Toutes les catégories</option>
              <option v-for="cat in categoryStore.categories" :key="cat.id" :value="cat.id">
                {{ cat.icon }} {{ cat.name }}
              </option>
            </select>
            <button
              v-if="filterCategory"
              @click="clearFilter"
              class="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-lg"
            >
              ✕ Effacer
            </button>
          </div>
        </div>

        <div v-if="discussionStore.loading" class="text-center py-8">
          <p class="text-gray-600">Chargement...</p>
        </div>

        <div v-else-if="discussionStore.discussions.length === 0" class="text-center py-8">
          <p class="text-gray-600">Aucune discussion trouvée</p>
          <router-link 
            v-if="authStore.isAuthenticated"
            to="/discussion/new" 
            class="inline-block mt-4 bg-primary text-white px-6 py-3 rounded-lg hover:bg-blue-600"
          >
            Créer une discussion
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useDiscussionStore } from '@/stores/discussionStore'
import { useCategoryStore } from '@/stores/categoryStore'
import { useAuthStore } from '@/stores/authStore'
import NavBar from '@/components/NavBar.vue'
import CategoryGrid from '@/components/CategoryGrid.vue'
import DiscussionCard from '@/components/DiscussionCard.vue'

const discussionStore = useDiscussionStore()
const categoryStore = useCategoryStore()
const authStore = useAuthStore()

const searchTerm = ref('')
const filterCategory = ref('')

onMounted(() => {
  discussionStore.fetchDiscussions()
})

const handleSearch = () => {
  discussionStore.fetchDiscussions(filterCategory.value, searchTerm.value)
}

const handleFilter = () => {
  discussionStore.fetchDiscussions(filterCategory.value, searchTerm.value)
}

const clearFilter = () => {
  filterCategory.value = ''
  discussionStore.fetchDiscussions('', searchTerm.value)
}
</script>