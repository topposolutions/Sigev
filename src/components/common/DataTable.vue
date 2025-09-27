<template>
  <div class="datatable-wrapper card p-3">
    <div class="d-flex flex-wrap align-items-center mb-3 gap-2">
      <input
        v-if="searchable"
        v-model="search"
        type="text"
        class="form-control search-box"
        :placeholder="placeholder || 'Buscar...'"
        @input="onSearch"
        style="max-width: 250px;"
      />
      <slot name="filters"></slot>
    </div>
    <div class="table-responsive">
      <table class="table table-hover align-middle mb-0">
        <thead>
          <tr>
            <th
              v-for="col in columns"
              :key="col.key"
              @click="col.sortable ? sort(col.key) : null"
              :class="{'sortable': col.sortable, 'text-nowrap': true, 'cursor-pointer': col.sortable}"
              style="user-select: none;"
            >
              {{ col.label }}
              <span v-if="col.sortable">
                <i v-if="sortKey === col.key && sortOrder === 'asc'" class="bi bi-caret-up-fill ms-1"></i>
                <i v-else-if="sortKey === col.key && sortOrder === 'desc'" class="bi bi-caret-down-fill ms-1"></i>
                <i v-else class="bi bi-caret-down ms-1 text-secondary"></i>
              </span>
            </th>
            <th v-if="$slots.actions" class="text-end">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paginatedRows" :key="row.id">
            <td v-for="col in columns" :key="col.key" class="text-nowrap">
              <slot :name="`cell-${col.key}`" :row="row">
                {{ row[col.key] }}
              </slot>
            </td>
            <td v-if="$slots.actions" class="text-end">
              <slot name="actions" :row="row" />
            </td>
          </tr>
          <tr v-if="paginatedRows.length === 0">
            <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="text-center text-secondary py-4">
              Nenhum registro encontrado.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
      <div class="text-secondary small">
        Exibindo {{ start + 1 }}-{{ end }} de {{ filteredRows.length }} registros
      </div>
      <nav v-if="totalPages > 1">
        <ul class="pagination mb-0">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <button class="page-link" @click="goToPage(page - 1)" :disabled="page === 1">
              <i class="bi bi-chevron-left"></i>
            </button>
          </li>
          <li
            v-for="p in totalPages"
            :key="p"
            class="page-item"
            :class="{ active: p === page }"
          >
            <button class="page-link" @click="goToPage(p)">{{ p }}</button>
          </li>
          <li class="page-item" :class="{ disabled: page === totalPages }">
            <button class="page-link" @click="goToPage(page + 1)" :disabled="page === totalPages">
              <i class="bi bi-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  columns: { type: Array, required: true },
  rows: { type: Array, required: true },
  pageSize: { type: Number, default: 10 },
  searchable: { type: Boolean, default: true },
  placeholder: { type: String, default: '' },
});

const search = ref('');
const page = ref(1);
const sortKey = ref('');
const sortOrder = ref('asc');

const filteredRows = computed(() => {
  if (!props.searchable || !search.value) return props.rows;
  const s = search.value.toLowerCase();
  return props.rows.filter(row =>
    props.columns.some(col => String(row[col.key] ?? '').toLowerCase().includes(s))
  );
});

const sortedRows = computed(() => {
  if (!sortKey.value) return filteredRows.value;
  return [...filteredRows.value].sort((a, b) => {
    const valA = a[sortKey.value];
    const valB = b[sortKey.value];
    if (valA === valB) return 0;
    if (sortOrder.value === 'asc') return valA > valB ? 1 : -1;
    return valA < valB ? 1 : -1;
  });
});

const totalPages = computed(() => Math.ceil(sortedRows.value.length / props.pageSize));
const start = computed(() => (page.value - 1) * props.pageSize);
const end = computed(() => Math.min(start.value + props.pageSize, sortedRows.value.length));
const paginatedRows = computed(() => sortedRows.value.slice(start.value, end.value));

function sort(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
}

function goToPage(p) {
  if (p < 1 || p > totalPages.value) return;
  page.value = p;
}

function onSearch() {
  page.value = 1;
}

watch(() => props.rows, () => {
  page.value = 1;
});
</script>

<style scoped>
.datatable-wrapper {
  background: var(--bg-light);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  overflow-x: auto;
}
.table th.sortable {
  cursor: pointer;
  user-select: none;
}
.table th.sortable:hover {
  color: var(--primary-color);
}
.table th .bi {
  font-size: 0.9em;
}
</style> 