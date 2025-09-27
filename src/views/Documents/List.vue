<template>
  <div class="container-fluid">
    <ceos-accordion>
      <template #title>
        <div class="d-flex align-items-center">
          <i class="bi bi-funnel-fill text-secondary me-2"></i>
          <span class="fw-semibold">Filtros</span>
        </div>
      </template>

      <template #body>
        <div class="row g-3">
          <div class="col-12 col-md-4">
            <ceos-input
              v-model="filters.nome"
              label="Nome do Documento"
              type="text"
              :validate-on-blur="false"
            >
              <template #label>
                <span>Nome do Documento</span>
              </template>
            </ceos-input>
          </div>
          <div class="col-12 col-md-4">
            <ceos-input
              v-model="filters.resumo"
              label="Resumo"
              type="text"
              :validate-on-blur="false"
            >
              <template #label>
                <span>Resumo</span>
              </template>
            </ceos-input>
          </div>
          <div class="col-12 col-md-4">
            <ceos-input
              v-model="filters.dados_evento.descricao_evento"
              label="Descrição"
              type="text"
              :validate-on-blur="false"
            >
              <template #label>
                <div class="d-flex align-items-center">
                  <span>Descriçao do Evento</span>
                  <i
                    class="bi bi-question-circle ms-2 text-primary"
                    style="cursor: help; font-size: 14px"
                    title="Aqui você pode filtrar os documentos pela descricão do evento. Exemplo: você lembra que vai ter uma reunião com a Empresa XPTO, porém você não lembra da data e também não lembra em qual documento está essa informação. Então você digita 'Reunião Empresa XPTO' aqui nesse campo"
                  ></i>
                </div>
              </template>
            </ceos-input>
          </div>

          <div class="col-12 col-md-4">
            <ceos-input
              type="date"
              v-model="filters.dados_evento.data_evento_inicial"
              label="Data Envio Inicial"
              :validate-on-blur="false"
            >
              <template #label>
                <span>Data Envio Inicial</span>
              </template>
            </ceos-input>
          </div>
          <div class="col-12 col-md-4">
            <ceos-input
              type="date"
              v-model="filters.dados_evento.data_evento_final"
              label="Data evento final"
              :validate-on-blur="false"
            >
              <template #label>
                <span>Data evento final</span>
              </template>
            </ceos-input>
          </div>
          <div class="col-12 col-md-4">
            <ceos-input
              v-model="filters.dados_evento.hora_evento"
              label="Hora evento"
              placeholder="00:00"
              type="time"
              :validate-on-blur="false"
            >
              <template #label>
                <span>Hora evento</span>
              </template>
            </ceos-input>
          </div>

          <div class="col-12 d-flex justify-content-end">
            <button class="btn btn-primary me-2" @click="list(true)">
              <i class="bi bi-search me-1"></i>
              {{ $t("COMMONS.SEARCH") }}
            </button>
            <button class="btn btn-outline-secondary" @click="limparFiltro">
              <i class="bi bi-arrow-clockwise me-1"></i>
              Limpar Filtros
            </button>
          </div>
        </div>
      </template>
    </ceos-accordion>

    <div class="card px-3 py-1">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h6 class="fw-semibold mb-0">Documentos</h6>
        <div class="d-flex align-items-center gap-2">
          <!-- <notification-system /> -->
        </div>
      </div>
      <b-table
        :items="documents"
        :fields="fields"
        :per-page="perPage"
        :empty-text="$t('COMMONS.NO_DATA_FOUND')"
        :current-page="currentPage"
        responsive
        small
        class="mb-2 fix-tabela"
        item-key="id"
        ref="table"
        hide-default-footer
        show-empty
        :busy="loadingTable"
        id="body-content"
      >
        <template #empty>
          <div class="empty-state">
            <div class="empty-icon">
              <i class="bi bi-inbox"></i>
            </div>
            <div class="empty-text">
              {{ $t("COMMONS.NO_DATA_FOUND") }}
            </div>
            <div class="empty-subtext">
              Nenhum documento encontrado para a pesquisa realizada!
            </div>
          </div>
        </template>
        <template v-slot:cell(possui_lembrete_futuro)="row">
          <div class="d-flex justify-content-center align-items-center">
            <i
              class="bi"
              :class="getBellIconClass(row.item)"
              :style="{
                fontSize: '1.2rem',
                cursor: 'pointer',
              }"
              :title="getBellTooltip(row.item)"
            ></i>
          </div>
        </template>
        <template v-slot:cell(showDetails)="row">
          <button class="btn btn-link p-0">
            <ChevronUp
              @click="toggleDetails(row)"
              :size="20"
              :class="{
                rotate90: !row.detailsShowing,
                rotate180: row.detailsShowing,
                'transition-transform': true,
              }"
            />
          </button>
        </template>
        <template v-slot:cell(status_processamento_eventos)="row">
          <StatusBadge
            :status="row.item.status_processamento_eventos"
            :label="row.item.status_processamento_eventos"
          />
        </template>
        <template v-slot:cell(resumo)="row">
          <div
            class="d-flex align-items-center justify-content-between gap-2"
            style="min-width: 0"
          >
            <button
              v-if="row.item.resumo"
              @click="openResumoModal(row.item.resumo)"
              class="btn btn-link p-0 text-primary hover-effect flex-shrink-0"
              title="Ver resumo completo"
              style="
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                min-width: 24px;
              "
            >
              <i class="bi bi-file-text" style="font-size: 1rem"></i>
            </button>
          </div>
        </template>

        <template v-slot:cell(nome)="row">
          <ceos-tooltip
            :text="row.item.nome"
            :content="`Nome completo: ${row.item.nome}`"
            position="top"
            max-width="250px"
            :trigger-style="{ maxWidth: '200px' }"
          />
        </template>
        <template v-slot:cell(palavras_chave)="row">
          <KeywordsDisplay
            :keywords="row.item.palavras_chave"
            :max-visible="2"
          />
        </template>
        <template v-slot:cell(actions)="row">
          <ceos-actions-table>
            <template #items>
              <div>
                <b-dropdown-item href="#"> Analisar Documento </b-dropdown-item>
                <b-dropdown-item href="#"> Remover Documento </b-dropdown-item>
              </div>
            </template>
          </ceos-actions-table>
        </template>
        <template v-slot:row-details="row">
          <div class="overflow">
            <b-table
              :empty-text="$t('COMMONS.NO_DATA_FOUND')"
              :items="detailsData[row.item.id] || []"
              :fields="detailsHeader"
              responsive
              class="table-carregamentos-lb"
              item-key="id"
              ref="detailsTable"
              hide-default-footer
              show-empty
            >
              <template v-slot:cell(criar_notificacao)="row">
                <ceos-button
                  size="sm"
                  variant="primary"
                  icon="pi pi-plus"
                  title="Criar Lembrete"
                  @click="insertNewNotification(row.item)"
                />
              </template>
              <template v-slot:head(showSubDetails)>
                <span>Detalhes</span>
              </template>
              <template v-slot:cell(showSubDetails)="detailRow">
                <button class="btn btn-link p-0">
                  <ChevronUp
                    @click="toggleSubDetails(detailRow, row.item.id)"
                    :size="16"
                    :class="{
                      rotate90: !detailRow.detailsShowing,
                      rotate180: detailRow.detailsShowing,
                      'transition-transform': true,
                    }"
                  />
                </button>
              </template>
              <template v-slot:cell(descricao_evento)="detailRow">
                <ceos-tooltip
                  v-if="detailRow.item.descricao_evento"
                  :text="detailRow.item.descricao_evento"
                  :content="detailRow.item.descricao_evento"
                  position="top"
                  max-width="300px"
                  :trigger-style="{ maxWidth: '280px' }"
                />
                <div v-else class="text-truncate" style="max-width: 280px">
                  {{ detailRow.item.descricao_evento }}
                </div>
              </template>
              <template v-slot:cell(data_evento)="row">
                {{ formatDate(row.item.data_evento) }}
                {{ row.item.hora_evento }}
              </template>
              <template v-slot:row-details="detailRow">
                <div class="sub-details-container">
                  <b-table
                    :empty-text="$t('COMMONS.NO_DATA_FOUND')"
                    :items="subDetailsData[detailRow.item.id] || []"
                    :fields="subDetailsHeader"
                    responsive
                    class="table-sub-details"
                    small
                  >
                    <template v-slot:cell(remover_lembrete)="row">
                      <i
                        @click="removeLembrete(row.item)"
                        class="bi bi-trash"
                        style="cursor: pointer"
                      ></i>
                    </template>

                    <template v-slot:cell(sub_descricao)="subRow">
                      <ceos-tooltip
                        v-if="subRow.item.sub_descricao"
                        :text="subRow.item.sub_descricao"
                        :content="subRow.item.sub_descricao"
                        position="top"
                        max-width="250px"
                        :trigger-style="{ maxWidth: '200px' }"
                      />
                      <div
                        v-else
                        class="text-truncate"
                        style="max-width: 200px"
                      >
                        {{ subRow.item.sub_descricao }}
                      </div>
                    </template>
                  </b-table>
                </div>
              </template>
            </b-table>
          </div>
        </template>
      </b-table>

      <b-row v-if="total > 0">
        <b-col class="col-md-10 col-xs-12 pull-left">
          <paginacao
            v-model="currentPage"
            :total="total"
            :porPagina="perPage"
            @change="$emit('change-page', $event)"
          />
        </b-col>
        <b-col class="col-md-2 col-xs-12 pull-right">
          <ceos-select
            v-model="perPage"
            :options="itemsPorPagina"
            size="sm"
          ></ceos-select>
        </b-col>
      </b-row>
    </div>
    <modal-configuracao-notificacao
      ref="insertNotificationModal"
      @salvar="insertNewByProcessType($event)"
      :document="document"
      @list-notifications="list"
    />

    <!-- Modal de Resumo -->
    <ceos-modal
      :show="showResumoModal"
      :header-title="'Resumo do Documento'"
      :header-subtitle="'Visualização completa do resumo'"
      :header-icon="'bi bi-file-text'"
      size="lg"
      :show-cancel-button="false"
      :show-ok-button="true"
      :hide-footer="false"
      ok-title="Fechar"
      @close="closeResumoModal"
      @ok="closeResumoModal"
    >
      <div class="resumo-content">
        <div class="resumo-text">
          {{ selectedResumo || "Nenhum resumo disponível" }}
        </div>
      </div>
    </ceos-modal>
  </div>
