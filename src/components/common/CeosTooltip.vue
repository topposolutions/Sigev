<template>
  <div class="ceos-tooltip-wrapper">
    <div
      :id="tooltipId"
      class="ceos-tooltip-trigger"
      :class="triggerClass"
      :style="triggerStyle"
      @mouseenter="showTooltip"
      @mouseleave="hideTooltip"
    >
      <slot name="trigger">
        <span class="text-truncate">{{ text }}</span>
      </slot>
    </div>

    <!-- Tooltip Overlay -->
    <teleport to="body">
      <div
        v-if="isVisible"
        :class="['ceos-tooltip', `ceos-tooltip--${position}`, { 'ceos-tooltip--dark': dark }]"
        :style="tooltipStyle"
        ref="tooltip"
      >
        <div class="ceos-tooltip__content">
          <slot name="content">
            <span>{{ content || text }}</span>
          </slot>
        </div>
        <div class="ceos-tooltip__arrow"></div>
      </div>
    </teleport>
  </div>
</template>

<script>
export default {
  name: 'CeosTooltip',
  props: {
    text: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    position: {
      type: String,
      default: 'top',
      validator: value => ['top', 'bottom', 'left', 'right'].includes(value)
    },
    maxWidth: {
      type: String,
      default: '300px'
    },
    delay: {
      type: Number,
      default: 200
    },
    dark: {
      type: Boolean,
      default: false
    },
    triggerClass: {
      type: String,
      default: ''
    },
    triggerStyle: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isVisible: false,
      tooltipId: `tooltip-${Math.random().toString(36).substr(2, 9)}`,
      showTimeout: null,
      hideTimeout: null
    }
  },
  computed: {
    tooltipStyle() {
      return {
        maxWidth: this.maxWidth,
        zIndex: 9999
      }
    }
  },
  methods: {
    showTooltip() {
      clearTimeout(this.hideTimeout);
      this.showTimeout = setTimeout(() => {
        this.isVisible = true;
        this.$nextTick(() => {
          this.positionTooltip();
        });
      }, this.delay);
    },
    hideTooltip() {
      clearTimeout(this.showTimeout);
      this.hideTimeout = setTimeout(() => {
        this.isVisible = false;
      }, 100);
    },
    positionTooltip() {
      if (!this.$refs.tooltip) return;
      
      const trigger = document.getElementById(this.tooltipId);
      const tooltip = this.$refs.tooltip;
      
      if (!trigger || !tooltip) return;
      
      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      
      let top, left;
      
      switch (this.position) {
        case 'top':
          top = triggerRect.top - tooltipRect.height - 8;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'bottom':
          top = triggerRect.bottom + 8;
          left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.left - tooltipRect.width - 8;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height / 2) - (tooltipRect.height / 2);
          left = triggerRect.right + 8;
          break;
      }
      
      // Garantir que o tooltip não saia da tela
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (left < 10) left = 10;
      if (left + tooltipRect.width > viewportWidth - 10) {
        left = viewportWidth - tooltipRect.width - 10;
      }
      if (top < 10) top = 10;
      if (top + tooltipRect.height > viewportHeight - 10) {
        top = viewportHeight - tooltipRect.height - 10;
      }
      
      tooltip.style.position = 'fixed';
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    }
  },
  beforeDestroy() {
    clearTimeout(this.showTimeout);
    clearTimeout(this.hideTimeout);
  }
}
</script>

<style scoped>
.ceos-tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.ceos-tooltip-trigger {
  cursor: help;
  display: inline-block;
  max-width: 100%;
}

.ceos-tooltip {
  position: fixed;
  background: #ffffff;
  color: #374151;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  line-height: 1.4;
  font-weight: 400;
  max-width: 300px;
  word-wrap: break-word;
  z-index: 99999;
  animation: tooltipFadeIn 0.2s ease-out;
  pointer-events: none;
}

.ceos-tooltip--dark {
  background: #1f2937;
  color: #f9fafb;
  border-color: #374151;
}

.ceos-tooltip__content {
  position: relative;
  z-index: 2;
}

.ceos-tooltip__arrow {
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;
}

/* Posicionamento das setas */
.ceos-tooltip--top .ceos-tooltip__arrow {
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-top-color: #ffffff;
  border-bottom: none;
}

.ceos-tooltip--top.ceos-tooltip--dark .ceos-tooltip__arrow {
  border-top-color: #1f2937;
}

.ceos-tooltip--bottom .ceos-tooltip__arrow {
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-bottom-color: #ffffff;
  border-top: none;
}

.ceos-tooltip--bottom.ceos-tooltip--dark .ceos-tooltip__arrow {
  border-bottom-color: #1f2937;
}

.ceos-tooltip--left .ceos-tooltip__arrow {
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-left-color: #ffffff;
  border-right: none;
}

.ceos-tooltip--left.ceos-tooltip--dark .ceos-tooltip__arrow {
  border-left-color: #1f2937;
}

.ceos-tooltip--right .ceos-tooltip__arrow {
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-right-color: #ffffff;
  border-left: none;
}

.ceos-tooltip--right.ceos-tooltip--dark .ceos-tooltip__arrow {
  border-right-color: #1f2937;
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsividade */
@media (max-width: 768px) {
  .ceos-tooltip {
    max-width: 250px;
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
  }
}

/* Melhorar acessibilidade */
.ceos-tooltip-trigger:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Estilo para texto truncado */
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
</style> 