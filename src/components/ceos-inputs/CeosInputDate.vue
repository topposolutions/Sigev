<template>
  <b-form-group :label="label">
    <b-input-group
      :class="{ 'is-valid': state, 'is-invalid': state === false }"
    >
      <template v-if="!bloquearInputUsuario">
        <b-form-input
          v-model="formatted"
          :state="state"
          @input="handleInput"
          type="text"
          :placeholder="enableTimePicker ? 'DD/MM/YYYY HH:mm:ss' : 'DD/MM/YYYY'"
          autocomplete="off"
          v-mask="currentMask"
        />
        <b-input-group-append>
          <b-button
            variant="outline-secondary"
            @click="toggleDatepicker"
            type="button"
          >
            <i class="bi bi-calendar"></i>
          </b-button>
        </b-input-group-append>
        
        <!-- Datepicker dropdown dentro do input group -->
        <div v-if="showDatepicker" :class="dropdownClass">
          <Datepicker
            v-model="dateObject"
            :enable-time-picker="enableTimePicker"
            locale="pt-BR"
            :inline="true"
            :format="formatDate"
            :max-date="max"
            :min-date="min"
            :clearable="true"
            :clear-text="$t('COMMONS.LIMPAR')"
            @update:model-value="onDateSelected"
          />
        </div>
      </template>

      <template v-else>
        <Datepicker
          v-model="dateObject"
          :enable-time-picker="false"
          locale="pt-BR"
          auto-apply
          :format="formatDate"
          :max-date="max"
          :min-date="min"
          :disabled="disabledUsuario"
          :clearable="true"
          :clear-text="$t('COMMONS.LIMPAR')"
          @update:model-value="onDateSelected"
        />
      </template>

      <b-form-invalid-feedback>{{ feedback }}</b-form-invalid-feedback>
    </b-input-group>

  </b-form-group>
</template>

<script>
import Datepicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

