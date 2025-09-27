<template>
  <div class="ceos-accordion" :class="accordionClass">
    <div
      :class="{
        'ceos-accordion__head': hasDefaultHeadStyle,
        [customHeadClass]: !hasDefaultHeadStyle,
        [headClass]: true,
      }"
      v-if="hasTitleSlot || title"
      @click="toggleAccordion"
    >
      <div
        class="ceos-accordion__head-label"
        :style="{ display: displayLabelSlot }"
      >
        <slot name="title" v-if="hasTitleSlot"></slot>
        <div v-if="!hasTitleSlot">
          <h3 class="ceos-accordion__head-title" v-if="title">
            {{ title }}
          </h3>
          <h5 class="ceos-accordion__head-subtitle" v-if="subtitle">
            {{ subtitle }}
          </h5>
        </div>
        <b-badge :variant="badge.variant" v-if="badge">
          {{ badge.title }}
        </b-badge>
      </div>
      
      <!-- Ícone de toggle -->
      <div class="ceos-accordion__head-toggle">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :class="{ 'rotate': !isCollapsed }"
        >
          <path
            d="M6 9l6 6 6-6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      
      <!-- Toolbar customizada -->
      <div class="ceos-accordion__head-toolbar" @click.stop>
        <slot name="toolbar"></slot>
      </div>
    </div>

    <!-- Conteúdo do Acordeão -->
    <transition name="accordion">
      <div
        v-if="!isCollapsed"
        :id="bodyId"
        :class="[
          hasDefaultHeadStyle ? 'ceos-accordion__body' : customBodyClass,
          bodyClass,
          {
            'ceos-accordion__body--fit': bodyFit,
            'ceos-accordion__body--fluid': bodyFluid,
          },
        ]"
      >
        <slot name="body"></slot>
      </div>
    </transition>

    <!-- Footer do Acordeão -->
    <div class="ceos-accordion__foot" v-if="hasFootSlot">
      <slot name="foot"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "CeosAccordion",
  props: {
    /**
     * Título do acordeão
     */
    title: {
      type: String,
      default: ""
    },
    
    /**
     * Subtítulo do acordeão
     */
    subtitle: {
      type: String,
      default: ""
    },
    
    /**
     * Classe customizada para o cabeçalho
     */
    customHeadClass: {
      type: String,
      default: ""
    },
    
    /**
     * Classe customizada para o corpo
     */
    customBodyClass: {
      type: String,
      default: ""
    },
    
    /**
     * Classe customizada para o acordeão
     */
    accordionClass: {
      type: String,
      default: ""
    },
    
    /**
     * Usar estilo padrão do cabeçalho
     */
    hasDefaultHeadStyle: {
      type: Boolean,
      default: true
    },
    
    /**
     * Badge para exibir no cabeçalho
     */
    badge: {
      type: Object,
      default: null
    },
    
    /**
     * Tamanho do cabeçalho (sm, md, lg)
     */
    headSize: {
      type: String,
      default: ""
    },
    
    /**
     * Altura fluida
     */
    fluidHeight: {
      type: Boolean,
      default: false
    },
    
    /**
     * Altura fluida pela metade
     */
    fluidHalfHeight: {
      type: Boolean,
      default: false
    },
    
    /**
     * Cabeçalho overlay
     */
    headOverlay: {
      type: Boolean,
      default: false
    },
    
    /**
     * Classe extra para o cabeçalho
     */
    headClass: {
      type: String,
      default: ""
    },
    
    /**
     * Classe extra para o corpo
     */
    bodyClass: {
      type: String,
      default: ""
    },
    
    /**
     * Corpo com altura ajustada ao conteúdo
     */
    bodyFit: {
      type: Boolean,
      default: false
    },
    
    /**
     * Corpo fluido
     */
    bodyFluid: {
      type: Boolean,
      default: false
    },
    
    /**
     * ID do corpo
     */
    bodyId: {
      type: String,
      default: ""
    },
    
    /**
     * Estado inicial colapsado
     */
    collapsed: {
      type: Boolean,
      default: false
    },
    
    /**
     * Estilo de display para o slot de label
     */
    displayLabelSlot: {
      type: String,
      default: "flex"
    },
    
    /**
     * Permitir múltiplos acordeões abertos
     */
    allowMultiple: {
      type: Boolean,
      default: false
    }
  },
  
  data() {
    return {
      isCollapsed: this.collapsed
    };
  },
  
  watch: {
    collapsed(newValue) {
      this.isCollapsed = newValue;
    }
  },
  
  methods: {
    /**
     * Alterna o estado do acordeão
     */
    toggleAccordion() {
      this.isCollapsed = !this.isCollapsed;
      this.$emit("toggle", this.isCollapsed);
      this.$emit("update:collapsed", this.isCollapsed);
    },
    
    /**
     * Abre o acordeão
     */
    expand() {
      this.isCollapsed = false;
      this.$emit("expand");
      this.$emit("update:collapsed", false);
    },
    
    /**
     * Fecha o acordeão
     */
    collapse() {
      this.isCollapsed = true;
      this.$emit("collapse");
      this.$emit("update:collapsed", true);
    }
  },
  
  computed: {
    /**
     * Classes do acordeão
     */
    accordionClasses() {
      const classes = {
        "ceos-accordion--height-fluid": this.fluidHeight,
        "ceos-accordion--height-fluid-half": this.fluidHalfHeight,
        "ceos-accordion--head-overlay": this.headOverlay,
        "ceos-accordion--collapsed": this.isCollapsed
      };
      
      if (this.headSize) {
        classes[`ceos-accordion--head-${this.headSize}`] = true;
      }
      
      return classes;
    },
    
    /**
     * Verifica se existe slot de título
     */
    hasTitleSlot() {
      return !!this.$slots.title;
    },
    
    /**
     * Verifica se existe slot de footer
     */
    hasFootSlot() {
      return !!this.$slots.foot;
    },
    
    /**
     * Verifica se existe slot de toolbar
     */
    hasToolbarSlot() {
      return !!this.$slots.toolbar;
    }
  }
};
</script>

