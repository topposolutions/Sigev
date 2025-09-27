<template>
  <div
    class="modal fade"
    :class="{ show: modelValue }"
    :style="{ display: modelValue ? 'block' : 'none' }"
    tabindex="-1"
    role="dialog"
    aria-modal="true"
    aria-labelledby="searchModalLabel"
  >
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header border-0 pb-0">
          <div class="w-100">
            <div class="input-group input-group-lg search-input-group">
              <span
                class="input-group-text bg-light border-0 ps-3 search-icon-left"
              >
                <Search :size="20" class="text-muted" />
              </span>
              <input
                ref="searchInput"
                type="text"
                class="form-control border-0 bg-light pe-3 search-input-field"
                placeholder="Buscar documentos..."
                v-model="query"
                @input="handleSearch"
                @keydown.escape="closeModal"
                @keydown.enter="selectResult"
                @keydown.arrow-down="navigateDown"
                @keydown.arrow-up="navigateUp"
                aria-label="Campo de busca de documentos"
              />
              <button
                class="btn btn-light border-0 pe-3 search-close-button"
                @click="closeModal"
                aria-label="Fechar busca"
              >
                <X :size="16" />
              </button>
            </div>
          </div>
        </div>

        <div class="modal-body pt-0 px-3" v-if="query.length > 0">
          <!-- Search Results -->
          <div v-if="results.length > 0" class="search-results" role="list">
            <div class="results-header mb-3">
              <small class="text-muted"
                >{{ results.length }} resultado{{
                  results.length !== 1 ? "s" : ""
                }}
                encontrado{{ results.length !== 1 ? "s" : "" }}</small
              >
            </div>

            <div class="results-list">
              <div
                v-for="(result, index) in results"
                :key="result.id"
                class="result-item"
                :class="{ active: selectedIndex === index }"
                @click="selectDocument(result)"
                @mouseenter="selectedIndex = index"
                role="listitem"
                tabindex="0"
                :aria-selected="selectedIndex === index"
                :aria-label="`Abrir ${result.title}`"
              >
                <div class="d-flex align-items-center">
                  <div class="result-icon me-3">
                    <component
                      :is="getFileIcon(result.type)"
                      :size="20"
                      :class="getFileTypeColor(result.type)"
                    />
                  </div>
                  <div class="flex-grow-1">
                    <div class="result-title">{{ result.title }}</div>
                    <div class="result-meta">
                      <span class="badge text-bg-secondary me-2">{{
                        result.category
                      }}</span>
                      <small class="text-muted"
                        >{{ result.type }} •
                        {{ formatFileSize(result.size) }}</small
                      >
                    </div>
                  </div>
                  <div class="result-action">
                    <small class="text-muted">Enter para abrir</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div
            v-else-if="!isSearching"
            class="no-results text-center py-5"
            role="status"
          >
            <Search :size="56" class="text-muted mb-3" />
            <h6 class="text-muted fw-semibold">Nenhum resultado encontrado</h6>
            <p class="text-muted mb-0">
              Tente usar termos diferentes ou verificar a ortografia.
            </p>
          </div>

          <!-- Loading -->
          <div v-if="isSearching" class="text-center py-5" role="status">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Buscando...</span>
            </div>
            <p class="text-muted mt-3 mb-0">Buscando documentos...</p>
          </div>
        </div>

        <!-- Quick Actions (when no query) -->
        <div class="modal-body pt-0 px-3" v-else>
          <div class="quick-actions" role="list">
            <div class="mb-3">
              <small class="text-muted fw-semibold text-uppercase"
                >AÇÕES RÁPIDAS</small
              >
            </div>

            <div
              class="action-item"
              @click="navigateToUpload"
              role="listitem"
              tabindex="0"
              aria-label="Fazer Upload de novos documentos"
            >
              <div class="d-flex align-items-center">
                <div class="action-icon me-3 bg-primary-subtle text-primary">
                  <Upload :size="20" />
                </div>
                <div>
                  <div class="action-title fw-semibold">Fazer Upload</div>
                  <small class="text-muted">Adicionar novos documentos</small>
                </div>
              </div>
            </div>

            <div
              class="action-item"
              @click="navigateToDocuments"
              role="listitem"
              tabindex="0"
              aria-label="Ver todos os documentos"
            >
              <div class="d-flex align-items-center">
                <div class="action-icon me-3 bg-success-subtle text-success">
                  <FileText :size="20" />
                </div>
                <div>
                  <div class="action-title fw-semibold">Ver Documentos</div>
                  <small class="text-muted"
                    >Navegar por todos os documentos</small
                  >
                </div>
              </div>
            </div>

            <div
              class="action-item"
              @click="navigateToAnalytics"
              role="listitem"
              tabindex="0"
              aria-label="Ver relatórios e estatísticas"
            >
              <div class="d-flex align-items-center">
                <div class="action-icon me-3 bg-warning-subtle text-warning">
                  <BarChart3 :size="20" />
                </div>
                <div>
                  <div class="action-title fw-semibold">Ver Relatórios</div>
                  <small class="text-muted">Análises e estatísticas</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="modal-footer border-0 bg-light-subtle">
          <div class="d-flex justify-content-between w-100">
            <div class="keyboard-shortcuts">
              <small class="text-muted">
                <kbd>↑</kbd> <kbd>↓</kbd> para navegar • <kbd>Enter</kbd> para
                selecionar • <kbd>Esc</kbd> para fechar
              </small>
            </div>
            <div class="search-tip">
              <small class="text-muted">Dica: Use aspas para busca exata</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal Backdrop -->
  <div
    v-if="modelValue"
    class="modal-backdrop fade show"
    @click="closeModal"
  ></div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import {
  Search,
  X,
  Upload,
  FileText,
  BarChart3,
  File,
  FileSpreadsheet,
  Image,
} from "lucide-vue-next";
import { useDocumentsStore } from "../../stores/documents";

