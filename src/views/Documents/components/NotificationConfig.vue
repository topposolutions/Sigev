<template>
  <div class="container-fluid py-3">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card p-4">
          <h5 class="fw-semibold mb-3">Configuração de Notificações</h5>
          <form @submit.prevent="mockSave">
            <div class="mb-3">
              <label class="form-label">Tipo de Notificação</label>
              <select v-model="form.type" class="form-select">
                <option value="imediata">Imediata (no dia)</option>
                <option value="antecipada">Antecipada (X dias antes)</option>
                <option value="periodica">Periódica (a cada X dias)</option>
                <option value="personalizada">Personalizada</option>
              </select>
            </div>
            <div v-if="form.type === 'antecipada' || form.type === 'periodica'" class="mb-3">
              <label class="form-label">Dias</label>
              <input v-model.number="form.days" type="number" min="1" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Canal</label>
              <div class="d-flex gap-2 flex-wrap">
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="inapp" value="in-app" v-model="form.channels" />
                  <label class="form-check-label" for="inapp">In-app</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="email" value="email" v-model="form.channels" />
                  <label class="form-check-label" for="email">E-mail</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="sms" value="sms" v-model="form.channels" />
                  <label class="form-check-label" for="sms">SMS</label>
                </div>
                <div class="form-check">
                  <input class="form-check-input" type="checkbox" id="webhook" value="webhook" v-model="form.channels" />
                  <label class="form-check-label" for="webhook">Webhook</label>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Horário de Envio</label>
              <input v-model="form.time" type="time" class="form-control" />
            </div>
            <div class="mb-3">
              <label class="form-label">Dias da Semana</label>
              <div class="d-flex gap-2 flex-wrap">
                <div v-for="d in weekDays" :key="d.value" class="form-check">
                  <input class="form-check-input" type="checkbox" :id="d.value" :value="d.value" v-model="form.weekdays" />
                  <label class="form-check-label" :for="d.value">{{ d.label }}</label>
                </div>
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">Modelo de Mensagem</label>
              <textarea v-model="form.message" class="form-control" rows="3" />
            </div>
            <div class="mb-3">
              <label class="form-label">Escalação</label>
              <input v-model="form.escalation" class="form-control" placeholder="E-mails ou nomes de usuários para escalação" />
            </div>
            <button class="btn btn-primary w-100" type="submit">Salvar Configuração</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  type: 'imediata',
  days: 1,
  channels: ['in-app'],
  time: '09:00',
  weekdays: ['seg', 'ter', 'qua', 'qui', 'sex'],
  message: 'Sua notificação personalizada.',
  escalation: '',
});

const weekDays = [
  { value: 'seg', label: 'Seg' },
  { value: 'ter', label: 'Ter' },
  { value: 'qua', label: 'Qua' },
  { value: 'qui', label: 'Qui' },
  { value: 'sex', label: 'Sex' },
  { value: 'sab', label: 'Sáb' },
  { value: 'dom', label: 'Dom' },
];

function mockSave() {
  alert('Configuração de notificação mockada salva!');
}
</script> 