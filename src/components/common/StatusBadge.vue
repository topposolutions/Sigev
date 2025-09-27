<template>
  <span
    :class="badgeClass"
    class="status-badge d-inline-flex align-items-center gap-1 px-2 py-1"
  >
    <i v-if="icon" :class="icon" class="me-1"></i>
    <slot>{{ label }}</slot>
  </span>
</template>

<script>
export default {
  name: "StatusBadge",
  props: {
    status: { type: String, required: true },
    label: { type: String, default: "" },
    icon: { type: String, default: "" },
  },
  computed: {
    badgeClass() {
      const statusMap = {
        concluido: "bg-success",
        aprovado: "bg-success",
        pendente: "bg-warning",
        aviso: "bg-warning",
        erro: "bg-danger",
        rejeitado: "bg-danger",
        processando: "bg-primary",
        info: "bg-info",
        padrao: "bg-secondary",
      };
      const key = this.status.toLowerCase();
      return "badge " + (statusMap[key] || statusMap["padrao"]);
    },
  },
};
</script>

<style scoped>
.status-badge {
  font-size: 0.95em;
  border-radius: 1rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  text-transform: capitalize;
}
</style>
