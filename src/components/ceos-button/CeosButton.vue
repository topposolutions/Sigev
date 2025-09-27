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
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-dasharray="31.416"
          stroke-dashoffset="31.416"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="2s"
            values="0 31.416;15.708 15.708;0 31.416"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            dur="2s"
            values="0;-15.708;-31.416"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>

    <!-- Icon -->
    <i
      v-if="icon && !loading"
      :class="icon"
      class="button-icon"
      :title="title"
    ></i>

    <!-- Slot for custom icon -->
    <slot name="icon" v-if="!icon && !loading" />

    <!-- Text -->
    <span v-if="text" class="button-text">
      {{ text }}
    </span>

    <!-- Slot for custom content -->
    <slot v-if="!text" />
  </button>
</template>

<script>
export default {
  name: "CeosButton",
  props: {
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    customStyle: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "md",
      validator: (value) => ["sm", "md", "lg"].includes(value),
    },
    variant: {
      type: String,
      default: "primary",
      validator: (value) =>
        [
          "primary",
          "secondary",
          "success",
          "danger",
          "warning",
          "info",
          "light",
          "dark",
          "outline-primary",
          "outline-secondary",
          "outline-success",
          "outline-danger",
          "outline-warning",
          "outline-info",
          "outline-light",
          "outline-dark",
        ].includes(value),
    },
    loading: {
      type: Boolean,
      default: false,
    },
    pill: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    block: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    buttonClasses() {
      return [
        "ceos-button",
        `ceos-button--${this.variant}`,
        `ceos-button--${this.size}`,
        {
          "ceos-button--loading": this.loading,
          "ceos-button--pill": this.pill,
          "ceos-button--block": this.block,
          "ceos-button--disabled": this.disabled,
        },
      ];
    },
  },
  methods: {
    handleClick(event) {
      if (!this.disabled && !this.loading) {
        this.$emit("click", event);
      }
    },
  },
};
</script>

<style scoped lang="scss">
// Variables
$primary-color: #3b82f6;
$primary-hover: #2563eb;
$secondary-color: #6b7280;
$secondary-hover: #4b5563;
$success-color: #10b981;
$success-hover: #059669;
$danger-color: #ef4444;
$danger-hover: #dc2626;
$warning-color: #f59e0b;
$warning-hover: #d97706;
$info-color: #06b6d4;
$info-hover: #0891b2;
$light-color: #f3f4f6;
$light-hover: #e5e7eb;
$dark-color: #1f2937;
$dark-hover: #111827;

// Base button styles
.ceos-button {
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
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  user-select: none;
  position: relative;
  overflow: hidden;

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  &:active {
    transform: translateY(1px);
  }

  // Disabled state
  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  // Loading state
  &--loading {
    cursor: wait;
    pointer-events: none;
  }

  // Pill variant
  &--pill {
    border-radius: 9999px;
  }

  // Block variant
  &--block {
    width: 100%;
  }

  // Icon styles
  .button-icon {
    font-size: 1rem;
    line-height: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: inherit;
  }

  // Size variants
  &--sm {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
    gap: 0.375rem;

    .button-icon {
      font-size: 0.875rem;
    }
  }

  &--lg {
    padding: 1rem 2rem;
    font-size: 1rem;
    gap: 0.625rem;

    .button-icon {
      font-size: 1.125rem;
    }
  }

  // Color variants
  &--primary {
    background-color: $primary-color;
    color: white;
    border-color: $primary-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $primary-hover;
      border-color: $primary-hover;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  }

  &--secondary {
    background-color: $secondary-color;
    color: white;
    border-color: $secondary-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $secondary-hover;
      border-color: $secondary-hover;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
    }
  }

  &--success {
    background-color: $success-color;
    color: white;
    border-color: $success-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $success-hover;
      border-color: $success-hover;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  }

  &--danger {
    background-color: $danger-color;
    color: white;
    border-color: $danger-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $danger-hover;
      border-color: $danger-hover;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
  }

  &--warning {
    background-color: $warning-color;
    color: white;
    border-color: $warning-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $warning-hover;
      border-color: $warning-hover;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }
  }

  &--info {
    background-color: $info-color;
    color: white;
    border-color: $info-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $info-hover;
      border-color: $info-hover;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
    }
  }

  &--light {
    background-color: $light-color;
    color: $dark-color;
    border-color: $light-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $light-hover;
      border-color: $light-hover;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(243, 244, 246, 0.3);
    }
  }

  &--dark {
    background-color: $dark-color;
    color: white;
    border-color: $dark-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $dark-hover;
      border-color: $dark-hover;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(31, 41, 55, 0.3);
    }
  }

  // Outline variants
  &--outline-primary {
    background-color: transparent;
    color: $primary-color;
    border-color: $primary-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $primary-color;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    }
  }

  &--outline-secondary {
    background-color: transparent;
    color: $secondary-color;
    border-color: $secondary-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $secondary-color;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(107, 114, 128, 0.3);
    }
  }

  &--outline-success {
    background-color: transparent;
    color: $success-color;
    border-color: $success-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $success-color;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
    }
  }

  &--outline-danger {
    background-color: transparent;
    color: $danger-color;
    border-color: $danger-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $danger-color;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
    }
  }

  &--outline-warning {
    background-color: transparent;
    color: $warning-color;
    border-color: $warning-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $warning-color;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
    }
  }

  &--outline-info {
    background-color: transparent;
    color: $info-color;
    border-color: $info-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $info-color;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
    }
  }

  &--outline-light {
    background-color: transparent;
    color: $dark-color;
    border-color: $light-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $light-color;
      color: $dark-color;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(243, 244, 246, 0.3);
    }
  }

  &--outline-dark {
    background-color: transparent;
    color: $dark-color;
    border-color: $dark-color;

    &:hover:not(.ceos-button--disabled) {
      background-color: $dark-color;
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(31, 41, 55, 0.3);
    }
  }
}

// Icon styles
.button-icon {
  flex-shrink: 0;
  stroke-width: 2;
}

// Text styles
.button-text {
  white-space: nowrap;
}

// Spinner styles
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

// Responsive adjustments
@media (max-width: 768px) {
  .ceos-button {
    &--sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
    }

    &--md {
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
    }

    &--lg {
      padding: 0.875rem 1.75rem;
      font-size: 1rem;
    }
  }
}
</style>