</template>

<script>
import StatusBadge from "../../components/common/StatusBadge.vue";
import Paginacao from "../../components/ceos-paginacao/Paginacao.vue";
import { ChevronUp, Bell, FileText } from "lucide-vue-next";
import CeosActionsTable from "../../components/ceos-actions-table/CeosActionsTable.vue";
import Swal from "sweetalert2";
import DocumentsService from "../../common/services/documents/Documents.service";
import NotificationService from "../../common/services/notifications/Notification.service";
import CeosInput from "../../components/ceos-inputs/CeosInput.vue";
import KeywordsDisplay from "../../components/common/KeywordsDisplay.vue";
import CeosSelect from "../../components/ceos-inputs/CeosSelect.vue";
import CeosButton from "../../components/ceos-button/CeosButton.vue";
import ModalConfiguracaoNotificacao from "./components/ModalConfiguracaoNotificacao.vue";
import AccordionExample from "../../examples/AccordionExample.vue";
import CeosAccordion from "../../components/common/CeosAccordion.vue";
import CeosConfirmacao from "../../components/ceosConfirmacao/CeosConfirmacao.js";
import CeosTooltip from "../../components/common/CeosTooltip.vue";
import CeosModal from "../../components/ceos-modal/CeosModal.vue";
import { useHtmlClassStore } from "../../stores/htmlclass.simple.store.js";
import NotificationSystem from "./components/NotificationSystem.vue";
import helpers from "../../common/services/helpers";
const htmlClassStore = useHtmlClassStore();
export default {
  name: "Reports",
  components: {
    StatusBadge,
    Paginacao,
    ChevronUp,
    Bell,
    FileText,
    CeosActionsTable,
    CeosInput,
    KeywordsDisplay,
    CeosSelect,
    CeosButton,
    ModalConfiguracaoNotificacao,
    AccordionExample,
    CeosAccordion,
    CeosConfirmacao,
    CeosTooltip,
    CeosModal,
    NotificationSystem,
  },
  data() {
    return {
      document: null,
      total: 0,
      loadingTable: false,
      showResumoModal: false,
      selectedResumo: null,
      filters: {
        nome: null,
        resumo: null,
        dados_evento: {
          descricao_evento: null,
          data_evento_inicial: null,
          data_evento_final: null,
          hora_evento: null,
        },
      },
      itemsPorPagina: [
        { value: 5, text: 5 },
        { value: 10, text: 10 },
        { value: 20, text: 20 },
        { value: 30, text: 30 },
        { value: 50, text: 50 },
        { value: 100, text: 100 },
      ],
      detailsData: {},
      subDetailsData: {},
      fields: [
        {
          key: "showDetails",
          label: "",
          visible: true,
        },
        { key: "nome", label: "Nome", sortable: true },
        { key: "resumo", label: "Resumo", sortable: true },
        { key: "palavras_chave", label: "Palavras-chave", sortable: false },
        {
          key: "status_processamento_eventos",
          label: "Status Processamento Eventos",
          sortable: true,
        },
        {
          key: "possui_lembrete_futuro",
          label: "",
          
        },
      ],
      detailsHeader: [
        {
          key: "showSubDetails",
          label: "",
          visible: true,
        },
        {
          key: "descricao_evento",
          label: "Descrição do Evento",
          sortable: true,
        },
        {
          key: "data_evento",
          label: "Data do Evento",
          sortable: true,
        },
        { key: "criar_notificacao", label: "Criar Lembrete" },
      ],
      subDetailsHeader: [
        {
          key: "observacoes",
          label: "Observações",
          sortable: true,
        },
        {
          key: "criado_em",
          label: "Criado em",
          sortable: true,
          formatter: (value) => helpers.getDateFormattedWHour(value),
        },
        {
          key: "data_lembrete",
          label: "Data e Hora do Lembrete",
          sortable: true,
          formatter: (value) => helpers.getDateFormattedWHour(value),
        },
        { key: "remover_lembrete", label: "Remover Lembrete" },
      ],
      documents: [],
      perPage: 5,
      currentPage: 1,
    };
  },
  computed: {
    paginatedRows() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredRows.slice(start, start + this.perPage);
    },
  },
  mounted() {
    this.list();
  },
  watch: {
    perPage() {
      this.currentPage = 1;
      this.list();
    },
  },
  methods: {
    formatDate(date) {
      if (!date) return "-";
      return helpers.getDateFormattedWHour(date);
    },
    insertNewNotification(document) {
      this.document = document;
      this.$refs.insertNotificationModal.fShowModal();
    },

    insertNewByProcessType(data) {
      console.log("Dados da notificação:", data);
      this.list();
    },
    async list() {
      htmlClassStore.startLoading();
      DocumentsService.list(this.filters, this.currentPage, this.perPage)
        .then((result) => {
          this.documents = result.data.itens;
          this.total = result.data.total_itens;
          // Limpa os caches de detalhes quando a lista é recarregada
          this.clearDetailsCache();
        })
        .catch(() => {
          Swal.fire({
            title: this.$t("COMMONS.ERROR_TITLE"),
            text: this.$t("COMMONS.ERROR_MESSAGE"),
            icon: "error",
          });
        })
        .finally(() => {
          htmlClassStore.stopLoading();
        });
    },
    removeLembrete(item) {
      CeosConfirmacao.SimNao(
        this,
        "Remover Lembrete",
        "Tem certeza que deseja remover o lembrete?"
      ).then(async (result) => {
        if (result.value) {
          htmlClassStore.startLoading();
          NotificationService.delete(item.id)
            .then(() => {
              this.list();
              Swal.fire({
                title: this.$t("COMMONS.SUCCESS"),
                text: this.$t("COMMONS.SUCCESS_MESSAGE"),
                icon: "success",
              });
            })
            .catch((err) => {
              Swal.fire({
                title: this.$t("COMMONS.ERROR_TITLE"),
                text: this.$t("COMMONS.ERROR_MESSAGE"),
                icon: "error",
              });
            })
            .finally(() => {
              htmlClassStore.stopLoading();
            });
        }
      });
    },
    toggleDetails(row) {
      row.detailsShowing = !row.detailsShowing;
      row.toggleDetails();
      if (row.detailsShowing) {
        // Sempre busca dados atualizados do item
        this.detailsData[row.item.id] = row.item.datas_eventos_futuros;
      }
    },
    toggleSubDetails(detailRow, parentId) {
      detailRow.detailsShowing = !detailRow.detailsShowing;
      detailRow.toggleDetails();
      if (detailRow.detailsShowing) {
        // Sempre busca dados atualizados do item
        this.subDetailsData[detailRow.item.id] = detailRow.item.lembretes;
      }
    },
    limparFiltro() {
      this.filters = {
        nome: null,
        resumo: null,
        dados_evento: {
          descricao_evento: null,
          data_evento_inicial: null,
          data_evento_final: null,
          hora_evento: null,
        },
      };
      this.currentPage = 1;
      this.list();
    },
    clearDetailsCache() {
      // Limpa os caches de detalhes
      this.detailsData = {};
      this.subDetailsData = {};
    },
    openResumoModal(resumo) {
      this.selectedResumo = resumo;
      this.showResumoModal = true;
    },
    closeResumoModal() {
      this.showResumoModal = false;
      this.selectedResumo = null;
    },
    getBellIconClass(item) {
      // Se possui_lembrete_futuro = true, mostra sino dourado
      if (item.possui_lembrete_futuro) {
        return "bi-bell-fill notification-active";
      }
      
      // Se possui_lembrete_futuro = false, verifica datas_eventos_futuros
      const datasEventosFuturos = item.datas_eventos_futuros || [];
      
      if (datasEventosFuturos.length > 0) {
        // Existem datas futuras de eventos, mas não há lembretes
        return "bi-bell notification-inactive";
      } else {
        // Não existem datas futuras de eventos nem lembretes
        return "bi-x-circle notification-empty";
      }
    },
    getBellTooltip(item) {
      // Se possui_lembrete_futuro = true
      if (item.possui_lembrete_futuro) {
        return "Existem lembretes cadastrados para o documento";
      }
      
      // Se possui_lembrete_futuro = false, verifica datas_eventos_futuros
      const datasEventosFuturos = item.datas_eventos_futuros || [];
      
      if (datasEventosFuturos.length > 0) {
        return "Existem datas futuras de eventos no documento, porém não existem lembretes cadastrados";
      } else {
        return "Não existem datas de eventos futuros e lembretes cadastrados para o documento";
      }
    },
  },
};
</script>

