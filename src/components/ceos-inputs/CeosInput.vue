<template>
  <b-form-group :label-sr-only="noLabel">
    <template #label>
      <b-input-group class="custom-label">
        <slot name="label">
          <span>{{ defaultLabelText }}</span>
        </slot>
      </b-input-group>
    </template>
    <b-input-group>
      <div class="text-info loader" v-if="loading">
        <b-spinner class="align-middle spinner"></b-spinner>
      </div>
      <b-form-input
        :autofocus="autofocus"
        :ref="'porto-input-' + name"
        v-model="content"
        :state="state"
        @input="handleInput"
        @blur="handleBlur"
        :type="type"
        :autocomplete="autocomplete"
        :controls="false"
        :readonly="readonly"
        :formatter="formatter"
        :placeholder="placeholder"
        :lazy="lazy"
        @wheel="$event.target.blur()"
        :min="min"
        :max="max"
        :size="size"
        @keyup.enter="sendEnterEvent"
        @keyup="keyup"
        @paste="prevent"
        @drop="prevent"
        @contextmenu="prevent"
        :class="{
          'is-loading': loading,
          'no-border': noBorder,
          'no-background': noBackground,
        }"
      /><button
        type="button"
        @click="changePasswordField"
        class="button-eye"
        v-if="showPassword"
      >
        <!-- <v-icon>{{ inputPasswordIcon }}</v-icon> -->
      </button>
      <slot name="append"></slot>
      <b-form-invalid-feedback v-if="state === false && !hideFeedback">
        {{ feedback }}
      </b-form-invalid-feedback>
    </b-input-group>
    <b-form-text v-if="messageAlert?.length" text-variant="warning">
      {{ messageAlert }}
    </b-form-text>
    <b-form-text v-if="forceInvalid" text-variant="danger">
      {{ customFeedback ? customFeedback : feedback }}
    </b-form-text>
  </b-form-group>
</template>

