export class Notification {
    constructor({
        evento_documento_id= null,
        documento_id = null,
        data_lembrete = null,
        observacoes = null,
    } = {}) {
        this.evento_documento_id = evento_documento_id;
        this.documento_id = documento_id;
        this.data_lembrete = data_lembrete;
        this.observacoes = observacoes;
    }
}
