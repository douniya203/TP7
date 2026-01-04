import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCategoryStore = defineStore('category', () => {
  const categories = ref([
    { id: 'general', name: 'Général', icon: '💬', color: 'blue' },
    { id: 'tech', name: 'Technologie', icon: '💻', color: 'purple' },
    { id: 'gaming', name: 'Jeux Vidéo', icon: '🎮', color: 'green' },
    { id: 'sports', name: 'Sports', icon: '⚽', color: 'red' },
    { id: 'music', name: 'Musique', icon: '🎵', color: 'pink' },
    { id: 'movies', name: 'Films & Séries', icon: '🎬', color: 'yellow' },
    { id: 'science', name: 'Science', icon: '🔬', color: 'indigo' },
    { id: 'other', name: 'Autre', icon: '📌', color: 'gray' }
  ])

  const getCategoryById = (id) => {
    return categories.value.find(cat => cat.id === id)
  }

  const getCategoryName = (id) => {
    const category = getCategoryById(id)
    return category ? category.name : 'Non catégorisé'
  }

  return {
    categories,
    getCategoryById,
    getCategoryName
  }
})