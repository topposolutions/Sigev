<template>
  <div class="container-fluid py-3">
    <div class="row g-3">
      <div class="col-12 col-lg-6">
        <div class="card p-3 h-100">
          <h6 class="fw-semibold mb-3">Notificações Ativas</h6>
          <ul class="list-group list-group-flush">
            <li v-for="n in activeNotifications" :key="n.id" class="list-group-item d-flex align-items-center justify-content-between gap-2">
              <div class="flex-grow-1">
                <div class="fw-semibold">{{ n.title }}</div>
                <div class="small text-secondary">{{ n.date }} &middot; {{ n.channel }}</div>
              </div>
              <div class="d-flex gap-1 align-items-center">
                <button class="btn btn-outline-success btn-sm" @click="mockAction('aprovar', n)"><i class="bi bi-check"></i></button>
                <button class="btn btn-outline-danger btn-sm" @click="mockAction('rejeitar', n)"><i class="bi bi-x"></i></button>
                <button class="btn btn-outline-secondary btn-sm" @click="mockAction('delegar', n)"><i class="bi bi-person-plus"></i></button>
                <button class="btn btn-outline-warning btn-sm" @click="mockAction('snooze', n)"><i class="bi bi-alarm"></i></button>
                <button class="btn btn-outline-primary btn-sm" @click="toggleRead(n)">
                  <i :class="n.read ? 'bi bi-envelope-open' : 'bi bi-envelope'" />
                </button>
              </div>
            </li>
            <li v-if="!activeNotifications.length" class="list-group-item text-center text-secondary py-4">Nenhuma notificação ativa.</li>
          </ul>
        </div>
      </div>
      <div class="col-12 col-lg-6">
        <div class="card p-3 h-100">
          <h6 class="fw-semibold mb-3">Histórico de Notificações</h6>
          <ul class="list-group list-group-flush">
            <li v-for="n in notificationHistory" :key="n.id" class="list-group-item d-flex align-items-center justify-content-between gap-2">
              <div class="flex-grow-1">
                <div class="fw-semibold">{{ n.title }}</div>
                <div class="small text-secondary">{{ n.date }} &middot; {{ n.channel }}</div>
              </div>
              <StatusBadge :status="n.status" :label="n.status" />
            </li>
            <li v-if="!notificationHistory.length" class="list-group-item text-center text-secondary py-4">Nenhum histórico encontrado.</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import StatusBadge from '../components/common/StatusBadge.vue';

const activeNotifications = ref([
  { id: 1, title: 'Vencimento do Contrato X', date: '10/07/2024', channel: 'In-app', read: false },
  { id: 2, title: 'Renovação Licença Y', date: '12/07/2024', channel: 'E-mail', read: true },
]);

const notificationHistory = ref([
  { id: 3, title: 'Pagamento Fatura Z', date: '05/07/2024', channel: 'E-mail', status: 'enviada' },
  { id: 4, title: 'Entrega Relatório W', date: '01/07/2024', channel: 'In-app', status: 'lida' },
]);

function toggleRead(n) {
  n.read = !n.read;
}
function mockAction(action, n) {
  alert(`Ação '${action}' mockada para a notificação: ${n.title}`);
}
</script> 