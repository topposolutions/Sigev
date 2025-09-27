<template>
  <div>
    <b-dropdown
      no-caret
      class="actions-table actions-table no-button-style"
      id="dropdown-id"
      :dropleft="left"
      :variant="variant"
      size="sm"
      ref="dropdownElemento"
      :popper-opts="popperOps"
    >
      <template #button-content>
        <div :class="{ customClass: changePositionBtn }">
          <slot name="btn">
            <i
              class="bi bi-three-dots-vertical"
              :class="{ customClass: changePositionBtn }"
            ></i>
          </slot>
        </div>
      </template>
      <slot name="items"></slot>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  props: {
    boundary: {
      type: String,
      default: "window",
    },
    variant: {
      type: String,
      default: "none",
    },
    left: {
      type: Boolean,
      default: true,
    },
    changePositionBtn: {
      type: Boolean,
      default: false,
    },
    parent: {
      type: HTMLElement,
      default: () => document.body,
    },
  },
  data() {
    return {
      drop: true,
      dropdownElemento: null,
      popperOps: {
        modifiers: { offset: { offset: "0, 10px" } },
      },
    };
  },
  computed: {
    boundaryComputed() {
      return this.parent;
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.actions-table {
  display: flex;
  justify-content: flex-end;
}

.customClass {
  position: relative;
  top: -20px;
}

::v-deep(.no-button-style .dropdown-toggle) {
  border: none !important;
  background-color: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
}

::v-deep(.no-button-style .dropdown-toggle:hover),
::v-deep(.no-button-style .dropdown-toggle:focus) {
  background-color: transparent !important;
  box-shadow: none !important;
}
</style>
