import ApiService from "../api.service";

const DocumentsService = {
    slug: "lembretes",
    async create(form) {
        return await ApiService.post(`/${this.slug}`, form);
    },
    async delete(id) {
        return await ApiService.delete(`/${this.slug}/${id}`);
    },
    async update(id, form) {
        return await ApiService.put(`/${this.slug}/${id}`, form);
    },
    async list(filtros, pagina, tamanho_pagina) {
        return await ApiService.post(`/${this.slug}/listar`, { ...filtros, pagina, tamanho_pagina });
    },
    
};

export default DocumentsService;
//https://ceos-api.duckdns.org/documento/documentos?dataDe=2025-07-01&dataAte=2025-07-18&resumo=relatorio&palavraChave=importacao&page=1&perPage=10
