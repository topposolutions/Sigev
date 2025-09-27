<template>
  <div class="container-fluid py-3">
    <div class="row justify-content-center">
      <div class="col-12 col-md-8 col-lg-6">
        <div class="card p-4">
          <h5 class="fw-semibold mb-3">Upload de Documentos</h5>
          <FileUploader ref="uploader" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import FileUploader from '../components/common/FileUploader.vue';
</script> 