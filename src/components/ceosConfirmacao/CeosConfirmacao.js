import Swal from "sweetalert2";

const Confirmacao = {
    async SimNao(traducao, titulo, html) {
        const customSwal = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-outline-danger",
            },
            buttonsStyling: false,
        });

        return await customSwal.fire({
            title: titulo ?? traducao.$t("INSPECAO.COMMON.CONFIRMAR"),
            html: html ?? traducao.$t("INSPECAO.MENSAGEM.CONFIMACAO_CONFIRMAR"),
            icon: "warning",
            showCancelButton: true,
            cancelButtonText: traducao.$t("COMMONS.NO_TITLE"),
            confirmButtonText: traducao.$t("COMMONS.YES_TITLE"),
            reverseButtons: true
        });
    },
};

export default Confirmacao;
