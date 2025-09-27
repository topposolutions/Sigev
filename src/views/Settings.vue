<template>
  <div class="settings-page">
    <!-- Page Header -->
    <div class="mb-4">
      <h4 class="fw-semibold text-dark mb-1">Configurações</h4>
      <p class="text-muted mb-0">Gerencie suas preferências e configurações da conta</p>
    </div>

    <div class="row">
      <!-- Settings Navigation -->
      <div class="col-lg-3 mb-4">
        <div class="card">
          <div class="list-group list-group-flush">
            <button 
              v-for="section in settingsSections" 
              :key="section.id"
              class="list-group-item list-group-item-action d-flex align-items-center"
              :class="{ active: activeSection === section.id }"
              @click="activeSection = section.id"
            >
              <component :is="section.icon" :size="16" class="me-2" />
              {{ section.title }}
            </button>
          </div>
        </div>
      </div>

      <!-- Settings Content -->
      <div class="col-lg-9">
        <!-- Profile Settings -->
        <div v-if="activeSection === 'profile'" class="card">
          <div class="card-header">
            <h5 class="mb-0">Perfil do Usuário</h5>
          </div>
          <div class="card-body">
            <form @submit.prevent="saveProfile">
              <div class="row">
                <div class="col-md-4 text-center">
                  <div class="profile-avatar-section">
                    <img 
                      :src="profileForm.avatar" 
                      alt="Avatar"
                      class="rounded-circle mb-3"
                      width="120"
                      height="120"
                    />
                    <div>
                      <button type="button" class="btn btn-outline-primary btn-sm">
                        <Upload :size="14" class="me-1" />
                        Alterar Foto
                      </button>
                    </div>
                  </div>
                </div>
                
                <div class="col-md-8">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Nome Completo</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="profileForm.name"
                        required
                      >
                    </div>
                    
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Email</label>
                      <input
                        type="email"
                        class="form-control"
                        v-model="profileForm.email"
                        required
                      >
                    </div>
                    
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Departamento</label>
                      <select class="form-select" v-model="profileForm.department">
                        <option value="TI">TI</option>
                        <option value="Operações">Operações</option>
                        <option value="Financeiro">Financeiro</option>
                        <option value="RH">RH</option>
                        <option value="Jurídico">Jurídico</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>
                    
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Cargo</label>
                      <input
                        type="text"
                        class="form-control"
                        v-model="profileForm.position"
                        placeholder="Ex: Analista de Sistemas"
                      >
                    </div>
                  </div>
                  
                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary">
                      <Save :size="16" class="me-1" />
                      Salvar Alterações
                    </button>
                    <button type="button" class="btn btn-outline-secondary" @click="resetProfile">
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>

        <!-- Notification Settings -->
        <div v-if="activeSection === 'notifications'" class="card">
          <div class="card-header">
            <h5 class="mb-0">Notificações</h5>
          </div>
          <div class="card-body">
            <div class="notification-settings">
              <div class="notification-group mb-4">
                <h6 class="fw-semibold mb-3">Notificações por Email</h6>
                
                <div class="form-check mb-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="emailDocuments"
                    v-model="notificationSettings.email.newDocuments"
                  >
                  <label class="form-check-label" for="emailDocuments">
                    <strong>Novos documentos</strong>
                    <br>
                    <small class="text-muted">Receber notificação quando novos documentos forem adicionados</small>
                  </label>
                </div>
                
                <div class="form-check mb-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="emailUpdates"
                    v-model="notificationSettings.email.documentUpdates"
                  >
                  <label class="form-check-label" for="emailUpdates">
                    <strong>Atualizações de documentos</strong>
                    <br>
                    <small class="text-muted">Receber notificação quando documentos forem atualizados</small>
                  </label>
                </div>
                
                <div class="form-check mb-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="emailWeekly"
                    v-model="notificationSettings.email.weeklyDigest"
                  >
                  <label class="form-check-label" for="emailWeekly">
                    <strong>Resumo semanal</strong>
                    <br>
                    <small class="text-muted">Receber resumo semanal de atividades</small>
                  </label>
                </div>
              </div>
              
              <div class="notification-group mb-4">
                <h6 class="fw-semibold mb-3">Notificações do Sistema</h6>
                
                <div class="form-check mb-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="systemMaintenance"
                    v-model="notificationSettings.system.maintenance"
                  >
                  <label class="form-check-label" for="systemMaintenance">
                    <strong>Manutenção do sistema</strong>
                    <br>
                    <small class="text-muted">Avisos sobre manutenção programada</small>
                  </label>
                </div>
                
                <div class="form-check mb-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="systemSecurity"
                    v-model="notificationSettings.system.security"
                  >
                  <label class="form-check-label" for="systemSecurity">
                    <strong>Alertas de segurança</strong>
                    <br>
                    <small class="text-muted">Notificações importantes sobre segurança</small>
                  </label>
                </div>
              </div>
              
              <button class="btn btn-primary" @click="saveNotifications">
                <Save :size="16" class="me-1" />
                Salvar Preferências
              </button>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-if="activeSection === 'security'" class="card">
          <div class="card-header">
            <h5 class="mb-0">Segurança</h5>
          </div>
          <div class="card-body">
            <div class="security-settings">
              <!-- Change Password -->
              <div class="security-section mb-4">
                <h6 class="fw-semibold mb-3">Alterar Senha</h6>
                <form @submit.prevent="changePassword">
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Senha Atual</label>
                      <input
                        type="password"
                        class="form-control"
                        v-model="passwordForm.current"
                        required
                      >
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Nova Senha</label>
                      <input
                        type="password"
                        class="form-control"
                        v-model="passwordForm.new"
                        required
                      >
                    </div>
                    <div class="col-md-6 mb-3">
                      <label class="form-label">Confirmar Nova Senha</label>
                      <input
                        type="password"
                        class="form-control"
                        v-model="passwordForm.confirm"
                        required
                      >
                    </div>
                  </div>
                  <button type="submit" class="btn btn-primary">
                    <Lock :size="16" class="me-1" />
                    Alterar Senha
                  </button>
                </form>
              </div>
              
              <!-- Two-Factor Authentication -->
              <div class="security-section mb-4">
                <h6 class="fw-semibold mb-3">Autenticação de Dois Fatores</h6>
                <div class="d-flex justify-content-between align-items-center p-3 border rounded">
                  <div>
                    <div class="fw-semibold">Autenticação de Dois Fatores</div>
                    <small class="text-muted">
                      {{ securitySettings.twoFactorEnabled ? 'Ativada' : 'Desativada' }}
                    </small>
                  </div>
                  <button 
                    class="btn"
                    :class="securitySettings.twoFactorEnabled ? 'btn-outline-danger' : 'btn-outline-primary'"
                    @click="toggleTwoFactor"
                  >
                    {{ securitySettings.twoFactorEnabled ? 'Desativar' : 'Ativar' }}
                  </button>
                </div>
              </div>
              
              <!-- Login Sessions -->
              <div class="security-section">
                <h6 class="fw-semibold mb-3">Sessões Ativas</h6>
                <div class="sessions-list">
                  <div v-for="session in activeSessions" :key="session.id" class="session-item">
                    <div class="d-flex justify-content-between align-items-center p-3 border rounded mb-2">
                      <div class="d-flex align-items-center">
                        <div class="session-icon me-3">
                          <component :is="session.deviceIcon" :size="20" class="text-muted" />
                        </div>
                        <div>
                          <div class="fw-semibold">{{ session.device }}</div>
                          <small class="text-muted">{{ session.location }} • {{ session.lastActive }}</small>
                        </div>
                      </div>
                      <div class="d-flex align-items-center">
                        <span v-if="session.current" class="badge bg-success me-2">Atual</span>
                        <button 
                          v-if="!session.current"
                          class="btn btn-sm btn-outline-danger"
                          @click="terminateSession(session.id)"
                        >
                          Encerrar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Preferences -->
        <div v-if="activeSection === 'preferences'" class="card">
          <div class="card-header">
            <h5 class="mb-0">Preferências</h5>
          </div>
          <div class="card-body">
            <div class="preferences-settings">
              <div class="preference-group mb-4">
                <h6 class="fw-semibold mb-3">Interface</h6>
                
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Tema</label>
                    <select class="form-select" v-model="preferences.theme">
                      <option value="light">Claro</option>
                      <option value="dark">Escuro</option>
                      <option value="auto">Automático</option>
                    </select>
                  </div>
                  
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Idioma</label>
                    <select class="form-select" v-model="preferences.language">
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div class="preference-group mb-4">
                <h6 class="fw-semibold mb-3">Busca e Navegação</h6>
                
                <div class="form-check mb-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="autoComplete"
                    v-model="preferences.autoComplete"
                  >
                  <label class="form-check-label" for="autoComplete">
                    Ativar autocompletar na busca
                  </label>
                </div>
                
                <div class="form-check mb-3">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    id="searchHistory"
                    v-model="preferences.saveSearchHistory"
                  >
                  <label class="form-check-label" for="searchHistory">
                    Salvar histórico de buscas
                  </label>
                </div>
                
                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label class="form-label">Resultados por página</label>
                    <select class="form-select" v-model="preferences.resultsPerPage">
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <button class="btn btn-primary" @click="savePreferences">
                <Save :size="16" class="me-1" />
                Salvar Preferências
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { 
  User, 
  Bell, 
  Shield, 
  Settings as SettingsIcon, 
  Upload, 
  Save, 
  Lock,
  Monitor,
  Smartphone,
  Globe
} from 'lucide-vue-next'
import { useUserStore } from '../stores/user'

