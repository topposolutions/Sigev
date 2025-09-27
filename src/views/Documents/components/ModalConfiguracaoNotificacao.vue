<template>
  <ceos-modal
    ref="modal"
    :show="showModalData"
    @close="fhideModal"
    size="md"
    centered
    noCloseBackdrop
    :hide-header="false"
    :hide-footer="false"
    header-title="Criar Notificação"
    header-subtitle="Configure as notificações para este documento"
    header-icon="bi bi-bell-fill"
    ok-title="Salvar"
    cancel-title="Cancelar"
    ok-variant="success"
    cancel-variant="secondary"
    ok-icon="bi bi-check-lg"
    cancel-icon="bi bi-x-lg"
    theme="primary"
    @ok.prevent="save($event)"
    @cancel="fhideModal"
  >
    <div class="container-fluid">
      <div class="row mt-4">
        <div class="col-md-12">
          <div class="form-group">
            <ceos-input
              v-model="documentDataEvento"
              ref="dataEvento"
              type="date"
              :disabled="true"
              class="mb-2"
            >
              <template #label>
                <span>Data do Evento</span>
              </template>
            </ceos-input>

            <ceos-input-date
              class="mb-2"
              required
              ref="dataLembrete"
              v-model="form.data_lembrete"
              :required="true"
              :enable-time-picker="true"
              label="Data e Hora de Notificaçao"
            >
              <template #label>
                <span>Data e Hora do Lembrete</span>
              </template>
            </ceos-input-date>

            <ceos-input
              class="mb-2"
              ref="lembrete"
              required
              v-model="form.observacoes"
              :maxLength="500"
            >
              <template #label>
                <span>Lembrete</span>
              </template>
            </ceos-input>
          </div>
        </div>
      </div>
    </div>
  </ceos-modal>
</template>

<script>
import CeosModal from "../../../components/ceos-modal/CeosModal.vue";
import CeosInputDate from "../../../components/ceos-inputs/CeosInputDate.vue";
import CeosInput from "../../../components/ceos-inputs/CeosInput.vue";
import CeosSelect from "../../../components/ceos-inputs/CeosSelect.vue";
import { Notification } from "../../../common/models/Notificacao/Notification";
import Swal from "sweetalert2";
import { useHtmlClassStore } from "../../../stores/htmlclass.simple.store.js";
import NotificationService from "../../../common/services/notifications/Notification.service";
const htmlClassStore = useHtmlClassStore();

export default {
  props: {
    document: { type: Object, required: true },
  },
  name: "ModalConfiguracaoNotificacao",
  components: {
    CeosModal,
    CeosInput,
    CeosSelect,
    CeosInputDate,
  },
  data() {
    return {
      showModalData: false,
      loading: false,
      form: new Notification({}),
    };
  },

  computed: {
    documentDataEvento() {
      return this.document && this.document.data_evento
        ? this.document.data_evento
        : "";
    },
    documentData() {
      if (!this.document) return [];
      return {
        value: this.document.data_evento,
        text: this.document.data_evento,
      };
      //return this.document.datas_eventos_futuros.map((item) => ({
      // value: item.data_evento,
      // text: item.data_evento,
      //}));
    },
  },

  methods: {
    show() {
      this.showModalData = true;
    },
    fShowModal() {
      this.showModalData = true;
    },
    fhideModal() {
      this.showModalData = false;
    },
    validateForm() {
      let arrayValidacao = [];
      arrayValidacao.push(this.$refs.lembrete.valid());
      arrayValidacao.push(this.$refs.dataEvento.valid());
      arrayValidacao.push(this.$refs.dataLembrete.valid());
      return arrayValidacao.filter((elem) => elem == false).length == 0;
    },
    async save(event) {
      event.preventDefault();
      if (!this.validateForm()) return;

      htmlClassStore.startLoading();
      NotificationService.create({
        ...this.form,
        evento_documento_id: this.document.id,
        documento_id: this.document.documento_id,
      })
        .then(() => {
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
          this.fhideModal();
          this.$emit("listNotifications");
        });
    },
  },

  watch: {
    showModalData: {
      handler(newVal) {
        console.log(newVal);
      },
      deep: true,
    },
  },
};
</script>
<style scoped>
.modal-pre-imp {
  padding: 15px;
}
.btn-close-modal {
  position: absolute;
  top: -5px;
  right: 10px;
}
</style>