<script>
export default {
  name: "CeosInput",
  props: {
    modelValue: { type: [String, Number], default: "" },
    defaultLabelText: { type: String, default: "" },
    messageAlert: { type: String, default: "" },
    forceInvalid: { type: Boolean, default: false },
    noBorder: { type: Boolean, default: false },
    noBackground: { type: Boolean, default: false },
    customFeedback: { type: String },
    name: { type: String, default: "" },
    stateCustom: { type: Boolean, default: true },
    value: { type: [String, Number], default: "" },
    type: { type: String, default: "text" },
    label: { type: String },
    size: { type: String },
    autocomplete: { type: String, default: "new-password" },
    upper: { type: Boolean },
    noLabel: { type: Boolean, default: false },
    controls: { type: Boolean, default: true },
    removeSpecialChars: { type: Boolean },
    removeWhiteSpaces: { type: Boolean },
    required: { type: Boolean },
    requiredMessage: { type: String, default: "Este campo é obrigatório" },
    readonly: { type: Boolean, default: false },
    length: { type: Number, default: 0 },
    lengthMessage: { type: String, default: "" },
    minLength: { type: Number, default: null },
    minLengthMessage: { type: String, default: "" },
    maxLength: { type: Number, default: null },
    maxLengthMessage: { type: String, default: "" },
    placeholder: { type: String },
    invalidEmailMessage: { type: String, default: "Email inválido" },
    validate: { type: Boolean, default: null },
    showPassword: { type: Boolean, default: false },
    lazy: { type: Boolean, default: false },
    min: { type: [Number, String], required: false },
    max: { type: [Number, String], required: false },
    minMessage: { type: String, default: "" },
    maxMessage: { type: String, default: "" },
    loading: { type: Boolean, default: false },
    hideFeedback: { type: Boolean, default: false },
    disablePaste: { type: Boolean, default: false },
    autofocus: { type: Boolean, default: false },
    onlyInteger: { type: Boolean, default: false },
    validateOnBlur: { type: Boolean, default: false }, // Nova prop para controlar validação no blur
  },
  data() {
    return {
      content: this.modelValue,
      validarFormulario: false,
      hasError: false,
      errorMessage: "",
      inputPasswordIcon: "fas fa-eye",
    };
  },
  computed: {
    requiredValid() {
      return !(this.required && (this.content == "" || this.content == null));
    },
    minValid() {
      return !(this.min && parseInt(this.content) < parseInt(this.min));
    },
    maxValid() {
      return !(this.max && parseInt(this.content) > parseInt(this.max));
    },
    lengthValid() {
      return !(this.length > 0 && String(this.content)?.length != this.length);
    },
    minLengthValid() {
      return !(this.minLength > 0 && this.content?.length < this.minLength);
    },
    maxLengthValid() {
      return !(this.maxLength > 0 && this.content?.length > this.maxLength);
    },
    validEmail() {
      var re =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(this.content);
    },
    state() {
      if (!this.stateCustom) return false;
      if (!this.validarFormulario) return null;

      if (!this.requiredValid) return false;
      if (!this.minValid) return false;
      if (!this.maxValid) return false;
      if (!this.lengthValid) return false;
      if (!this.minLengthValid) return false;
      if (!this.maxLengthValid) return false;
      if (this.type == "email") return this.validEmail;
      if (this.hasError) return false;
      if (this.validate != null) return this.validate;
      return true;
    },
    feedback() {
      if (this.customFeedback) return this.customFeedback;
      if (this.errorMessage) return this.errorMessage;
      
      // Mensagens específicas por tipo de validação
      if (this.required && !this.requiredValid) {
        return this.requiredMessage || "Este campo é obrigatório";
      }
      
      if (this.type === 'email' && !this.validEmail) {
        return this.invalidEmailMessage || "Email inválido";
      }
      
      if (this.length > 0 && !this.lengthValid) {
        return this.lengthMessage || `O campo deve ter exatamente ${this.length} caracteres`;
      }
      
      if (this.minLength && !this.minLengthValid) {
        return this.minLengthMessage || `O campo deve ter pelo menos ${this.minLength} caracteres`;
      }
      
      if (this.maxLength && !this.maxLengthValid) {
        return this.maxLengthMessage || `O campo deve ter no máximo ${this.maxLength} caracteres`;
      }
      
      if (this.min && !this.minValid) {
        return this.minMessage || `O valor deve ser maior ou igual a ${this.min}`;
      }
      
      if (this.max && !this.maxValid) {
        return this.maxMessage || `O valor deve ser menor ou igual a ${this.max}`;
      }
      
      return "Campo inválido";
    },
  },
  methods: {
    isInputNotEmpty() {
      return !this.content == "";
    },
    prevent(event) {
      if (this.disablePaste) {
        event.preventDefault();
      }
    },
    showError(message) {
      this.validarFormulario = true;
      this.hasError = true;
      this.errorMessage = message;
    },
    focus() {
      if (this.name) {
        this.$refs["porto-input-" + this.name].focus();
      }
    },
    formatter(e) {
      if (e) {
        if (this.upper) e = e.toUpperCase();

        if (this.maxLength > 0 && e.length > this.maxLength) {
          e = e.substring(0, this.maxLength);
        }

        if (this.removeSpecialChars)
          e = e.replace(/[^a-z0-9\s]/gi, "").replace(/[_\s]/g, "-");

        if (this.removeWhiteSpaces) e = e.replace(/\s/g, "");

        if (this.onlyInteger) e = e.replace(/[^0-9]/g, "");
      }
      return e;
    },
    handleInput() {
      this.$emit("update:modelValue", this.content);
      this.hasError = false;
    },
    handleBlur() {
      this.$emit("blur", this.content);
      // Validação visual só é ativada se validateOnBlur for true
      if (this.validateOnBlur) {
        this.validarFormulario = true;
      }
    },
    valid() {
      this.validarFormulario = true;
      return this.state;
    },
    clear() {
      this.content = "";
      this.validarFormulario = false;
      this.hasError = false;
      this.errorMessage = "";
      this.$emit("input", this.content);
    },
    changePasswordField() {
      if (this.type == "text") {
        this.type = "password";
        this.inputPasswordIcon = "fas fa-eye";
      } else {
        this.type = "text";
        this.inputPasswordIcon = "fas fa-eye-slash";
      }
    },
    sendEnterEvent() {
      this.$emit("enter");
    },
    keyup(e) {
      this.$emit("keyup", e);
    },
  },
  watch: {
    modelValue: {
      handler(value) {
        this.content = value;
      },
      immediate: true,
    },
    content(val) {
      this.$emit("update:modelValue", val);
      this.$emit("change", val);
    },
  },
};
</script>
<style lang="scss" scoped>
input[readonly] {
  background-color: #f2f3f8 !important;
}
input {
  &.is-loading {
    padding-left: 40px;
  }
  &.no-border {
    border: none !important;
  }
  &.no-background {
    background-color: transparent !important;
  }
}

.loader {
  position: absolute;
  z-index: 10;
  height: 100%;
  display: flex;
  align-items: center;
  margin-left: 6px;
}

.form-control {
  border-radius: 4px !important;
}

.button-eye {
  position: absolute;
  top: 31px;
  right: 31px;
  z-index: 9;

  .fas {
    font-size: 17px;
  }
}

.custom-label {
  display: flex;
  align-items: center;
  gap: 8px;
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
