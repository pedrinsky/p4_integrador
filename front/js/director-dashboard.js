import { badgesEstado, badgesPrioridad, insertarBadge } from './utils/ui-utils.js';

document.addEventListener('DOMContentLoaded', () => {
    cargarDashboard();
    inicializarBtnPDF();
});

async function cargarDashboard() {
    const token = sessionStorage.getItem('token');
    const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

    try {
        const respuesta = await fetch('http://localhost:3000/api/incidencias/dashboard/metrics', { headers });
        if (!respuesta.ok) {
            console.error('Error al obtener métricas del dashboard:', respuesta.status);
            return;
        }

        const data = await respuesta.json();
        const { totales = {}, prioritarias = [], porFecha = [] } = data;

        // 1. Contadores según estado
        const elTotal = document.getElementById('count-total');
        const elPendientes = document.getElementById('count-pendientes');
        const elAsignadas = document.getElementById('count-asignadas');
        const elFinalizadas = document.getElementById('count-finalizadas');
        const elCanceladas = document.getElementById('count-canceladas');

        if (elTotal) elTotal.textContent = totales.total ?? 0;
        if (elPendientes) elPendientes.textContent = totales.pendientes ?? 0;
        if (elAsignadas) elAsignadas.textContent = totales.asignadas ?? 0;
        if (elFinalizadas) elFinalizadas.textContent = totales.finalizadas ?? 0;
        if (elCanceladas) elCanceladas.textContent = totales.canceladas ?? 0;

        // 2. Renderizar Incidencias Prioritarias
        renderizarPrioritarias(prioritarias);

        // 3. Renderizar Totales por Fecha
        renderizarPorFecha(porFecha);

    } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
    }
}

function renderizarPrioritarias(lista) {
    const tbody = document.getElementById('tabla-prioritarias');
    if (!tbody) return;
    tbody.textContent = '';

    if (!Array.isArray(lista) || lista.length === 0) {
        const row = document.createElement('tr');
        const tdVacio = document.createElement('td');
        tdVacio.colSpan = 8;
        tdVacio.style.textAlign = 'center';
        tdVacio.style.padding = '18px';
        tdVacio.style.color = '#28a745';
        tdVacio.textContent = 'No hay incidencias prioritarias pendientes en este momento.';
        row.appendChild(tdVacio);
        tbody.appendChild(row);
        return;
    }

    for (let inc of lista) {
        const row = document.createElement('tr');
        const idInc = inc.id_incidencia ?? inc.id;

        // # ID
        const tdId = document.createElement('td');
        tdId.textContent = idInc;
        tdId.style.fontWeight = 'bold';
        row.appendChild(tdId);

        // Artículo
        const tdArticulo = document.createElement('td');
        tdArticulo.textContent = inc.articulo || (inc.id_articulo ? `ID ${inc.id_articulo}` : '-');
        tdArticulo.className = 'text-truncate';
        tdArticulo.style.maxWidth = '160px';
        row.appendChild(tdArticulo);

        // Solicitante (creado_por)
        const tdCreador = document.createElement('td');
        tdCreador.textContent = inc.creado_por || '-';
        row.appendChild(tdCreador);

        // Fecha
        const tdFecha = document.createElement('td');
        tdFecha.textContent = inc.creado ? new Date(inc.creado).toLocaleDateString() : '-';
        row.appendChild(tdFecha);

        // Descripción
        const tdDesc = document.createElement('td');
        tdDesc.textContent = inc.descripcion_pedido || '-';
        tdDesc.className = 'text-truncate';
        tdDesc.style.maxWidth = '220px';
        row.appendChild(tdDesc);

        // Prioridad
        const tdPrioridad = document.createElement('td');
        insertarBadge(tdPrioridad, badgesPrioridad[inc.prioridad] ? badgesPrioridad[inc.prioridad]() : inc.prioridad);
        row.appendChild(tdPrioridad);

        // Estado
        const tdEstado = document.createElement('td');
        const estKey = inc.id_estado ?? inc.estado;
        insertarBadge(tdEstado, badgesEstado[estKey] ? badgesEstado[estKey]() : estKey);
        row.appendChild(tdEstado);

        // Acción
        const tdAccion = document.createElement('td');
        const btnVer = document.createElement('a');
        btnVer.href = `director-sistemas-incidencias.html?resaltar=${encodeURIComponent(idInc)}`;
        btnVer.textContent = 'Gestionar';
        btnVer.className = 'btn-buscar';
        btnVer.style.padding = '4px 10px';
        btnVer.style.fontSize = '0.85rem';
        btnVer.style.textDecoration = 'none';
        btnVer.style.display = 'inline-block';
        tdAccion.appendChild(btnVer);
        row.appendChild(tdAccion);

        tbody.appendChild(row);
    }
}

// --- Fase 3: Botón de descarga de Reporte PDF ---
function inicializarBtnPDF() {
    const btnPDF = document.getElementById('btn-descargar-pdf');
    if (!btnPDF) return;

    btnPDF.addEventListener('click', async () => {
        const token = sessionStorage.getItem('token');
        const textoOriginal = btnPDF.innerHTML;
        try {
            btnPDF.innerHTML = '⏳ Generando...';
            btnPDF.disabled = true;

            const respuesta = await fetch('http://localhost:3000/api/incidencias/reporte/pdf', {
                headers: token ? { 'Authorization': `Bearer ${token}` } : {}
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json().catch(() => ({}));
                throw new Error(errorData.error || `Error ${respuesta.status} al generar el PDF`);
            }

            const blob = await respuesta.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'reporte-incidencias.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Error al descargar PDF:', e);
            alert(`No se pudo generar el reporte PDF.\n${e.message}`);
        } finally {
            btnPDF.innerHTML = textoOriginal;
            btnPDF.disabled = false;
        }
    });
}

function renderizarPorFecha(lista) {
    const contenedor = document.getElementById('contenedor-fechas');
    if (!contenedor) return;
    contenedor.textContent = '';

    if (!Array.isArray(lista) || lista.length === 0) {
        const spanVacio = document.createElement('span');
        spanVacio.className = 'muted';
        spanVacio.textContent = 'No hay registros recientes por fecha.';
        contenedor.appendChild(spanVacio);
        return;
    }

    lista.forEach(item => {
        const card = document.createElement('div');
        card.style.background = '#ffffff';
        card.style.border = '1px solid #e1e8ed';
        card.style.borderRadius = '8px';
        card.style.padding = '12px 18px';
        card.style.minWidth = '130px';
        card.style.textAlign = 'center';
        card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)';

        const spanFecha = document.createElement('div');
        spanFecha.style.fontSize = '0.85rem';
        spanFecha.style.color = '#6c757d';
        spanFecha.textContent = item.fecha || 'Sin fecha';

        const spanTotal = document.createElement('div');
        spanTotal.style.fontSize = '1.4rem';
        spanTotal.style.fontWeight = 'bold';
        spanTotal.style.color = '#2c3e50';
        spanTotal.textContent = `${item.total} inc.`;

        card.appendChild(spanFecha);
        card.appendChild(spanTotal);
        contenedor.appendChild(card);
    });
}

