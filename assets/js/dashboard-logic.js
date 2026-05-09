/**
 * Lógica para el Panel de Control (Dashboard)
 * 
 * Este script maneja:
 * 1. Sincronización: Lee datos de localStorage guardados por la Billetera.
 * 2. Visualización: Genera un gráfico donut SVG y una lista de desglose.
 * 3. Filtrado: Permite ver gastos por mes seleccionado.
 * 4. Reportes: Funcionalidad de impresión a PDF.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- Configuración de Categorías ---
    const CONFIG_CATEGORIAS = {
        food: { nombre: 'Alimentación', icono: 'restaurant', color: 'text-primary' },
        education: { nombre: 'Educación', icono: 'school', color: 'text-secondary' },
        entertainment: { nombre: 'Entretenimiento', icono: 'movie', color: 'text-tertiary-container' },
        savings: { nombre: 'Ahorro', icono: 'savings', color: 'text-outline' },
        otros: { nombre: 'Otros', icono: 'more_horiz', color: 'text-outline-variant' }
    };

    // --- Elementos de la Interfaz ---
    const displayTotal = document.getElementById('total-expenses-display');
    const displayTopCategoria = document.getElementById('top-category-display');
    const selectorMes = document.getElementById('month-selector');
    const donutChart = document.getElementById('donut-chart');
    const listaCategorias = document.getElementById('category-list');
    const btnPrintPdf = document.getElementById('print-pdf-btn');

    // --- Estado ---
    let gastos = JSON.parse(localStorage.getItem('listaGastos')) || [];
    
    // Inicializar el selector de mes con el mes actual
    const hoy = new Date();
    const mesActual = `${hoy.getFullYear()}-${String(hoy.getMonth() + 1).padStart(2, '0')}`;
    selectorMes.value = mesActual;

    // --- Funciones de Utilidad ---
    const formatearMoneda = (valor) => new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(valor);

    function actualizarDashboard() {
        const mesSeleccionado = selectorMes.value;
        
        // Filtrar gastos por mes
        const gastosFiltrados = gastos.filter(g => {
            const fechaGasto = new Date(g.fecha);
            const mesGasto = `${fechaGasto.getFullYear()}-${String(fechaGasto.getMonth() + 1).padStart(2, '0')}`;
            return mesGasto === mesSeleccionado;
        });

        // Agrupar por categoría
        const resumen = {};
        let totalGeneral = 0;

        gastosFiltrados.forEach(g => {
            const cat = g.categoria || 'otros';
            resumen[cat] = (resumen[cat] || 0) + g.monto;
            totalGeneral += g.monto;
        });

        // Actualizar UI
        displayTotal.textContent = formatearMoneda(totalGeneral);
        renderizarGrafico(resumen, totalGeneral);
        renderizarLista(resumen, totalGeneral);
    }

    function renderizarGrafico(resumen, total) {
        // Limpiar segmentos previos (mantener el fondo)
        const fondo = donutChart.querySelector('path.text-surface-container');
        donutChart.innerHTML = '';
        donutChart.appendChild(fondo);

        if (total === 0) {
            displayTopCategoria.textContent = 'Sin datos';
            return;
        }

        let offset = 0;
        let mayorGasto = { cat: '', monto: 0 };

        Object.entries(resumen).forEach(([cat, monto]) => {
            if (monto > mayorGasto.monto) {
                mayorGasto = { cat, monto };
            }

            const porcentaje = (monto / total) * 100;
            const config = CONFIG_CATEGORIAS[cat] || CONFIG_CATEGORIAS.otros;
            
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('class', config.color);
            path.setAttribute('d', 'M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831');
            path.setAttribute('fill', 'none');
            path.setAttribute('stroke', 'currentColor');
            path.setAttribute('stroke-width', '4');
            path.setAttribute('stroke-dasharray', `${porcentaje}, 100`);
            path.setAttribute('stroke-dashoffset', `-${offset}`);
            path.setAttribute('stroke-linecap', 'round');
            
            donutChart.appendChild(path);
            offset += porcentaje;
        });

        const topCatConfig = CONFIG_CATEGORIAS[mayorGasto.cat] || CONFIG_CATEGORIAS.otros;
        displayTopCategoria.textContent = topCatConfig.nombre;
    }

    function renderizarLista(resumen, total) {
        listaCategorias.innerHTML = '';

        if (total === 0) {
            listaCategorias.innerHTML = '<p class="text-center text-outline py-8">No hay gastos registrados en este mes.</p>';
            return;
        }

        // Ordenar por monto (mayor a menor)
        const categoriasOrdenadas = Object.entries(resumen).sort((a, b) => b[1] - a[1]);

        categoriasOrdenadas.forEach(([cat, monto]) => {
            const porcentaje = (monto / total) * 100;
            const config = CONFIG_CATEGORIAS[cat] || CONFIG_CATEGORIAS.otros;
            const colorBarra = config.color.replace('text-', 'bg-');

            const item = document.createElement('div');
            item.className = 'flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container-low transition-colors group';
            item.innerHTML = `
                <div class="size-12 rounded-full bg-surface-container flex items-center justify-center ${config.color}">
                    <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1">${config.icono}</span>
                </div>
                <div class="flex-1">
                    <div class="flex justify-between items-center mb-1">
                        <p class="text-body-lg font-bold text-on-background">${config.nombre}</p>
                        <p class="text-body-sm font-bold text-on-background">${formatearMoneda(monto)}</p>
                    </div>
                    <div class="w-full h-2 bg-surface-container rounded-full overflow-hidden">
                        <div class="h-full ${colorBarra} rounded-full" style="width: ${porcentaje}%"></div>
                    </div>
                    <p class="text-label-caps text-outline mt-1">${Math.round(porcentaje)}% DEL TOTAL</p>
                </div>
            `;
            listaCategorias.appendChild(item);
        });
    }

    // --- Eventos ---
    selectorMes.addEventListener('change', actualizarDashboard);
    
    // Optimización para abrir el selector en todos los navegadores
    const selectorContainer = selectorMes.parentElement;
    selectorContainer.addEventListener('click', () => {
        try {
            if (selectorMes.showPicker) selectorMes.showPicker();
        } catch (e) {
            console.log('showPicker no soportado');
        }
    });
    
    btnPrintPdf.addEventListener('click', () => {
        window.print();
    });

    // --- Inicialización ---
    actualizarDashboard();
});