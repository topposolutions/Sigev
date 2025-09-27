<template>
  <b-form-group :label="label" :label-sr-only="noLabel">
    <template #label v-if="$slots.label">
      <slot name="label"></slot>
    </template>
    <b-input-group>
      <div class="text-info loader" v-if="loading">
        <b-spinner class="align-middle spinner"></b-spinner>
      </div>
      <b-form-select
        v-model="content"
        :state="state"
        trim
        @input="handleInput"
        @change="handleChange"
        :options="options"
        :value-field="valueField"
        :text-field="textField"
        :size="size"
      >
        <template v-if="placeholder" #first>
          <b-form-select-option disabled>
            {{ $t("COMMONS.SELECIONE_2") }}</b-form-select-option
          >
        </template>
      </b-form-select>
      <slot name="append"></slot>
      <b-form-invalid-feedback :state="state">{{
        feedback
      }}</b-form-invalid-feedback>
    </b-input-group>
  </b-form-group>
</template>

<script>
export default {
  name: "CeosSelect",

  props: {
    modelValue: { type: [String, Number, Object, Array] },
    label: { type: String },
    required: { type: Boolean },
    loading: { type: Boolean },
    requiredMessage: { type: String },
    options: { type: [Array, Object] },
    valueField: { type: String, default: "value" },
    textField: { type: String, default: "text" },
    size: { type: String, default: "" },
    noLabel: { type: Boolean, default: false },
    placeholder: { type: Boolean, default: false },
  },
  data() {
    return {
      content: null,
      validarFormulario: false,
      validState: false,
      hasError: false,
      errorMessage: "",
      wasValidated: false,
    };
  },
  computed: {
    requiredValid() {
      return !(this.required && !this.modelValue);
    },
    state() {
      if (!this.validState && !this.wasValidated) return null;
      if (!this.validarFormulario && !this.modelValue) return false;

      if (!this.requiredValid) return false;
      if (this.hasError) return false;

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

      if (this.hasError) return this.errorMessage;
      return "";
    },
  },
  methods: {
    isInputNotEmpty() {
      return !this.content;
    },
    showError(message) {
      this.validarFormulario = true;
      this.hasError = true;
      this.errorMessage = message;
      this.wasValidated = true;
    },
    handleInput() {
      this.$emit("update:modelValue", this.content);
      this.$emit("input", this.content);
      this.hasError = false;
    },
    handleChange() {
      this.$emit("update:modelValue", this.content);
      this.$emit("change", this.content);
      this.hasError = false;
    },
    valid() {
      this.validarFormulario = true;
      this.validState = this.state === null || this.state === true;
      this.wasValidated = true;
      return this.state;
    },
    clear() {
      this.content = "";
      this.validarFormulario = false;
      this.validState = null;
      this.hasError = false;
      this.wasValidated = false;
      this.errorMessage = "";
      this.$emit("update:modelValue", this.content);
      this.$emit("input", this.content);
    },
    clearWithObjectEmpty() {
      this.content = {};
      this.validarFormulario = false;
      this.validState = null;
      this.$emit("update:modelValue", this.content);
      this.$emit("input", this.content);
    },
  },
  watch: {
    modelValue: {
      handler(value) {
        this.content = value;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style scoped>
.loader {
  position: absolute;
  padding: 9px;
  z-index: 1;
}

.custom-select {
  border-radius: 4px !important;
}

.spinner {
  width: 18px;
  height: 18px;
}

.custom-select:disabled {
  background-color: #f7f8fa;
  opacity: 1;
  color: #495057;
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