export default {
  name: "CeosInputDate",
  components: { Datepicker },
  props: {
    modelValue: { type: [String, Date], default: "" },
    label: String,
    required: Boolean,
    requiredMessage: String,
    validate: { type: Boolean, default: null },
    max: { type: [String, Date], default: null },
    min: { type: [String, Date], default: null },
    bloquearInputUsuario: { type: Boolean, default: false },
    disabledUsuario: { type: Boolean, default: false },
    invalidInitialDate: { type: Boolean, default: false },
    enableTimePicker: { type: Boolean, default: false },
  },
  data() {
    return {
      formatted: this.formatPtBr(this.modelValue),
      dateObject: this.modelValue ? new Date(this.modelValue) : null,
      validarFormulario: false,
      hasError: false,
      errorMessage: "",
      showDatepicker: false, // Control visibility of the datepicker dropdown

    };
  },
  computed: {
    requiredValid() {
      return !(this.required && (!this.dateObject || this.formatted === ""));
    },
    state() {
      if (this.invalidInitialDate) return false;
      if (!this.validarFormulario) return null;
      if (!this.requiredValid) return false;
      if (this.hasError) return false;
      if (this.validate !== null) return this.validate;
      return true;
    },
    feedback() {
      if (this.invalidInitialDate)
        return this.requiredMessage || `Data inicial inválida: ${this.label}`;
      if (!this.requiredValid)
        return this.requiredMessage || `Campo obrigatório: ${this.label}`;
      if (this.validate === false) return `Campo inválido: ${this.label}`;
      if (this.hasError) return this.errorMessage;
      return "";
    },
    currentMask() {
      return this.enableTimePicker ? "##/##/#### ##:##:##" : "##/##/####";
    },
    dropdownClass() {
      return 'datepicker-dropdown';
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return "";
      
      if (this.enableTimePicker) {
        return new Intl.DateTimeFormat("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(date);
      } else {
        return new Intl.DateTimeFormat("pt-BR").format(date);
      }
    },
    formatPtBr(date) {
      if (!date) return "";
      const d = new Date(date);
      if (isNaN(d)) return "";
      
      if (this.enableTimePicker) {
        return d.toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      } else {
        return d.toLocaleDateString("pt-BR");
      }
    },
    formatEn(dateStr) {
      const [dia, mes, ano] = dateStr.split("/");
      if (!dia || !mes || !ano) return "";
      return `${ano}-${mes}-${dia}`;
    },
    handleInput() {
      if (this.enableTimePicker) {
        // Para data e hora: DD/MM/YYYY HH:mm:ss (19 caracteres)
        if (this.formatted.length === 19) {
          const [datePart, timePart] = this.formatted.split(" ");
          const d = new Date(this.formatEn(datePart) + "T" + timePart);
          if (!isNaN(d)) {
            this.dateObject = d;
            this.$emit("update:modelValue", d.toISOString());
          } else {
            this.hasError = true;
            this.errorMessage = "Data e hora inválidas";
          }
        } else if (this.formatted.length === 0) {
          this.dateObject = null;
          this.$emit("update:modelValue", "");
        }
      } else {
        // Para apenas data: DD/MM/YYYY (10 caracteres)
        if (this.formatted.length === 10) {
          const d = new Date(this.formatEn(this.formatted));
          if (!isNaN(d)) {
            this.dateObject = d;
            this.$emit("update:modelValue", d.toISOString().split("T")[0]);
          } else {
            this.hasError = true;
            this.errorMessage = "Data inválida";
          }
        } else if (this.formatted.length === 0) {
          this.dateObject = null;
          this.$emit("update:modelValue", "");
        }
      }
    },
    onDateSelected(date) {
      if (!date) {
        this.formatted = "";
        this.dateObject = null;
        this.$emit("update:modelValue", "");
        return;
      }
      this.formatted = this.formatPtBr(date);
      
      // Se enableTimePicker for true, emitir a data completa com tempo
      if (this.enableTimePicker) {
        this.$emit("update:modelValue", date.toISOString());
      } else {
        this.$emit("update:modelValue", date.toISOString().split("T")[0]);
      }
      
      this.hasError = false;
      // Fechar o datepicker após seleção
      this.showDatepicker = false;
    },
    valid() {
      this.validarFormulario = true;
      return this.state;
    },
    clear() {
      this.dateObject = null;
      this.formatted = "";
      this.hasError = false;
      this.errorMessage = "";
      this.validarFormulario = false;
      this.$emit("update:modelValue", "");
    },
    toggleDatepicker() {
      this.showDatepicker = !this.showDatepicker;
      
      // Se estiver abrindo o datepicker, calcular a posição
      if (this.showDatepicker) {
        this.$nextTick(() => {
          this.positionDatepicker();
        });
      }
    },
    positionDatepicker() {
      const input = this.$el.querySelector('input');
      const dropdown = this.$el.querySelector('.datepicker-dropdown');
      
      if (input && dropdown) {
        const rect = input.getBoundingClientRect();
        const dropdownHeight = dropdown.offsetHeight;
        const windowHeight = window.innerHeight;
        
        // Calcular posição inicial
        let left = rect.left;
        let top = rect.top - dropdownHeight - 5;
        
        // Verificar se vai sair da tela pela esquerda
        if (left < 0) {
          left = 10;
        }
        
        // Verificar se vai sair da tela pela direita
        if (left + dropdown.offsetWidth > window.innerWidth) {
          left = window.innerWidth - dropdown.offsetWidth - 10;
        }
        
        // Verificar se vai sair da tela por cima
        if (top < 0) {
          top = rect.bottom + 5;
        }
        
        // Verificar se vai sair da tela por baixo
        if (top + dropdownHeight > windowHeight) {
          top = windowHeight - dropdownHeight - 10;
        }
        
        dropdown.style.left = left + 'px';
        dropdown.style.top = top + 'px';
      }
    },
    closeDatepicker() {
      this.showDatepicker = false;
    },


  },
  mounted() {
    // Fechar datepicker quando clicar fora
    this.handleClickOutside = (e) => {
      if (!this.$el.contains(e.target)) {
        this.showDatepicker = false;
      }
    };
    document.addEventListener('click', this.handleClickOutside);
    
    // Reposicionar datepicker quando a janela for redimensionada
    this.handleResize = () => {
      if (this.showDatepicker) {
        this.positionDatepicker();
      }
    };
    window.addEventListener('resize', this.handleResize);
  },
  beforeUnmount() {
    // Remover event listeners
    document.removeEventListener('click', this.handleClickOutside);
    window.removeEventListener('resize', this.handleResize);
  },
  watch: {
    modelValue: {
      handler(val) {
        if (!val) {
          this.dateObject = null;
          this.formatted = "";
        } else {
          const d = new Date(val);
          this.dateObject = isNaN(d) ? null : d;
          this.formatted = this.formatPtBr(d);
        }
      },
      immediate: true,
    },
  },
};
</script>

<style scoped>
.is-valid button {
  border-color: #7dba19;
}
.is-invalid button {
  border-color: #dc3545;
}

/* Esconder o input do datepicker */
.datepicker-input-hidden {
  display: none !important;
}

/* Estilizar o menu do datepicker */
.datepicker-menu {
  position: absolute !important;
  top: 100% !important;
  right: 0 !important;
  z-index: 1000 !important;
  margin-top: 2px !important;
}

/* Estilizar o botão do calendário */
.btn-outline-secondary:hover {
  background-color: #6c757d;
  border-color: #6c757d;
  color: white;
}

/* Posicionamento relativo para o container */
.b-form-group {
  position: relative !important;
}

/* Melhorar a aparência do input group */
.input-group .form-control:focus {
  z-index: 3;
}

.input-group .btn:focus {
  z-index: 3;
}

/* Estilos para o dropdown do datepicker */
.datepicker-dropdown {
  position: fixed !important;
  z-index: 999999 !important;
  background: white !important;
  border: 1px solid #dee2e6 !important;
  border-radius: 0.375rem !important;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  width: 320px !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
}



/* Garantir que o container tenha posição relativa */
.b-form-group {
  position: relative !important;
}

.b-input-group {
  position: relative !important;
}

/* Estilos para o datepicker dentro do dropdown */
.datepicker-dropdown .dp__main {
  border: none;
  box-shadow: none;
}

.datepicker-dropdown .dp__outer_menu {
  border: none;
  box-shadow: none;
}

/* Fix simples para altura dos inputs */
.form-control,
.b-form-input {
  height: 38px !important;
  min-height: 38px !important;
  padding: 0.5rem 0.75rem !important;
  line-height: 1.2 !important;
  vertical-align: middle !important;
}

/* Fix específico para inputs de data e hora */
input[type="date"],
input[type="time"],
input[type="datetime-local"] {
  height: 38px !important;
  min-height: 38px !important;
  padding: 0.5rem 0.75rem !important;
  line-height: 1.2 !important;
  vertical-align: middle !important;
}

/* Estilos básicos para o datepicker */
.dp__main {
  background: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0;
  z-index: 999999 !important;
}

.dp__outer_menu {
  background: white;
  border: none;
  border-radius: 0.375rem;
  box-shadow: none;
  z-index: 999999 !important;
}

.dp__calendar {
  background: white;
}

.dp__calendar_header {
  background: #f8f9fa;
  padding: 10px;
  border-bottom: 1px solid #dee2e6;
}

.dp__calendar_row {
  background: white;
}

.dp__cell {
  padding: 5px;
  text-align: center;
}

.dp__cell_inner {
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dp__cell_inner:hover {
  background: #e9ecef;
}

.dp__cell_inner.dp__active {
  background: #007bff;
  color: white;
}

.dp__cell_inner.dp__today {
  background: #f8f9fa;
  border: 1px solid #007bff;
}
</style>
