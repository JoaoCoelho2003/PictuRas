<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div 
      class="bg-white rounded-lg p-4 sm:p-6 md:p-8 max-w-md w-full transform transition-all duration-300 ease-in-out max-h-[90vh] overflow-y-auto" 
      :class="{ 'scale-100 opacity-100': show, 'scale-95 opacity-0': !show }"
    >
      <h2 class="text-xl sm:text-2xl font-bold mb-4">Confirm Changes</h2>
      <p class="mb-4 text-sm sm:text-base">Are you sure you want to save the following changes?</p>
      <ul class="list-disc list-inside mb-6">
        <li v-for="[key, value] in changes" :key="key" class="mb-2 text-sm sm:text-base">
          <span class="font-semibold">{{ key }}:</span> {{ value }}
        </li>
      </ul>
      <div class="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
        <button
          @click="$emit('cancel')"
          class="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-700 rounded-full hover:bg-gray-400 transition-colors duration-300 text-sm sm:text-base"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm')"
          class="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors duration-300 text-sm sm:text-base"
        >
          Confirm
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

defineProps<{
  changes: [string, string][];
}>();

defineEmits<{
  (e: 'confirm'): void;
  (e: 'cancel'): void;
}>();

const show = ref(false);

onMounted(() => {
  setTimeout(() => {
    show.value = true;
  }, 50);
});
</script>