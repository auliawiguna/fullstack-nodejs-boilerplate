import Swal from 'sweetalert2'

export const backDialog = async (router, url) => {
    Swal.fire({
        title: 'Caution',
        text: "Cancel changes and back to list page?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Proceed'
    }).then(async (result) => {
        if (result.isConfirmed) {
            return router.push(url)
        }
    })
}
