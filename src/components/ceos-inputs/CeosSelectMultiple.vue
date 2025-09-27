<template>
  <div :class="{ invalid: state }">
    <label v-if="!hideLabel && !$slots.label" class="typo__label">{{
      label
    }}</label>

    <label v-if="!hideLabel && $slots.label" class="typo__label">
      <slot name="label"></slot>
    </label>

    <multiselect
      v-model="content"
      :options="options"
      :multiple="multiple"
      :close-on-select="false"
      :clear-on-select="clearOnSelect"
      :preserve-search="true"
      :placeholder="$t('SELECIONE')"
      :show-labels="true"
      :label="textField"
      open-direction="bottom"
      :track-by="valueField"
      @input="handleInput"
      :searchable="true"
      :loading="isLoading"
      :internal-search="false"
      :options-limit="300"
      :max-height="600"
      :show-no-results="false"
      :hide-selected="computedHideSelected"
      @search-change="asyncFind"
      @select="addOption"
      @tag="addOption"
      @remove="removeOption"
      @update="asyncUpdate"
      :disabled="disabled"
      :selectedLabel="$t('COMMONS.SELECIONADO')"
      selectLabel=""
      deselectLabel=""
      :taggable="taggable"
      :limit="limitComputed"
      :limitText="(count) => `+ ${count}`"
    >
      <template slot="beforeList">
        <slot name="beforeList" />
      </template>

      <template slot="noOptions">
        {{ noOptions || $t("COMMONS.LISTA_VAZIA") }}
      </template>
    </multiselect>
    <label
      class="typo__label form__label feedback__text"
      v-show="state === false"
      >{{ feedback }}</label
    >
  </div>
</template>

<script>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.css";

export default {
  name: "CeosSelectMultiple",

  props: {
    modelValue: { type: [String, Number, Object, Array], default: () => [] },
    hideLabel: { type: Boolean, default: false },
    label: { type: String, required: true },
    required: { type: Boolean },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean },
    requiredMessage: { type: String },
    options: { type: Array, required: true },
    valueField: { type: String, default: "value" },
    textField: { type: String, default: "text" },
    isLoading: { type: Boolean, default: false },
    noOptions: { type: String },
    clearOnSelect: { type: Boolean, default: false },
    limit: { type: [Number, String], default: "default" },
    taggable: { type: Boolean, default: false },
    multiple: { type: Boolean, default: true },
  },
  components: {
    Multiselect,
  },
  data() {
    return {
      content: this.modelValue || [],
      validarFormulario: false,
      hasError: false,
      errorMessage: "",
    };
  },

  computed: {
    requiredValid() {
      return !(this.required && (!this.modelValue || !this.modelValue.length));
    },
    limitComputed() {
      if (this.limit === "default") return 3;
      else return this.limit;
    },
    computedHideSelected() {
      return this.limit === "default";
    },
    state() {
      if (!this.validarFormulario) return null;

      if (!this.requiredValid) return false;
      if (this.hasError) return false;

      return true;
    },
    feedback() {
      if (!this.requiredValid) {
        if (this.requiredMessage) {
          return this.requiredMessage;
        } else {
          return this.$t("AUTH.VALIDATION.REQUIRED").formatUnicorn({
            name: this.label,
          });
        }
      }

      if (this.hasError) return this.errorMessage;
      return "";
    },
  },
  methods: {
    isInputNotEmpty() {
      return !this.content || !this.modelValue;
    },
    asyncFind(query) {
      this.$emit("search", query);
    },
    asyncUpdate(value) {
      this.$emit("update", value);
    },
    showError(message) {
      this.validarFormulario = true;
      this.hasError = true;
      this.errorMessage = message;
    },
    addOption(content) {
      setTimeout(() => {
        this.$emit("add", content);
      }, 200);
    },
    removeOption(content) {
      this.$emit("remove", content);
    },
    handleInput(value) {
      const newValue = this.multiple
        ? Array.isArray(value)
          ? value
          : []
        : value;

      this.$emit("update:modelValue", newValue);
      this.$emit("input", newValue);
      this.hasError = false;
    },
    valid() {
      this.validarFormulario = true;
      return this.state;
    },
    clear() {
      this.content = [];
      this.validarFormulario = false;
      this.$emit("update:modelValue", this.content);
      this.$emit("input", this.content);
    },
  },
  watch: {
    content: {
      handler(value) {
        this.content = value || [];
        this.$emit("update:modelValue", this.content);
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang="scss">
.multiselect {
  min-height: 38.4px;
}
.multiselect__tags {
  padding: 3.8px 40px 0 6px;
  min-height: 38px;
  border-radius: 4px;
  border: 1px solid #b1b1b1;
}
.multiselect__tag {
  margin-bottom: 2px;
  background: #4c6ef5;
  margin-top: 4px;
}
.typo__label {
  padding-bottom: calc(0.65rem + 1px);
  margin-bottom: 0;
}
.multiselect__option--selected {
  background: #dcdcdc;
}
.multiselect,
.multiselect__input,
.multiselect__single {
  font-size: 13px;
}
.feedback__text {
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545;
}
.multiselect__strong {
  font-size: 13px;
  padding-top: 6px;
}
.multiselect__placeholder {
  padding-top: 4.5px;
  margin-bottom: 7.1px;
}

.multiselect__content-wrapper {
  z-index: 95;
}
</style>