const userStore = useUserStore()

const activeSection = ref('profile')

const settingsSections = [
  { id: 'profile', title: 'Perfil', icon: User },
  { id: 'notifications', title: 'Notificações', icon: Bell },
  { id: 'security', title: 'Segurança', icon: Shield },
  { id: 'preferences', title: 'Preferências', icon: SettingsIcon }
]

const profileForm = reactive({
  name: '',
  email: '',
  department: '',
  position: '',
  avatar: ''
})

const passwordForm = reactive({
  current: '',
  new: '',
  confirm: ''
})

const notificationSettings = reactive({
  email: {
    newDocuments: true,
    documentUpdates: true,
    weeklyDigest: false
  },
  system: {
    maintenance: true,
    security: true
  }
})

const securitySettings = reactive({
  twoFactorEnabled: false
})

const preferences = reactive({
  theme: 'light',
  language: 'pt-BR',
  autoComplete: true,
  saveSearchHistory: true,
  resultsPerPage: '25'
})

const activeSessions = ref([
  {
    id: 1,
    device: 'Chrome no Windows',
    location: 'São Paulo, Brasil',
    lastActive: 'Agora',
    current: true,
    deviceIcon: Monitor
  },
  {
    id: 2,
    device: 'Safari no iPhone',
    location: 'São Paulo, Brasil',
    lastActive: '2 horas atrás',
    current: false,
    deviceIcon: Smartphone
  },
  {
    id: 3,
    device: 'Firefox no Linux',
    location: 'Rio de Janeiro, Brasil',
    lastActive: '1 dia atrás',
    current: false,
    deviceIcon: Monitor
  }
])

