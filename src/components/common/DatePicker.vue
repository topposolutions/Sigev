<template>
  <div class="datepicker-wrapper">
    <label v-if="label" class="form-label mb-1">{{ label }}</label>
    <div class="d-flex gap-2 align-items-center">
      <input
        v-if="!range"
        type="date"
        class="form-control"
        v-model="dateValue"
        @input="emitDate"
      />
      <template v-else>
        <input
          type="date"
          class="form-control"
          v-model="startValue"
          @input="emitRange"
        />
        <span class="mx-1">—</span>
        <input
          type="date"
          class="form-control"
          v-model="endValue"
          @input="emitRange"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  modelValue: { type: [String, Array], default: '' },
  label: { type: String, default: '' },
  range: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const dateValue = ref(props.modelValue || '');
const startValue = ref(Array.isArray(props.modelValue) ? props.modelValue[0] : '');
const endValue = ref(Array.isArray(props.modelValue) ? props.modelValue[1] : '');

watch(() => props.modelValue, (val) => {
  if (props.range) {
    startValue.value = Array.isArray(val) ? val[0] : '';
    endValue.value = Array.isArray(val) ? val[1] : '';
  } else {
    dateValue.value = val || '';
  }
});

function emitDate() {
  emit('update:modelValue', dateValue.value);
}
function emitRange() {
  emit('update:modelValue', [startValue.value, endValue.value]);
}
</script>

<style scoped>
.datepicker-wrapper input[type="date"] {
  min-width: 140px;
  max-width: 180px;
}
</style> 