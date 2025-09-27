<script setup>
import Swal from 'sweetalert2';
import { defineExpose } from 'vue';

const props = defineProps({
  title: { type: String, default: 'Confirmação' },
  message: { type: String, default: 'Tem certeza que deseja continuar?' },
  icon: { type: String, default: 'warning' },
  confirmText: { type: String, default: 'Sim' },
  cancelText: { type: String, default: 'Não' },
  confirmButtonClass: { type: String, default: 'btn btn-success' },
  cancelButtonClass: { type: String, default: 'btn btn-outline-danger' },
});

const emit = defineEmits(['confirm', 'cancel']);

async function open({
  title = props.title,
  message = props.message,
  icon = props.icon,
  confirmText = props.confirmText,
  cancelText = props.cancelText,
  confirmButtonClass = props.confirmButtonClass,
  cancelButtonClass = props.cancelButtonClass,
} = {}) {
  const customSwal = Swal.mixin({
    customClass: {
      confirmButton: confirmButtonClass,
      cancelButton: cancelButtonClass,
    },
    buttonsStyling: false,
  });

  const result = await customSwal.fire({
    title,
    html: message,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    reverseButtons: true,
  });

  if (result.isConfirmed) emit('confirm');
  else emit('cancel');
  return result.isConfirmed;
}

defineExpose({ open });
</script> 