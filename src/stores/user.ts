import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'viewer'
  department: string
  avatar?: string
}

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User>({
    id: '1',
    name: 'Maria Silva',
    email: 'maria.silva@empresa.com',
    role: 'admin',
    department: 'TI',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  })

  const isAuthenticated = ref(true)

  const login = (email: string, password: string) => {
    // Simular login
    isAuthenticated.value = true
    return Promise.resolve(true)
  }

  const logout = () => {
    isAuthenticated.value = false
    currentUser.value = null as any
  }

  const updateProfile = (updates: Partial<User>) => {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...updates }
    }
  }

  return {
    currentUser,
    isAuthenticated,
    login,
    logout,
    updateProfile
  }
})