<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <router-link
      v-for="category in categoryStore.categories"
      :key="category.id"
      :to="`/category/${category.id}`"
      class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all hover:scale-105"
    >
      <div class="text-4xl mb-3">{{ category.icon }}</div>
      <h3 class="text-lg font-semibold text-gray-900">{{ category.name }}</h3>
    </router-link>
  </div>
</template>

<script setup>
import { useCategoryStore } from '@/stores/categoryStore'

const categoryStore = useCategoryStore()
</script>