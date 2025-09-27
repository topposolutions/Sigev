<template>
  <div class="container-fluid py-3">
    <div class="card p-3 mb-3">
      <div class="row g-2 align-items-end">
        <div class="col-12 col-md-3">
          <DatePicker v-model="filters.date" label="Data de Upload" />
        </div>
        <div class="col-12 col-md-3">
          <input v-model="filters.user" class="form-control" placeholder="Usuário" />
        </div>
        <div class="col-12 col-md-3">
          <select v-model="filters.profile" class="form-select">
            <option value="">Perfil de Acesso</option>
            <option value="publico">Público</option>
            <option value="restrito">Restrito</option>
            <option value="confidencial">Confidencial</option>
          </select>
        </div>
        <div class="col-12 col-md-3">
          <select v-model="filters.status" class="form-select">
            <option value="">Status</option>
            <option value="pendente">Pendente</option>
            <option value="processando">Processando</option>
            <option value="sucesso">Sucesso</option>
            <option value="erro">Erro</option>
          </select>
        </div>
      </div>
    </div>
    <div class="card p-3">
      <DataTable
        :columns="columns"
        :rows="filteredDocuments"
        :page-size="10"
        :searchable="true"
        placeholder="Buscar por nome do documento..."
      >
        <template #cell-profile="{ row }">
          <StatusBadge :status="row.profile" :label="row.profile" :icon="profileIcon(row.profile)" />
        </template>
        <template #cell-status="{ row }">
          <StatusBadge :status="row.status" :label="row.status" />
        </template>
        <template #actions="{ row }">
          <div class="d-flex gap-2 justify-content-end">
            <button class="btn btn-outline-primary btn-sm" @click="mockAction('varrer', row)"><i class="bi bi-search"></i></button>
            <button class="btn btn-outline-secondary btn-sm" @click="mockAction('visualizar', row)"><i class="bi bi-eye"></i></button>
            <button class="btn btn-outline-success btn-sm" @click="mockAction('baixar', row)"><i class="bi bi-download"></i></button>
            <button class="btn btn-outline-info btn-sm" @click="mockAction('historico', row)"><i class="bi bi-clock-history"></i></button>
            <button class="btn btn-outline-danger btn-sm" @click="confirmDelete(row)"><i class="bi bi-trash"></i></button>
          </div>
        </template>
      </DataTable>
    </div>
    <ConfirmDialog ref="confirmDialog" @confirm="deleteDocument" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import DataTable from '../components/common/DataTable.vue';
import StatusBadge from '../components/common/StatusBadge.vue';
import DatePicker from '../components/common/DatePicker.vue';
import ConfirmDialog from '../components/common/ConfirmDialog.vue';

const columns = [
  { key: 'createdAt', label: 'Data de Criação', sortable: true },
  { key: 'user', label: 'Usuário', sortable: true },
  { key: 'profile', label: 'Perfil de Acesso', sortable: true },
  { key: 'name', label: 'Nome do Documento', sortable: true },
  { key: 'type', label: 'Tipo', sortable: true },
  { key: 'size', label: 'Tamanho', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
];

const documents = ref([
  { id: 1, createdAt: '2024-07-10', user: 'Ana Souza', profile: 'público', name: 'Contrato X', type: 'PDF', size: '1.2 MB', status: 'pendente' },
  { id: 2, createdAt: '2024-07-11', user: 'Carlos Lima', profile: 'restrito', name: 'Licença Y', type: 'DOCX', size: '800 KB', status: 'processando' },
  { id: 3, createdAt: '2024-07-12', user: 'Marina Silva', profile: 'confidencial', name: 'Fatura Z', type: 'XLSX', size: '2.1 MB', status: 'sucesso' },
  { id: 4, createdAt: '2024-07-13', user: 'João Pedro', profile: 'público', name: 'Relatório W', type: 'PDF', size: '950 KB', status: 'erro' },
]);

const filters = ref({
  date: '',
  user: '',
  profile: '',
  status: '',
});

const filteredDocuments = computed(() => {
  return documents.value.filter(doc => {
    const matchDate = !filters.value.date || doc.createdAt === filters.value.date;
    const matchUser = !filters.value.user || doc.user.toLowerCase().includes(filters.value.user.toLowerCase());
    const matchProfile = !filters.value.profile || doc.profile === filters.value.profile;
    const matchStatus = !filters.value.status || doc.status === filters.value.status;
    return matchDate && matchUser && matchProfile && matchStatus;
  });
});

function profileIcon(profile) {
  if (profile === 'público') return 'bi bi-globe';
  if (profile === 'restrito') return 'bi bi-lock';
  if (profile === 'confidencial') return 'bi bi-shield-lock';
  return '';
}

function mockAction(action, row) {
  alert(`Ação '${action}' mockada para o documento: ${row.name}`);
}

const confirmDialog = ref();
let docToDelete = null;
function confirmDelete(row) {
  docToDelete = row;
  confirmDialog.value.open({
    title: 'Confirmar exclusão',
    message: `Deseja realmente excluir o documento <b>${row.name}</b>?`,
    icon: 'warning',
    confirmText: 'Excluir',
    cancelText: 'Cancelar',
    confirmButtonClass: 'btn btn-danger',
  });
}
function deleteDocument() {
  if (docToDelete) {
    documents.value = documents.value.filter(d => d.id !== docToDelete.id);
    docToDelete = null;
  }
}
</script>

<style scoped>
.document-card {
  transition: all 0.2s ease;
  border: 1px solid var(--border-color);
}

.document-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.file-type-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bg-light);
  border-radius: var(--border-radius);
}

.document-meta {
  border-top: 1px solid var(--border-color);
  padding-top: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.search-box:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

@media (max-width: 768px) {
  .document-card {
    margin-bottom: var(--spacing-md);
  }
  
  .d-flex.gap-2 {
    flex-direction: column;
  }
  
  .d-flex.gap-2 .btn {
    width: 100%;
  }
}
</style>