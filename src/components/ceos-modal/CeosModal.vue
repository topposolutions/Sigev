<template>
  <b-modal
    v-model="showComputed"
    :size="size"
    :scrollable="scrollable"
    :content-class="contentClass"
    :centered="centered"
    :hide-backdrop="hideBackdrop"
    :hide-footer="hideFooter"
    :hide-header="false"
    :id="id"
    :no-close-on-esc="noCloseEsc"
    :no-close-on-backdrop="noCloseBackdrop"
    :hide-header-close="hideHeaderClose"
    :header-bg-variant="headerBgVariant"
    :title="headerTitle || 'Modal'"
    :ok-title="okTitle"
    :cancel-title="cancelTitle"
    :ok-variant="okVariant"
    :cancel-variant="cancelVariant"
    :ok-size="okSize"
    :cancel-size="cancelSize"
    :ok-disabled="okDisabled"
    :cancel-disabled="cancelDisabled"
    @cancel="$emit('cancel')"
    :body-class="bodyClass"
    :header-class="headerClass"
    :footer-class="footerClass"
    :modal-class="modalClass"
  >
    <!-- Header Customizado -->
    <template #modal-header>
      <div class="modal-header-content">
        <div class="modal-title-section">
          <h6 v-if="headerTitle" class="modal-title">
            {{ headerTitle }}
          </h6>
          <p v-if="headerSubtitle" class="modal-subtitle">
            {{ headerSubtitle }}
          </p>
        </div>
        <div v-if="headerIcon" class="modal-header-icon">
          <i :class="headerIcon"></i>
        </div>
      </div>
    </template>

    <!-- Conteúdo -->
    <div class="modal-body-content">
      <slot></slot>
    </div>

    <!-- Footer Customizado -->
    <template #modal-footer>
      <div class="modal-footer-content">
        <slot name="modal-footer">
          <div class="footer-buttons">
            <button
              v-if="showCancelButton"
              :class="cancelButtonClass"
              :disabled="cancelDisabled"
              @click="$emit('cancel')"
            >
              <i v-if="cancelIcon" :class="cancelIcon" class="me-2"></i>
              {{ cancelTitle }}
            </button>
            <button
              v-if="showOkButton"
              :class="okButtonClass"
              :disabled="okDisabled"
              @click="emitSave"
            >
              <i v-if="okIcon" :class="okIcon" class="me-2"></i>
              {{ okTitle }}
            </button>
          </div>
        </slot>
      </div>
    </template>
  </b-modal>
</template>

<script>
export default {
  name: "CeosModal",
  props: {
    scrollable: {
      type: Boolean,
      default: false,
    },
    show: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ['sm', 'md', 'lg', 'xl'].includes(value)
    },
    
    // Header
    headerTitle: { 
      type: String, 
      default: null 
    },
    headerSubtitle: { 
      type: String, 
      default: null 
    },
    headerIcon: { 
      type: String, 
      default: null 
    },
    
    // Classes customizadas
    contentClass: {
      type: [String, Array, Object],
      default: null,
    },
    bodyClass: {
      type: String,
      default: ""
    },
    headerClass: {
      type: String,
      default: ""
    },
    footerClass: {
      type: String,
      default: ""
    },
    modalClass: {
      type: String,
      default: ""
    },
    
    // Layout
    centered: { 
      type: Boolean, 
      default: true 
    },
    hideFooter: { 
      type: Boolean, 
      default: false 
    },
    hideBackdrop: { 
      type: Boolean, 
      default: false 
    },
    hideHeader: { 
      type: Boolean, 
      default: false 
    },
    
    // Comportamento
    id: { 
      type: String, 
      default: "" 
    },
    noCloseEsc: { 
      type: Boolean, 
      default: false 
    },
    noCloseBackdrop: { 
      type: Boolean, 
      default: false 
    },
    hideHeaderClose: { 
      type: Boolean, 
      default: false 
    },
    hideButtonClose: { 
      type: Boolean, 
      default: false 
    },
    
    // Estilo do header
    headerBgVariant: { 
      type: String, 
      default: "" 
    },
    headerTextVariant: { 
      type: String, 
      default: "" 
    },
    
    // Botões
    okTitle: { 
      type: String, 
      default: "OK" 
    },
    cancelTitle: { 
      type: String, 
      default: "Cancel" 
    },
    okVariant: { 
      type: String, 
      default: "primary" 
    },
    cancelVariant: { 
      type: String, 
      default: "secondary" 
    },
    okSize: { 
      type: String, 
      default: "md",
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    cancelSize: { 
      type: String, 
      default: "md",
      validator: (value) => ['sm', 'md', 'lg'].includes(value)
    },
    okIcon: { 
      type: String, 
      default: null 
    },
    cancelIcon: { 
      type: String, 
      default: null 
    },
    okDisabled: { 
      type: Boolean, 
      default: false 
    },
    cancelDisabled: { 
      type: Boolean, 
      default: false 
    },
    showOkButton: { 
      type: Boolean, 
      default: true 
    },
    showCancelButton: { 
      type: Boolean, 
      default: true 
    },
    
    // Variantes de tema
    theme: {
      type: String,
      default: "default",
      validator: (value) => ['default', 'primary', 'success', 'warning', 'danger', 'info'].includes(value)
    }
  },
  
  methods: {
    fecharModal() {
      this.$emit("close");
    },

    emitSave(event) {
      console.log('1');
      
      this.$emit("ok", event);
      event.preventDefault();
    },
  },
  
  computed: {
    showComputed: {
      get() {
        return this.show;
      },
      set() {
        this.$emit("close");
      },
    },
    
    shouldShowHeader() {
      return this.headerTitle && !this.hideHeader;
    },
    
    shouldHideHeader() {
      return this.hideHeader || !this.headerTitle;
    },
    
    // Classes dos botões
    okButtonClass() {
      const baseClass = `btn btn-${this.okVariant} btn-${this.okSize}`;
      return `${baseClass} ${this.theme === 'default' ? 'btn-modern' : ''}`;
    },
    
    cancelButtonClass() {
      const baseClass = `btn btn-${this.cancelVariant} btn-${this.cancelSize}`;
      return `${baseClass} ${this.theme === 'default' ? 'btn-modern' : ''}`;
    }
  },

  
  
};
</script>

<style scoped>
/* Estilos específicos do componente */
.modal-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.modal-title-section {
  flex: 1;
}

.modal-title-section .modal-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  line-height: 1.4;
}

.modal-title-section .modal-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
  line-height: 1.4;
}

.modal-header-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.25rem;
  margin-left: 1rem;
}

.modal-body-content {
  min-height: 100px;
}

.modal-footer-content {
  width: 100%;
}

.footer-buttons {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.btn-modern {
  border-radius: 8px;
  font-weight: 500;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
  border: none;
  position: relative;
  overflow: hidden;
}

.btn-modern:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Responsividade */
@media (max-width: 768px) {
  .modal-title-section .modal-title {
    font-size: 1rem;
  }
  
  .modal-title-section .modal-subtitle {
    font-size: 0.8rem;
  }
  
  .modal-header-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }
}
</style>
