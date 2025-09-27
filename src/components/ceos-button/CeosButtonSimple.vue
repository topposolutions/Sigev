<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    :style="customStyle"
    @click="handleClick"
    type="button"
  >
    <!-- Loading Spinner -->
    <div v-if="loading" class="button-spinner">
      <svg class="spinner-icon" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="31.416" stroke-dashoffset="31.416">
          <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
          <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>

    <!-- Slot for icon -->
    <slot name="icon" v-if="!loading" />

    <!-- Slot for content -->
    <slot />
  </button>
</template>

<script>
export default {
  name: "CeosButtonSimple",
  props: {
    variant: { 
      type: String, 
      default: "primary",
      validator: value => ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].includes(value)
    },
    size: { 
      type: String, 
      default: "md",
      validator: value => ['sm', 'md', 'lg'].includes(value)
    },
    loading: { 
      type: Boolean, 
      default: false 
    },
    disabled: { 
      type: Boolean, 
      default: false 
    },
    customStyle: { 
      type: String, 
      default: "" 
    }
  },
  computed: {
    buttonClasses() {
      return [
        'ceos-button-simple',
        `ceos-button-simple--${this.variant}`,
        `ceos-button-simple--${this.size}`,
        {
          'ceos-button-simple--loading': this.loading,
          'ceos-button-simple--disabled': this.disabled
        }
      ]
    }
  },
  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit('click', event)
      }
    }
  }
}
</script>

<style scoped>
.ceos-button-simple {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.25rem;
  border: 1px solid transparent;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  user-select: none;
  position: relative;
  overflow: hidden;
}

.ceos-button-simple:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.ceos-button-simple:active {
  transform: translateY(1px);
}

/* Size variants */
.ceos-button-simple--sm {
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  gap: 0.375rem;
}

.ceos-button-simple--lg {
  padding: 1rem 2rem;
  font-size: 1rem;
  gap: 0.625rem;
}

/* Color variants */
.ceos-button-simple--primary {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
}

.ceos-button-simple--primary:hover:not(.ceos-button-simple--disabled) {
  background-color: #2563eb;
  border-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.ceos-button-simple--secondary {
  background-color: #6b7280;
  color: white;
  border-color: #6b7280;
}

.ceos-button-simple--secondary:hover:not(.ceos-button-simple--disabled) {
  background-color: #4b5563;
  border-color: #4b5563;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
}

.ceos-button-simple--success {
  background-color: #10b981;
  color: white;
  border-color: #10b981;
}

.ceos-button-simple--success:hover:not(.ceos-button-simple--disabled) {
  background-color: #059669;
  border-color: #059669;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.ceos-button-simple--danger {
  background-color: #ef4444;
  color: white;
  border-color: #ef4444;
}

.ceos-button-simple--danger:hover:not(.ceos-button-simple--disabled) {
  background-color: #dc2626;
  border-color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.ceos-button-simple--warning {
  background-color: #f59e0b;
  color: white;
  border-color: #f59e0b;
}

.ceos-button-simple--warning:hover:not(.ceos-button-simple--disabled) {
  background-color: #d97706;
  border-color: #d97706;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.ceos-button-simple--info {
  background-color: #06b6d4;
  color: white;
  border-color: #06b6d4;
}

.ceos-button-simple--info:hover:not(.ceos-button-simple--disabled) {
  background-color: #0891b2;
  border-color: #0891b2;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
}

.ceos-button-simple--light {
  background-color: #f3f4f6;
  color: #1f2937;
  border-color: #f3f4f6;
}

.ceos-button-simple--light:hover:not(.ceos-button-simple--disabled) {
  background-color: #e5e7eb;
  border-color: #e5e7eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(243, 244, 246, 0.3);
}

.ceos-button-simple--dark {
  background-color: #1f2937;
  color: white;
  border-color: #1f2937;
}

.ceos-button-simple--dark:hover:not(.ceos-button-simple--disabled) {
  background-color: #111827;
  border-color: #111827;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(31, 41, 55, 0.3);
}

/* States */
.ceos-button-simple--disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}

.ceos-button-simple--loading {
  cursor: wait;
  pointer-events: none;
}

/* Spinner */
.button-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-icon {
  width: 1rem;
  height: 1rem;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .ceos-button-simple--sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }

  .ceos-button-simple--md {
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
  }

  .ceos-button-simple--lg {
    padding: 0.875rem 1.75rem;
    font-size: 1rem;
  }
}
</style> 