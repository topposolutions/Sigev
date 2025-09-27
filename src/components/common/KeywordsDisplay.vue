<template>
  <div class="keywords-display">
    <div v-if="keywords && keywords.length > 0" class="keywords-wrapper">
      <!-- Mostra as primeiras 3 palavras-chave -->
      <span
        v-for="(keyword, index) in visibleKeywords"
        :key="index"
        class="keyword-badge"
        :title="keyword"
      >
        {{ keyword }}
      </span>
      
      <!-- Badge para mostrar quantas palavras-chave restam -->
      <span
        v-if="hiddenKeywords.length > 0"
        class="keyword-badge more-badge"
        :title="`Palavras-chave adicionais: ${hiddenKeywords.join(', ')}`"
      >
        +{{ hiddenKeywords.length }}
      </span>
    </div>
    <span v-else class="no-keywords">Nenhuma palavra-chave</span>
  </div>
</template>

<script>
export default {
  name: 'KeywordsDisplay',
  props: {
    keywords: {
      type: Array,
      default: () => []
    },
    maxVisible: {
      type: Number,
      default: 3
    }
  },
  computed: {
    visibleKeywords() {
      return this.keywords.slice(0, this.maxVisible);
    },
    hiddenKeywords() {
      return this.keywords.slice(this.maxVisible);
    }
  }
}
</script>

<style scoped>
.keywords-display {
  min-width: 200px;
}

.keywords-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.keyword-badge {
  display: inline-block;
  padding: 3px 10px;
  font-size: 11px;
  font-weight: 500;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: default;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
  position: relative;
}

.keyword-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
}

.more-badge {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  font-weight: 600;
  min-width: 28px;
  text-align: center;
  cursor: help;
}

.more-badge:hover {
  background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);
}

.no-keywords {
  color: #6c757d;
  font-size: 12px;
  font-style: italic;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .keywords-display {
    min-width: 150px;
  }
  
  .keyword-badge {
    font-size: 10px;
    padding: 2px 8px;
    max-width: 80px;
  }
}
</style> 