<style scoped>
.card {
  box-shadow: var(--shadow-sm);
}
form .form-label {
  font-weight: 500;
}

.fix-tabela {
  min-height: 220px;
}

/* Layout mais profissional para a tabela */
.b-table {
  font-size: 0.875rem;
}

.b-table .table {
  margin-bottom: 0;
}

.b-table .table tbody tr {
  height: 48px;
  border-bottom: 1px solid #e9ecef;
}

.b-table .table tbody tr:hover {
  background-color: #f8f9fa;
  transition: background-color 0.15s ease;
}

.b-table .table thead th {
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #495057;
  padding: 0.75rem 0.5rem;
  vertical-align: middle;
}

.b-table .table tbody td {
  padding: 0.5rem;
  vertical-align: middle;
  border-top: none;
}

/* Melhorar espaçamento dos filtros */
.filters-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
}

.filters-section h6 {
  color: #495057;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #dee2e6;
}

/* Card principal mais elegante */
.card {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.card h6 {
  color: #495057;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
}
.table-carregamentos-lb {
  width: 900px;
  border: 1px solid #898989;
}
.table-sub-details {
  width: 100%;
  margin-top: 0.5rem;
}
.sub-details-container {
  padding: 0.5rem;
  border-radius: 0.25rem;
  margin: 0.5rem 0;
}
.overflow {
  overflow: auto;
}
.rotate90 {
  transform: rotate(90deg);
}
.rotate180 {
  transform: rotate(180deg);
}
.transition-transform {
  transition: transform 0.2s;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: help;
}

/* Centralizar mensagem de "nenhum dado encontrado" */
.b-table .table-responsive .table tbody tr td {
  text-align: center;
}

/* Estilo específico para mensagem de dados vazios do Bootstrap Vue */
.b-table .table-responsive .table tbody tr td[colspan] {
  text-align: center !important;
  padding: 3rem 1rem !important;
  color: #6c757d !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  font-style: italic;
  background-color: #f8f9fa !important;
  border: none !important;
  vertical-align: middle !important;
}

/* Estilo para células únicas (mensagem de dados vazios) */
.b-table .table-responsive .table tbody tr td:only-child {
  text-align: center !important;
  padding: 3rem 1rem !important;
  color: #6c757d !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  background-color: #f8f9fa !important;
  border: none !important;
  vertical-align: middle !important;
}

/* Garantir que a mensagem de dados vazios seja centralizada */
.b-table .table-responsive .table tbody tr:only-child td {
  text-align: center !important;
  padding: 3rem 1rem !important;
  color: #6c757d !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  background-color: #f8f9fa !important;
  border: none !important;
  vertical-align: middle !important;
}

/* Estilo adicional para garantir centralização */
.b-table .table-responsive .table tbody tr td[colspan]:not([colspan="1"]) {
  text-align: center !important;
  padding: 3rem 1rem !important;
  color: #6c757d !important;
  font-size: 1rem !important;
  font-weight: 500 !important;
  background-color: #f8f9fa !important;
  border: none !important;
  vertical-align: middle !important;
}

/* Estilos para o estado vazio personalizado */
.empty-state {
  text-align: center;
  color: #6c757d;
}

.empty-icon {
  font-size: 2rem;
  color: #dee2e6;
}

.empty-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #495057;
}