interface Props {
  modelValue: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  "update:modelValue": [value: boolean];
}>();

const router = useRouter();
const documentsStore = useDocumentsStore();

const searchInput = ref<HTMLInputElement>();
const query = ref("");
const results = ref<any[]>([]);
const selectedIndex = ref(0);
const isSearching = ref(false);

const handleSearch = async () => {
  if (query.value.length < 2) {
    results.value = [];
    return;
  }

  isSearching.value = true;
  selectedIndex.value = 0;

  // Simular delay de busca
  setTimeout(() => {
    results.value = documentsStore.documents
      .filter(
        (doc) =>
          doc.title.toLowerCase().includes(query.value.toLowerCase()) ||
          doc.tags.some((tag) =>
            tag.toLowerCase().includes(query.value.toLowerCase())
          ) ||
          doc.category.toLowerCase().includes(query.value.toLowerCase())
      )
      .slice(0, 8); // Limitar a 8 resultados

    isSearching.value = false;
  }, 300);
};

const navigateDown = () => {
  if (selectedIndex.value < results.value.length - 1) {
    selectedIndex.value++;
  }
};

const navigateUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--;
  }
};

const selectResult = () => {
  if (results.value.length > 0 && selectedIndex.value >= 0) {
    selectDocument(results.value[selectedIndex.value]);
  }
};

const selectDocument = (document: any) => {
  console.log("Abrindo documento:", document.title);
  closeModal();
  // Implementar abertura do documento
};

const closeModal = () => {
  emit("update:modelValue", false);
  query.value = "";
  results.value = [];
  selectedIndex.value = 0;
};

const navigateToUpload = () => {
  closeModal();
  router.push("/upload");
};

const navigateToDocuments = () => {
  closeModal();
  router.push("/documents");
};

const navigateToAnalytics = () => {
  closeModal();
  router.push("/analytics");
};

const getFileIcon = (type: string) => {
  const icons: Record<string, any> = {
    PDF: FileText,
    DOCX: File,
    TXT: FileText,
    XLSX: FileSpreadsheet,
    PNG: Image,
    JPG: Image,
  };
  return icons[type] || FileText;
};

const getFileTypeColor = (type: string) => {
  const colors: Record<string, string> = {
    PDF: "text-danger",
    DOCX: "text-primary",
    TXT: "text-secondary",
    XLSX: "text-success",
    PNG: "text-info",
    JPG: "text-info",
  };
  return colors[type] || "text-secondary";
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Focus input when modal opens
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      nextTick(() => {
        searchInput.value?.focus();
      });
    }
  }
);
</script>

<style scoped>
.modal {
  z-index: 1055;
}

.modal-dialog {
  max-width: 700px; /* Aumentar largura máxima do modal */
}

.modal-backdrop {
  z-index: 1050;
  background-color: rgba(0, 0, 0, 0.4); /* Cor de fundo do backdrop */
  backdrop-filter: blur(5px); /* Efeito de desfoque */
}

.modal-content {
  border: none;
  border-radius: 1rem; /* Mais arredondado */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15); /* Sombra mais suave e proeminente */
  overflow: hidden; /* Garantir que o conteúdo respeite o border-radius */
}

.search-input-group .form-control,
.search-input-group .input-group-text {
  height: 60px; /* Aumentar altura do campo de busca */
  font-size: 1.25rem; /* Aumentar tamanho da fonte */
}

.search-input-field:focus {
  outline: none; /* Remover outline padrão do navegador */
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25); /* Adicionar um box-shadow de foco azul sutil */
  border-color: transparent; /* Remover borda padrão */
}

