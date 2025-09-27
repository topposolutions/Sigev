<template>
  <div class="container-fluid py-3">
    <div class="row g-3">
      <div class="col-12 col-lg-4">
        <div class="card p-3 mb-3">
          <h6 class="fw-semibold mb-2">Metadados do Documento</h6>
          <ul class="list-group list-group-flush">
            <li class="list-group-item px-0 d-flex justify-content-between"><span class="fw-semibold">Nome:</span> <span>{{ doc.name }}</span></li>
            <li class="list-group-item px-0 d-flex justify-content-between"><span class="fw-semibold">Tipo:</span> <span>{{ doc.type }}</span></li>
            <li class="list-group-item px-0 d-flex justify-content-between"><span class="fw-semibold">Tamanho:</span> <span>{{ doc.size }}</span></li>
            <li class="list-group-item px-0 d-flex justify-content-between"><span class="fw-semibold">Upload:</span> <span>{{ doc.createdAt }}</span></li>
            <li class="list-group-item px-0 d-flex justify-content-between"><span class="fw-semibold">Usuário:</span> <span>{{ doc.user }}</span></li>
            <li class="list-group-item px-0 d-flex justify-content-between"><span class="fw-semibold">Perfil:</span> <StatusBadge :status="doc.profile" :label="doc.profile" /></li>
            <li class="list-group-item px-0 d-flex justify-content-between"><span class="fw-semibold">Status:</span> <StatusBadge :status="doc.status" :label="doc.status" /></li>
          </ul>
        </div>
        <div class="card p-3 mb-3">
          <h6 class="fw-semibold mb-2">Configurações de Notificação</h6>
          <ul class="list-group list-group-flush">
            <li v-for="notif in notifications" :key="notif.id" class="list-group-item px-0 d-flex justify-content-between align-items-center">
              <span>{{ notif.type }} ({{ notif.days }} dias antes)</span>
              <span class="badge bg-primary">{{ notif.channel }}</span>
            </li>
          </ul>
        </div>
        <div class="card p-3">
          <h6 class="fw-semibold mb-2">Histórico de Processamento</h6>
          <ul class="list-group list-group-flush">
            <li v-for="h in history" :key="h.id" class="list-group-item px-0 d-flex justify-content-between align-items-center">
              <span>{{ h.date }}</span>
              <StatusBadge :status="h.status" :label="h.status" />
            </li>
          </ul>
        </div>
      </div>
      <div class="col-12 col-lg-8">
        <div class="card p-3 mb-3">
          <h6 class="fw-semibold mb-2">Texto Extraído</h6>
          <div class="extracted-text p-2" style="background:var(--primary-light); border-radius:8px; min-height:120px;">
            <span v-for="(part, idx) in highlightedText" :key="idx">
              <template v-if="part.isDate">
                <mark class="bg-warning px-1 rounded">{{ part.text }}</mark>
              </template>
              <template v-else>
                {{ part.text }}
              </template>
            </span>
          </div>
        </div>
        <div class="card p-3">
          <h6 class="fw-semibold mb-2">Datas Identificadas</h6>
          <ul class="list-group list-group-flush">
            <li v-for="d in dates" :key="d.id" class="list-group-item px-0 d-flex justify-content-between align-items-center">
              <span>{{ d.label }}</span>
              <DatePicker v-model="d.value" />
              <StatusBadge :status="d.type" :label="d.type" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import StatusBadge from '../components/common/StatusBadge.vue';
import DatePicker from '../components/common/DatePicker.vue';

const doc = {
  name: 'Contrato X',
  type: 'PDF',
  size: '1.2 MB',
  createdAt: '2024-07-10',
  user: 'Ana Souza',
  profile: 'público',
  status: 'sucesso',
};

const notifications = [
  { id: 1, type: 'Antecipada', days: 5, channel: 'E-mail' },
  { id: 2, type: 'Imediata', days: 0, channel: 'In-app' },
];

const history = [
  { id: 1, date: '2024-07-10 09:00', status: 'processando' },
  { id: 2, date: '2024-07-10 09:05', status: 'sucesso' },
];

const extractedText = 'O contrato tem validade até 15/08/2024 e deve ser renovado em 10/08/2024.';
const dateRegex = /\d{2}\/\d{2}\/\d{4}/g;
const highlightedText = [];
let lastIndex = 0;
let match;
while ((match = dateRegex.exec(extractedText)) !== null) {
  if (match.index > lastIndex) {
    highlightedText.push({ text: extractedText.slice(lastIndex, match.index), isDate: false });
  }
  highlightedText.push({ text: match[0], isDate: true });
  lastIndex = match.index + match[0].length;
}
if (lastIndex < extractedText.length) {
  highlightedText.push({ text: extractedText.slice(lastIndex), isDate: false });
}

const dates = [
  { id: 1, label: 'Validade', value: '2024-08-15', type: 'sucesso' },
  { id: 2, label: 'Renovação', value: '2024-08-10', type: 'pendente' },
];
</script>

<style scoped>
.extracted-text mark {
  background: var(--warning-color) !important;
  color: var(--text-primary);
}
</style> 