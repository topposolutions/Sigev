<template>
  <b-row v-if="total > 0">
    <b-col class="col-xs-12 pull-left">
      <b-pagination
        v-model="content"
        :total-rows="total"
        :per-page="porPagina"
        aria-controls="my-table"
        @change="changePage"
      />
      <div class="paginationTotal" v-if="showTotal">
        {{ totalItens }}
      </div>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "Paginacao",
  props: {
    value: { type: [String, Number], default: "" },
    total: { type: Number, default: 0 },
    showTotal: { type: Boolean, default: true },
    porPagina: { type: Number },
  },
  data() {
    return {
      content: this.value,
    };
  },
  computed: {
    totalItens() {
      return `${this.$t("COMMONS.TOTAL_RECORDS")}: ${this.total}`;
    },
  },
  methods: {
    changePage(val) {
      this.$emit("change", val);
    },
  },
  watch: {
    value: {
      handler(value) {
        this.content = value;
      },
      deep: true,
      immediate: true,
    },
    content(val) {
      this.$emit("input", val);
    },
  },
};
</script>