.search-input-group .input-group-text {
  background-color: var(
    --bs-gray-100
  ) !important; /* Cor de fundo mais neutra */
  color: var(--bs-gray-600) !important;
  transition: background-color 0.2s ease; /* Transição para o ícone esquerdo */
}

.search-input-group .search-icon-left:hover {
  background-color: var(--bs-gray-200) !important;
}

.search-input-group .search-close-button {
  transition: background-color 0.2s ease; /* Transição para o botão de fechar */
}

.search-input-group .search-close-button:hover {
  background-color: var(--bs-gray-200) !important;
}

/* Estilos para o spinner de loading */
.spinner-border {
  width: 2.5rem; /* Aumentar tamanho do spinner */
  height: 2.5rem;
  border-width: 0.3em; /* Deixar o spinner um pouco mais grosso */
}

.results-header,
.quick-actions .mb-3 {
  padding-left: 0; /* Removido para usar o padding do .modal-body */
  padding-right: 0; /* Removido para usar o padding do .modal-body */
}

.results-list {
  padding-left: 0; /* Removido para usar o padding do .modal-body */
  padding-right: 0; /* Removido para usar o padding do .modal-body */
}

.result-item,
.action-item {
  padding: 0.9rem 1rem; /* Ajustar padding */
  border-radius: 0.75rem; /* Mais arredondado */
  cursor: pointer;
  transition: background-color 0.2s ease, box-shadow 0.2s ease; /* Adicionar transição para sombra */
  margin-bottom: 0.4rem; /* Reduzir espaçamento entre itens */
}

.result-item:last-child,
.action-item:last-child {
  margin-bottom: 0; /* Remover margin-bottom do último item */
}

.result-item:hover,
.result-item.active,
.action-item:hover {
  background-color: var(
    --bs-gray-100
  ); /* Usar uma cor de destaque mais suave */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Adicionar sombra no hover/active */
}

.result-icon,
.action-icon {
  width: 38px; /* Aumentar tamanho dos ícones de resultado/ação */
  height: 38px;
  min-width: 38px; /* Garantir tamanho mínimo */
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--bs-light); /* Fundo claro para o ícone */
  border-radius: 0.5rem; /* Mais arredondado */
  font-size: 1.1rem; /* Ajustar tamanho da fonte do ícone se for texto */
}

.result-title {
  font-weight: 600; /* Mais negrito */
  font-size: 1.05rem; /* Ligeiramente maior */
  margin-bottom: 0.2rem; /* Espaçamento menor */
  color: var(--bs-gray-800); /* Cor mais escura */
}

.result-meta small,
.action-item small {
  font-size: 0.85rem; /* Ligeiramente menor para meta-informações */
  color: var(--bs-gray-500) !important; /* Cor mais sutil */
}

.result-action small {
  font-size: 0.75rem; /* Menor para a dica de ação */
  color: var(--bs-gray-400) !important;
}

.badge {
  font-size: 0.75rem; /* Tamanho do badge */
  padding: 0.3em 0.6em; /* Padding ajustado */
  border-radius: 0.35rem; /* Mais arredondado */
  font-weight: 500; /* Peso da fonte */
}

.text-bg-secondary {
  background-color: var(--bs-gray-200) !important;
  color: var(--bs-gray-700) !important;
}

.action-title {
  font-weight: 600; /* Mais negrito */
  font-size: 1.05rem; /* Ligeiramente maior */
  margin-bottom: 0.2rem; /* Espaçamento menor */
  color: var(--bs-gray-800); /* Cor mais escura */
}

.keyboard-shortcuts small,
.search-tip small {
  font-size: 0.8rem; /* Aumentar um pouco a fonte do rodapé */
}

kbd {
  background-color: var(--bs-gray-200); /* Cor de fundo mais clara */
  border: 1px solid var(--bs-gray-300); /* Borda mais suave */
  border-bottom-color: var(
    --bs-gray-400
  ); /* Borda inferior mais escura para profundidade */
  border-radius: 0.3rem;
  padding: 0.2em 0.5em;
  font-size: 0.75rem;
  color: var(--bs-gray-700);
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .modal-dialog {
    margin: var(--spacing-sm); /* Margem menor em telas pequenas */
    max-width: none;
  }

  .modal-content {
    border-radius: 0.75rem; /* Ajustar border-radius em telas menores */
  }

  .modal-header .input-group-lg .form-control,
  .modal-header .input-group-lg .input-group-text {
    height: 50px; /* Altura menor em telas pequenas */
    font-size: 1.1rem;
  }

  .result-action {
    display: none;
  }

  .keyboard-shortcuts {
    display: none;
  }
}
</style>