const saveProfile = () => {
  userStore.updateProfile({
    name: profileForm.name,
    email: profileForm.email,
    department: profileForm.department
  })
  alert('Perfil atualizado com sucesso!')
}

const resetProfile = () => {
  if (userStore.currentUser) {
    profileForm.name = userStore.currentUser.name
    profileForm.email = userStore.currentUser.email
    profileForm.department = userStore.currentUser.department
    profileForm.avatar = userStore.currentUser.avatar || ''
  }
}

const changePassword = () => {
  if (passwordForm.new !== passwordForm.confirm) {
    alert('As senhas não coincidem!')
    return
  }
  
  // Simular mudança de senha
  alert('Senha alterada com sucesso!')
  passwordForm.current = ''
  passwordForm.new = ''
  passwordForm.confirm = ''
}

const toggleTwoFactor = () => {
  securitySettings.twoFactorEnabled = !securitySettings.twoFactorEnabled
  alert(`Autenticação de dois fatores ${securitySettings.twoFactorEnabled ? 'ativada' : 'desativada'}!`)
}

const terminateSession = (sessionId: number) => {
  const index = activeSessions.value.findIndex(s => s.id === sessionId)
  if (index !== -1) {
    activeSessions.value.splice(index, 1)
    alert('Sessão encerrada com sucesso!')
  }
}

const saveNotifications = () => {
  alert('Preferências de notificação salvas!')
}

const savePreferences = () => {
  alert('Preferências salvas!')
}

onMounted(() => {
  resetProfile()
})
</script>

<style scoped>
.profile-avatar-section {
  padding: var(--spacing-lg);
}

.notification-group {
  border-left: 3px solid var(--primary-color);
  padding-left: var(--spacing-md);
  background-color: var(--bg-light);
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  padding: var(--spacing-md);
}

.security-section {
  border-bottom: 1px solid var(--border-color);
  padding-bottom: var(--spacing-lg);
}

.security-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.session-icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
}

.preference-group {
  border-left: 3px solid var(--secondary-color);
  padding-left: var(--spacing-md);
  background-color: var(--bg-light);
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  padding: var(--spacing-md);
}

.list-group-item.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.form-check-label {
  cursor: pointer;
}

.session-item {
  transition: all 0.2s ease;
}

.session-item:hover {
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
}

@media (max-width: 768px) {
  .profile-avatar-section {
    margin-bottom: var(--spacing-lg);
  }
  
  .col-md-4.text-center {
    text-align: left !important;
  }
  
  .session-item .d-flex {
    flex-direction: column;
    align-items: flex-start !important;
    gap: var(--spacing-sm);
  }
  
  .session-item .d-flex:last-child {
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
  }
}
</style>