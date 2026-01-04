<template>
  <div class="bg-gray-50 rounded-lg p-4 mb-4">
    <div class="flex items-start space-x-3">
      <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white flex-shrink-0">
        {{ reply.authorName?.charAt(0).toUpperCase() }}
      </div>
      
      <div class="flex-1">
        <div class="flex items-center justify-between mb-2">
          <div>
            <span class="font-semibold text-gray-900">{{ reply.authorName }}</span>
            <span class="text-sm text-gray-500 ml-2">{{ formatDate(reply.createdAt) }}</span>
          </div>
          
          <div v-if="canEdit" class="flex space-x-2">
            <button 
              v-if="!isEditing"
              @click="isEditing = true"
              class="text-blue-600 hover:text-blue-800 text-sm"
            >
              Modifier
            </button>
            <button 
              @click="handleDelete"
              class="text-red-600 hover:text-red-800 text-sm"
            >
              Supprimer
            </button>
          </div>
        </div>
        
        <div v-if="!isEditing" class="text-gray-700 whitespace-pre-wrap">
          {{ reply.content }}
        </div>
        
        <div v-else class="space-y-2">
          <textarea 
            v-model="editedContent"
            class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            rows="3"
          ></textarea>
          <div class="flex space-x-2">
            <button 
              @click="handleUpdate"
              class="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Enregistrer
            </button>
            <button 
              @click="cancelEdit"
              class="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            >
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useReplyStore } from '@/stores/replyStore'

const props = defineProps({
  reply: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['deleted', 'updated'])

const authStore = useAuthStore()
const replyStore = useReplyStore()

const isEditing = ref(false)
const editedContent = ref(props.reply.content)

const canEdit = computed(() => {
  return authStore.user?.uid === props.reply.authorId || authStore.isModerator
})

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleString('fr-FR')
}

const handleUpdate = async () => {
  try {
    await replyStore.updateReply(props.reply.id, { content: editedContent.value })
    isEditing.value = false
    emit('updated')
  } catch (error) {
    alert('Erreur lors de la mise à jour')
  }
}

const handleDelete = async () => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) {
    try {
      await replyStore.deleteReply(props.reply.id, props.reply.discussionId)
      emit('deleted')
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editedContent.value = props.reply.content
}
</script>