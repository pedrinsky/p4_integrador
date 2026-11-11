import PDFDocument from 'pdfkit';

export class PdfService {
    /**
     * Genera un reporte PDF profesional con el resumen y listado de incidencias.
     * @param {Object} data - Datos con métricas y lista de incidencias.
     * @param {Object} data.totales - Totales por estado.
     * @param {Array} data.incidencias - Listado de incidencias.
     * @param {Object} data.usuario - Datos del usuario que emite el reporte.
     * @param {NodeJS.WritableStream} res - Stream de respuesta HTTP de Express.
     */
    static generarReporteIncidencias({ totales = {}, incidencias = [], usuario = {} }, res) {
        const doc = new PDFDocument({ margin: 40, size: 'A4' });

        // Pipe al response HTTP
        doc.pipe(res);

        // --- ENCABEZADO INSTITUCIONAL ---
        doc.rect(40, 40, 515, 60).fill('#2c3e50');

        doc.fillColor('#ffffff')
           .fontSize(16)
           .font('Helvetica-Bold')
           .text('MUNICIPALIDAD - SISTEMA DE GESTIÓN DE INCIDENCIAS', 55, 52, { align: 'left' });

        doc.fontSize(10)
           .font('Helvetica')
           .text('Dirección de Sistemas e Infraestructura Tecnológica', 55, 73);

        const fechaHoy = new Date().toLocaleDateString('es-AR', {
            year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });

        doc.fontSize(8)
           .text(`Emitido el: ${fechaHoy}`, 400, 75, { align: 'right' });

        doc.moveDown(3);

        // --- TÍTULO DEL REPORTE ---
        const startY = 115;
        doc.fillColor('#1a252f')
           .fontSize(14)
           .font('Helvetica-Bold')
           .text('INFORME ESTADÍSTICO Y LISTADO GENERAL DE INCIDENCIAS', 40, startY, { align: 'center' });

        doc.moveDown(0.8);

        // --- RESUMEN EJECUTIVO (TARJETAS/TABLA DE TOTALES) ---
        const total = totales.total ?? incidencias.length;
        const pendientes = totales.pendientes ?? 0;
        const asignadas = totales.asignadas ?? 0;
        const finalizadas = totales.finalizadas ?? 0;
        const canceladas = totales.canceladas ?? 0;

        const metricsY = doc.y;
        doc.rect(40, metricsY, 515, 45).fill('#f8f9fa');
        doc.rect(40, metricsY, 515, 45).stroke('#dcdfe6');

        doc.fillColor('#2c3e50').fontSize(9).font('Helvetica-Bold');
        doc.text('RESUMEN DE ESTADOS:', 50, metricsY + 8);

        doc.font('Helvetica').fontSize(9);
        doc.text(`Total: ${total}`, 50, metricsY + 24);
        doc.text(`Pendientes: ${pendientes}`, 140, metricsY + 24);
        doc.text(`En Proceso: ${asignadas}`, 240, metricsY + 24);
        doc.text(`Resueltas: ${finalizadas}`, 350, metricsY + 24);
        doc.text(`Canceladas: ${canceladas}`, 450, metricsY + 24);

        doc.y = metricsY + 55;
        doc.moveDown(0.5);

        // --- TABLA DE INCIDENCIAS ---
        doc.fillColor('#2c3e50')
           .fontSize(11)
           .font('Helvetica-Bold')
           .text('Detalle de Incidencias Registradas', 40, doc.y);

        doc.moveDown(0.4);

        // Cabecera de la tabla
        const tableTop = doc.y;
        doc.rect(40, tableTop, 515, 20).fill('#34495e');

        doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
        doc.text('# ID', 45, tableTop + 6);
        doc.text('Artículo', 75, tableTop + 6);
        doc.text('Solicitante', 170, tableTop + 6);
        doc.text('Asignado a', 255, tableTop + 6);
        doc.text('Fecha', 335, tableTop + 6);
        doc.text('Prioridad', 385, tableTop + 6);
        doc.text('Estado', 435, tableTop + 6);

        let currentY = tableTop + 20;

        // Filas de incidencias
        incidencias.slice(0, 30).forEach((inc, index) => {
            // Manejo de salto de página si excede el límite
            if (currentY > 740) {
                doc.addPage({ margin: 40, size: 'A4' });
                currentY = 50;

                // Repetir cabecera en nueva página
                doc.rect(40, currentY, 515, 20).fill('#34495e');
                doc.fillColor('#ffffff').fontSize(8).font('Helvetica-Bold');
                doc.text('# ID', 45, currentY + 6);
                doc.text('Artículo', 75, currentY + 6);
                doc.text('Solicitante', 170, currentY + 6);
                doc.text('Asignado a', 255, currentY + 6);
                doc.text('Fecha', 335, currentY + 6);
                doc.text('Prioridad', 385, currentY + 6);
                doc.text('Estado', 435, currentY + 6);
                currentY += 20;
            }

            const rowColor = index % 2 === 0 ? '#ffffff' : '#f8f9fa';
            doc.rect(40, currentY, 515, 18).fill(rowColor);
            doc.rect(40, currentY, 515, 18).stroke('#e9ecef');

            doc.fillColor('#212529').fontSize(7.5).font('Helvetica');

            const id = String(inc.id_incidencia ?? inc.id ?? '-');
            const articulo = (inc.articulo || inc.articulo_descripcion || (inc.id_articulo ? `ID ${inc.id_articulo}` : 'General')).substring(0, 18);
            const creador = String(inc.creado_por || '-').substring(0, 16);
            const asignado = String(inc.asignado_a || 'Sin asignar').substring(0, 16);
            const fecha = inc.creado ? new Date(inc.creado).toLocaleDateString('es-AR') : '-';
            
            const prioMap = { 1: 'Baja', 2: 'Media', 3: 'Alta' };
            const prioridad = prioMap[inc.prioridad] || String(inc.prioridad ?? '-');
            
            // Mapeo robusto de estado (corrige 'Resuela' o typos de BD a 'Resuelta')
            let estado = 'Pendiente';
            const idEstadoNum = Number(inc.id_estado);
            if (idEstadoNum === 1) estado = 'Pendiente';
            else if (idEstadoNum === 2) estado = 'En Proceso';
            else if (idEstadoNum === 3) estado = 'Resuelta';
            else if (idEstadoNum === 4) estado = 'Cancelada';
            else {
                const estTexto = String(inc.estado || '').toLowerCase().trim();
                if (estTexto.includes('pend')) estado = 'Pendiente';
                else if (estTexto.includes('proc') || estTexto.includes('asig')) estado = 'En Proceso';
                else if (estTexto.includes('resuel') || estTexto.includes('resuela') || estTexto.includes('finaliz')) estado = 'Resuelta';
                else if (estTexto.includes('canc')) estado = 'Cancelada';
                else estado = inc.estado || '-';
            }

            doc.text(id, 45, currentY + 5);
            doc.text(articulo, 75, currentY + 5);
            doc.text(creador, 170, currentY + 5);
            doc.text(asignado, 255, currentY + 5);
            doc.text(fecha, 335, currentY + 5);
            doc.text(prioridad, 385, currentY + 5);
            doc.text(estado, 435, currentY + 5);

            currentY += 18;
        });

        // Finalizar el documento
        doc.end();
    }
}