.empty-subtext {
  font-size: 0.9rem;
  color: #6c757d;
  font-style: italic;
}

/* Garantir que o template vazio seja centralizado */
.b-table .table-responsive .table tbody tr td {
  text-align: center;
}

.b-table .table-responsive .table tbody tr td .empty-state {
  width: 100%;
  text-align: center;
}

/* Botão customizado */
.custom-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #3b82f6;
  color: white;
  border: 1px solid #3b82f6;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
  user-select: none;
}

.custom-button:hover {
  background-color: #2563eb;
  border-color: #2563eb;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.custom-button:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.custom-button:active {
  transform: translateY(0);
}

/* Melhorar aparência dos botões de filtro */
.btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border: none;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
  transition: all 0.2s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
}

.btn-outline-secondary {
  border: 1px solid #6b7280;
  color: #6b7280;
  transition: all 0.2s ease;
}

.btn-outline-secondary:hover {
  background-color: #6b7280;
  border-color: #6b7280;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(107, 114, 128, 0.2);
}

/* Melhorar aparência dos badges de status */
.badge {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
}

/* Estilos para tooltips personalizados */
.ceos-tooltip {
  font-size: 0.875rem;
}

/* Melhorar aparência da paginação */
.pagination {
  margin-bottom: 0;
}

