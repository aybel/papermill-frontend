import Swal from 'sweetalert2';

// Muestra SweetAlert por encima de diálogos (usa clases para elevar z-index)
export function showSwal(options: Record<string, any>) {
    return Swal.fire({
        target: document.body,
        customClass: { popup: 'swal-front', container: 'swal-front-container' },
        ...options,
    });
}
