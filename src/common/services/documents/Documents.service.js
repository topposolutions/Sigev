import ApiService from "../api.service";

const DocumentsService = {
  slug: "documento/documentos",
  async list(filtros, pagina, tamanho_pagina) {
    return await ApiService.post(`/${this.slug}/listar`, { ...filtros, pagina, tamanho_pagina });
  },

  // Método para buscar sub-detalhes de um evento específico
  async getSubDetails(eventoId) {
    return await ApiService.get(`/${this.slug}/evento/${eventoId}/sub-detalhes`);
  },

  // Método alternativo se você quiser buscar todos os sub-detalhes de um documento
  async getDocumentSubDetails(documentoId) {
    return await ApiService.get(`/${this.slug}/${documentoId}/sub-detalhes`);
  },

  async uploadAttachments(files, roles_acesso = "admin") {
    let formData = new FormData();

    files.forEach((fileObj) => {
      formData.append("documentos", fileObj.file);
    });
    // Adicionar roles de acesso
    formData.append("roles_acesso", roles_acesso);

    let config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    let data = await ApiService.post(
      `/documento/upload-documento`,
      formData,
      config
    );
    return data;
  }
};

export default DocumentsService;
//https://ceos-api.duckdns.org/documento/documentos?dataDe=2025-07-01&dataAte=2025-07-18&resumo=relatorio&palavraChave=importacao&page=1&perPage=10
