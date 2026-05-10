/**
 * Lógica para la Gestión de Presupuesto y Gastos
 * 
 * Este script maneja:
 * 1. Persistencia: Uso de localStorage para guardar presupuesto y gastos.
 * 2. Validación: No permite gastos que excedan el presupuesto disponible.
 * 3. Edición: Permite modificar gastos existentes y recalcula el presupuesto.
 * 4. IDs Únicos: Cada gasto y cada sesión de presupuesto tienen un identificador único.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos de la Interfaz ---
    const inputPresupuesto = document.getElementById('budget-input');
    const btnActualizarPresupuesto = document.getElementById('update-budget-btn');
    
    const displayUsado = document.getElementById('used-amount-display');
    const displayTotal = document.getElementById('total-budget-display');
    const displayPorcentaje = document.getElementById('budget-percentage-display');
    const barraProgreso = document.getElementById('budget-progress-bar');
    const mensajeEstado = document.getElementById('budget-status-message');
    const displayRestante = document.getElementById('remaining-amount-display');
    
    const selectCategoria = document.getElementById('expense-category');
    const inputMontoGasto = document.getElementById('expense-amount');
    const btnAccionGasto = document.getElementById('add-expense-btn');
    const tablaGastos = document.getElementById('expenses-table-body');
    const displayNombreUsuario = document.getElementById('user-name-display');
    const btnPrintPdf = document.getElementById('print-pdf-btn');

    // --- Estado de la Aplicación ---
    let estado = {
        nombre: localStorage.getItem('nombreUsuario') || 'Mateo',
        presupuesto: parseFloat(localStorage.getItem('presupuestoMensual')) || 0,
        gastos: JSON.parse(localStorage.getItem('listaGastos')) || [],
        idSesion: localStorage.getItem('idSesionPresupuesto') || `sesion-${Date.now()}`,
        indiceEdicion: null
    };

    // Guardar ID de sesión si es nuevo
    if (!localStorage.getItem('idSesionPresupuesto')) {
        localStorage.setItem('idSesionPresupuesto', estado.idSesion);
    }

    // --- Funciones de Utilidad ---
    // Formatea números a moneda Soles (PEN)
    const formatearMoneda = (valor) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(valor);
    
    // Genera un ID aleatorio para cada gasto
    const generarId = () => Math.random().toString(36).substring(2, 11);

    // Guarda los datos en el navegador y actualiza la vista
    function guardarYRefrescar() {
        localStorage.setItem('presupuestoMensual', estado.presupuesto);
        localStorage.setItem('listaGastos', JSON.stringify(estado.gastos));
        actualizarUI();
    }

    // --- Lógica de Interfaz ---
    function actualizarUI() {
        // Mostrar nombre de usuario
        if (displayNombreUsuario) {
            displayNombreUsuario.textContent = estado.nombre;
        }

        const totalGastado = estado.gastos.reduce((acc, g) => acc + g.monto, 0);
        const restante = estado.presupuesto - totalGastado;
        const porcentaje = estado.presupuesto > 0 ? Math.min((totalGastado / estado.presupuesto) * 100, 100) : 0;

        // Actualizar textos en pantalla
        displayUsado.textContent = formatearMoneda(totalGastado);
        displayTotal.textContent = formatearMoneda(estado.presupuesto);
        displayPorcentaje.textContent = `${Math.round(porcentaje)}%`;
        barraProgreso.style.width = `${porcentaje}%`;
        displayRestante.textContent = `${formatearMoneda(restante)} restantes`;

        // Lógica visual del semáforo (colores y mensajes)
        if (estado.presupuesto === 0) {
            mensajeEstado.textContent = 'Configura tu presupuesto para empezar';
            mensajeEstado.className = 'text-body-sm text-on-surface-variant';
        } else if (restante < 0) {
            mensajeEstado.textContent = '¡Presupuesto excedido!';
            mensajeEstado.className = 'text-body-sm text-error font-bold';
            barraProgreso.classList.add('bg-error');
        } else {
            mensajeEstado.textContent = porcentaje > 90 ? 'Límite casi alcanzado' : 'Vas por buen camino';
            mensajeEstado.className = porcentaje > 90 ? 'text-body-sm text-tertiary font-bold' : 'text-body-sm text-on-surface-variant';
            barraProgreso.classList.remove('bg-error');
        }

        dibujarTabla();
    }

    // --- Configuración de Categorías ---
    const NOMBRES_CATEGORIAS = {
        food: 'Comida',
        education: 'Educación',
        entertainment: 'Entretenimiento',
        savings: 'Ahorro'
    };

    // Renderiza las filas de la tabla de gastos
    function dibujarTabla() {
        tablaGastos.innerHTML = estado.gastos.map((gasto, index) => `
            <tr class="soft-transition hover:bg-surface-container-low/50">
                <td class="py-4 text-sm font-medium text-on-surface capitalize">${NOMBRES_CATEGORIAS[gasto.categoria] || gasto.categoria}</td>
                <td class="py-4 text-sm font-bold text-on-surface">${formatearMoneda(gasto.monto)}</td>
                <td class="py-4 text-right">
                    <div class="flex justify-end gap-2">
                        <button onclick="editarGasto(${index})" class="p-2 text-outline hover:text-primary" title="Editar">
                            <span class="material-symbols-outlined text-lg">edit</span>
                        </button>
                        <button onclick="eliminarGasto(${index})" class="p-2 text-outline hover:text-error" title="Eliminar">
                            <span class="material-symbols-outlined text-lg">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // --- Acciones de Usuario ---
    // Elimina un gasto de la lista
    window.eliminarGasto = (index) => {
        estado.gastos.splice(index, 1);
        limpiarFormulario();
        guardarYRefrescar();
    };

    // Carga un gasto en el formulario para editarlo
    window.editarGasto = (index) => {
        const gasto = estado.gastos[index];
        selectCategoria.value = gasto.categoria;
        inputMontoGasto.value = gasto.monto;
        estado.indiceEdicion = index;
        
        btnAccionGasto.textContent = 'Guardar Cambios';
        btnAccionGasto.classList.replace('bg-primary', 'bg-secondary');
    };

    // Resetea el formulario a su estado original
    function limpiarFormulario() {
        selectCategoria.value = '';
        inputMontoGasto.value = '';
        btnAccionGasto.textContent = 'Agregar Gasto';
        btnAccionGasto.classList.replace('bg-secondary', 'bg-primary');
        estado.indiceEdicion = null;
    }

    // --- Eventos ---
    // Actualizar el presupuesto total
    btnActualizarPresupuesto.addEventListener('click', () => {
        const valor = parseFloat(inputPresupuesto.value);
        if (!isNaN(valor) && valor >= 0) {
            estado.presupuesto = valor;
            inputPresupuesto.value = '';
            guardarYRefrescar();
        }
    });

    // Guardar (nuevo o editado) un gasto
    btnAccionGasto.addEventListener('click', () => {
        const categoria = selectCategoria.value;
        const monto = parseFloat(inputMontoGasto.value);
        
        // Validación: Obtener suma de otros gastos para no exceder presupuesto
        const otrosGastos = estado.gastos.reduce((acc, g, i) => i === estado.indiceEdicion ? acc : acc + g.monto, 0);
        
        if (!categoria || isNaN(monto) || monto <= 0) return alert('Por favor, ingresa datos válidos.');
        if (monto + otrosGastos > estado.presupuesto) return alert('¡Error! El gasto supera tu presupuesto disponible.');

        if (estado.indiceEdicion !== null) {
            // Caso: Editando un gasto existente
            estado.gastos[estado.indiceEdicion] = { 
                ...estado.gastos[estado.indiceEdicion], 
                categoria, 
                monto 
            };
        } else {
            // Caso: Agregando un nuevo gasto
            estado.gastos.push({ 
                id: generarId(), 
                idSesion: estado.idSesion, 
                categoria, 
                monto, 
                fecha: new Date().toISOString() 
            });
        }

        limpiarFormulario();
        guardarYRefrescar();
    });

    if (btnPrintPdf) {
        btnPrintPdf.addEventListener('click', () => {
            window.print();
        });
    }

    // Inicializar la vista
    actualizarUI();
});