<style lang="scss" scoped>
.ceos-accordion {
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  &--collapsed {
    .ceos-accordion__head {
      border-bottom: none;
    }
  }
  
  &--height-fluid {
    height: 100%;
  }
  
  &--height-fluid-half {
    height: 50%;
  }
  
  &--head-overlay {
    .ceos-accordion__head {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
    }
  }
  
  &--head-sm {
    .ceos-accordion__head {
      padding: 0.5rem 1rem;
    }
  }
  
  &--head-lg {
    .ceos-accordion__head {
      padding: 1.5rem 1.5rem;
    }
  }
}

.ceos-accordion__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  
  &:hover {
    background: #f3f4f6;
  }
  
  &-label {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex: 1;
    min-width: 0;
  }
  
  &-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    margin: 0;
    line-height: 1.4;
  }
  
  &-subtitle {
    font-size: 0.875rem;
    font-weight: 400;
    color: #6b7280;
    margin: 0.25rem 0 0 0;
    line-height: 1.4;
  }
  
  &-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    color: #6b7280;
    transition: all 0.3s ease;
    
    svg {
      transition: transform 0.3s ease;
      
      &.rotate {
        transform: rotate(180deg);
      }
    }
  }
  
  &-toolbar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-left: 1rem;
  }
}

.ceos-accordion__body {
  padding: 1.5rem;
  background: #ffffff;
  
  &--fit {
    padding: 0;
  }
  
  &--fluid {
    padding: 0;
  }
}

.ceos-accordion__foot {
  padding: 1rem 1.5rem;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

/* Animações */
.accordion-enter-active,
.accordion-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

.accordion-enter-to,
.accordion-leave-from {
  max-height: 500px;
  opacity: 1;
}

/* Responsividade */
@media (max-width: 768px) {
  .ceos-accordion__head {
    padding: 0.75rem 1rem;
    
    &-title {
      font-size: 1rem;
    }
    
    &-subtitle {
      font-size: 0.8rem;
    }
  }
  
  .ceos-accordion__body {
    padding: 1rem;
  }
}

/* Estados especiais */
.ceos-accordion--primary {
  border-color: #3b82f6;
  
  .ceos-accordion__head {
    background: #eff6ff;
    border-bottom-color: #3b82f6;
    
    &:hover {
      background: #dbeafe;
    }
  }
}

.ceos-accordion--success {
  border-color: #10b981;
  
  .ceos-accordion__head {
    background: #ecfdf5;
    border-bottom-color: #10b981;
    
    &:hover {
      background: #d1fae5;
    }
  }
}

.ceos-accordion--warning {
  border-color: #f59e0b;
  
  .ceos-accordion__head {
    background: #fffbeb;
    border-bottom-color: #f59e0b;
    
    &:hover {
      background: #fef3c7;
    }
  }
}

.ceos-accordion--danger {
  border-color: #ef4444;
  
  .ceos-accordion__head {
    background: #fef2f2;
    border-bottom-color: #ef4444;
    
    &:hover {
      background: #fee2e2;
    }
  }
}
</style> 