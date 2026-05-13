// Logic for Welcome Page (Bienvenida)
document.addEventListener('DOMContentLoaded', () => {
    const inputNombre = document.getElementById('nombre-usuario');
    const btnContinuar = document.getElementById('btn-continuar');

    btnContinuar.addEventListener('click', () => {
        const nombre = inputNombre.value.trim();
        
        if (nombre === '') {
             Swal.fire({
                title: 'Oops 👀',
                text: 'Entra tu nombre parra continuar',
                icon: 'warning',
                confirmButtonText: 'Ok'
            });

            return;

        }

        // Save name to localStorage
        localStorage.setItem('nombreUsuario', nombre);
        
        // Redirect to Billetera
        window.location.href = 'billetera.html';
    });

    // Also allow pressing "Enter" to continue
    inputNombre.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnContinuar.click();
        }
    });
});