.page-link {
  border: 1px solid #dee2e6;
  color: #495057;
  font-size: 0.875rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;
}

.page-link:hover {
  background-color: #e9ecef;
  border-color: #dee2e6;
  color: #495057;
  transform: translateY(-1px);
}

.page-item.active .page-link {
  background-color: #3b82f6;
  border-color: #3b82f6;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

/* Melhorar aparência dos dropdowns */
.dropdown-menu {
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dropdown-item {
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  transition: background-color 0.15s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
}

/* Estilos para ícones de notificação */
.notification-active {
  color: #f59e0b !important;
}

.notification-inactive {
  color: #6b7280 !important;
}

.notification-empty {
  color: #9ca3af !important;
}

/* Hover effects para os ícones */
.notification-active:hover {
  color: #d97706 !important;
  transform: scale(1.1);
  transition: all 0.2s ease;
}

.notification-inactive:hover {
  color: #4b5563 !important;
  transform: scale(1.1);
  transition: all 0.2s ease;
}

.notification-empty:hover {
  color: #6b7280 !important;
  transform: scale(1.1);
  transition: all 0.2s ease;
}

/* Garantir que todos os ícones tenham o mesmo tamanho */
.bi.bell,
.bi.bell-fill,
.bi.x-circle {
  font-size: 1.2rem !important;
}

/* Hover effect para o botão de resumo */
.hover-effect:hover {
  transform: scale(1.1);
  transition: all 0.2s ease;
  color: #2563eb !important;
  background-color: rgba(37, 99, 235, 0.1);
  border-radius: 4px;
  padding: 2px;
}

.hover-effect {
  transition: all 0.2s ease;
  border-radius: 4px;
}

.hover-effect:focus {
  box-shadow: 0 0 0 0.2rem rgba(37, 99, 235, 0.25);
  outline: none;
}

/* Estilos para o modal de resumo */
.resumo-content {
  padding: 1rem 0;
}

.resumo-text {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #374151;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-height: 400px;
  overflow-y: auto;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.resumo-text::-webkit-scrollbar {
  width: 6px;
}

.resumo-text::-webkit-scrollbar-track {
  background: transparent;
}

.resumo-text::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 3px;
}

.resumo-text::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
