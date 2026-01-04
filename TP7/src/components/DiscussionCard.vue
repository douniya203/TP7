<template>
  <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
    <div class="flex items-start justify-between">
      <div class="flex-1">
        <div class="flex items-center space-x-2 mb-2">
          <span class="text-2xl">{{ categoryIcon }}</span>
          <span class="text-sm text-gray-500">{{ categoryName }}</span>
        </div>
        
        <router-link 
          :to="`/discussion/${discussion.id}`"
          class="text-xl font-semibold text-gray-900 hover:text-primary mb-2 block"
        >
          {{ discussion.title }}
        </router-link>
        
        <p class="text-gray-600 mb-4 line-clamp-2">
          {{ discussion.content }}
        </p>
        
        <div class="flex items-center space-x-4 text-sm text-gray-500">
          <div class="flex items-center space-x-1">
            <span>👤</span>
            <span>{{ discussion.authorName }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <span>💬</span>
            <span>{{ discussion.replyCount || 0 }} réponses</span>
          </div>
          <div class="flex items-center space-x-1">
            <span>🕒</span>
            <span>{{ formatDate(discussion.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCategoryStore } from '@/stores/categoryStore'

const props = defineProps({
  discussion: {
    type: Object,
    required: true
  }
})

const categoryStore = useCategoryStore()

const category = computed(() => categoryStore.getCategoryById(props.discussion.categoryId))
const categoryIcon = computed(() => category.value?.icon || '📌')
const categoryName = computed(() => category.value?.name || 'Non catégorisé')

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `il y a ${minutes} min`
  if (hours < 24) return `il y a ${hours}h`
  if (days < 7) return `il y a ${days}j`
  return date.toLocaleDateString('fr-FR')
}
</script>