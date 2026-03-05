import Swal from 'sweetalert2';

// Muestra SweetAlert por encima de diálogos (usa clases para elevar z-index)
export function showSwal(options: Record<string, any>) {
    return Swal.fire({
        target: document.body,
        customClass: { popup: 'swal-front', container: 'swal-front-container' },
        ...options,
    });
}

// Confirmación estándar reutilizable
export function confirmSwal({
    title = '¿Estás seguro?',
    text = 'Esta acción no se puede deshacer.',
    icon = 'warning',
    confirmButtonText = 'Sí, continuar',
    cancelButtonText = 'Cancelar',
    confirmButtonColor = '#ea8000',
    cancelButtonColor = '#6c757d',
    ...rest
} = {}) {
    return showSwal({
        title,
        text,
        icon,
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText,
        confirmButtonColor,
        cancelButtonColor,
        ...rest,
    });
}
