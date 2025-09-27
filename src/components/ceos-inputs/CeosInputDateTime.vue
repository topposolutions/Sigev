<template>
  <b-form-group :label="label">
    <b-input-group
      v-bind:class="{ 'is-valid': state, 'is-invalid': state == false }"
    >
      <date-picker
        v-model="content"
        :config="options"
        v-mask="mask"
        autocomplete="off"
        :state="state"
        @input="handleInput"
      >
      </date-picker>
      <div v-if="showCalendarIcon" class="p-2 date-icon">
        <i class="fa-regular fa-calendar" style="font-size: 1.3rem"/>
      </div>
      <b-form-invalid-feedback>{{ feedback }}</b-form-invalid-feedback>
    </b-input-group>
  </b-form-group>
</template>

<script>
import datePicker from "vue-bootstrap-datetimepicker";
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";

export default {
  name: "CeosInputDateTime",
  props: {
    value: { type: String, default: "" },
    label: { type: String, required: true },
    required: { type: Boolean, default: false },
    showCalendarIcon: { type: Boolean, default: false },
    requiredMessage: { type: String },
    validate: { type: Boolean, default: null },
  },
  data() {
    return {
      content: this.value,
      mask: "##/##/#### ##:##",
      validarFormulario: false,
      hasError: false,
      errorMessage: "",
      options: {
        format: "DD/MM/YYYY HH:mm",
        useCurrent: false,
        showClear: true,
        showClose: true,
        locale: "pt-Br",
        icons: {
          time: "far fa-clock",
          date: "far fa-calendar",
          up: "fas fa-arrow-up",
          down: "fas fa-arrow-down",
          previous: "fas fa-chevron-left",
          next: "fas fa-chevron-right",
          today: "fas fa-calendar-check",
          close: "far fa-times-circle",
          clear: "far fa-trash-alt",
        },
      },
    };
  },
  computed: {
    requiredValid() {
      return !(
        this.required &&
        (this.value == "" || this.value == null || this.value == "-")
      );
    },
    state() {
      if (!this.validarFormulario) return null;

      if (!this.requiredValid) return false;
      if (this.hasError) return false;
      if (this.validate != null) return this.validate;
      return true;
    },
    feedback() {
      if (!this.requiredValid)
        return (
          this.requiredMessage ||
          this.$t("AUTH.VALIDATION.REQUIRED").formatUnicorn({
            name: this.label,
          })
        );
      if (this.validate != null && !this.validate)
        return (
          this.invalidEmailMessage ||
          this.$t("AUTH.VALIDATION.INVALID").formatUnicorn({
            name: this.label,
          })
        );
      if (this.hasError) return this.errorMessage;
      return "";
    },
  },
  methods: {
    valid() {
      this.validarFormulario = true;
      return this.state;
    },
    handleInput() {
      this.$emit("input", this.content);
      this.hasError = false;
    },
    clear() {
      this.content = "";
      this.validarFormulario = false;
      this.$emit("input", this.content);
    },
  },
  watch: {
    value: {
      handler(value) {
        this.content = value;
      },
      deep: true,
      immediate: true,
    },
  },
  components: {
    datePicker,
  },
};
</script>
<style>
.is-valid button {
  border-color: #7dba19;
}
.is-invalid button {
  border-color: #dc3545;
}

.date-icon {
  border: 1px solid #b1b1b1;
  border-left: none;
  border-radius: 0px 5px 5px 0px;
  background-color: #f7f8fa;
  align-items: center;
  height: 3rem;
  display: flex;
  margin: auto; padding: 10px
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
</style>
