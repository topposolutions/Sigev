<template>
  <div class="profile-page container py-5">
    <div class="profile-card mx-auto p-4">
      <div class="d-flex align-items-center mb-4">
        <img :src="user.avatar" alt="Avatar" class="rounded-circle me-4" width="96" height="96" />
        <div>
          <h3 class="fw-bold mb-1">{{ user.name }}</h3>
          <div class="text-muted mb-1">{{ user.email }}</div>
          <div class="text-secondary small">{{ user.department }} • {{ user.position }}</div>
        </div>
      </div>
      <div class="d-flex gap-2">
        <router-link to="/settings" class="btn btn-outline-primary">
          Editar Perfil
        </router-link>
        <router-link to="/settings?section=security" class="btn btn-outline-secondary">
          Alterar Senha
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/user'
const userStore = useUserStore()
const user = userStore.currentUser
</script>

<style scoped>
.profile-page {
  max-width: 600px;
}
.profile-card {
  background: var(--bg-light);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  margin-top: 2rem;
}
</style> 