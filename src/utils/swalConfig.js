import Swal from 'sweetalert2';

// Configuración global de SweetAlert2
export const swalConfig = {
  customClass: {
    popup: 'custom-swal-popup',
    title: 'custom-swal-title',
    htmlContainer: 'custom-swal-text',
    confirmButton: 'custom-swal-button',
    cancelButton: 'custom-swal-button',
    actions: 'custom-swal-actions',
    container: 'custom-swal-container'
  },
  buttonsStyling: false,
  confirmButtonColor: '#7D1522',
  background: '#FAFFFF',
  color: '#3D3D3D',
  fontFamily: '"Bai Jamjuree", sans-serif'
};

// Función para crear alertas con configuración consistente
export const createSwal = () => {
  return Swal.mixin(swalConfig);
};