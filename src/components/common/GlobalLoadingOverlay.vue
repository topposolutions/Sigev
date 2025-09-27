<template>
  <div v-if="isLoading" class="loading-overlay">
    <div class="loading-content">
      <div class="loading-spinner">
        <div class="spinner-border" role="status">
          <span class="visually-hidden"> </span>
        </div>
      </div>
      <div class="loading-text">
        {{ isLoadingText }}
      </div>
    </div>
  </div>
</template>

<script setup>
//@ts-ignore
import { useHtmlClassStore } from '../../stores/htmlclass.simple.store.js';
import { computed } from 'vue';

const htmlClassStore = useHtmlClassStore();

const isLoading = computed(() => htmlClassStore.getIsLoading);
const isLoadingText = computed(() => htmlClassStore.getIsLoadingText);
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999999;
  backdrop-filter: blur(2px);
}

.loading-content {
  text-align: center;
  color: white;
}

.loading-spinner {
  margin-bottom: 1rem;
}

.loading-spinner .spinner-border {
  width: 4rem;
  height: 4rem;
  border-width: 0.5rem;
  border-color: #7dba19;
  border-right-color: transparent;
}

.loading-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: white;
  margin: 0;
}
</style> 