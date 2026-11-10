import nodemailer from 'nodemailer';

/**
 * Servicio de notificaciones por correo electrónico usando Nodemailer.
 * Se configura mediante variables de entorno:
 *   SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS
 * Si no se detecta configuración SMTP, usa Ethereal Mail (entorno de pruebas).
 */
export class MailService {
    /**
     * Crea y retorna un transporter de Nodemailer.
     * Si no hay config SMTP en las variables de entorno, genera una cuenta
     * de pruebas con Ethereal y la muestra en consola.
     * @returns {Promise<nodemailer.Transporter>}
     */
    static async _crearTransporter() {
        // Verificar si se proporcionó configuración SMTP real
        if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
            return nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: Number(process.env.SMTP_PORT) === 465,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
        }

        // Fallback: cuenta de pruebas Ethereal (para desarrollo/testing)
        const cuentaPrueba = await nodemailer.createTestAccount();
        console.log('⚠️  [MailService] No se detectó config SMTP. Usando Ethereal Mail (modo prueba).');
        console.log(`   Usuario Ethereal: ${cuentaPrueba.user}`);
        console.log(`   Pass Ethereal:    ${cuentaPrueba.pass}`);

        return nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false,
            auth: {
                user: cuentaPrueba.user,
                pass: cuentaPrueba.pass,
            },
        });
    }

    /**
     * Envía una notificación de incidencia finalizada.
     * @param {Object} opts
     * @param {string} opts.destinatario - Email del usuario a notificar.
     * @param {Object} opts.incidencia   - Datos de la incidencia resuelta.
     */
    static async sendIncidenciaFinalizada({ destinatario, incidencia }) {
        if (!destinatario) {
            console.warn('[MailService] No se pudo enviar email: destinatario vacío.');
            return;
        }

        try {
            const transporter = await this._crearTransporter();

            const info = await transporter.sendMail({
                from: `"Sistema Integrador - Municipalidad" <${process.env.SMTP_USER || 'noreply@municipalidad.gob.ar'}>`,
                to: destinatario,
                subject: `✅ Incidencia #${incidencia.id_incidencia} Finalizada`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e8ed; border-radius: 8px; overflow: hidden;">
                        <div style="background-color: #2c3e50; color: white; padding: 20px 24px;">
                            <h2 style="margin: 0; font-size: 1.1rem;">Sistema de Gestión de Incidencias</h2>
                            <p style="margin: 4px 0 0; font-size: 0.85rem; opacity: 0.8;">Municipalidad - Dirección de Sistemas</p>
                        </div>
                        <div style="padding: 24px;">
                            <h3 style="color: #27ae60; margin-top: 0;">✅ Incidencia Finalizada</h3>
                            <p>La incidencia que usted registró ha sido <strong>resuelta satisfactoriamente</strong>.</p>
                            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 0.9rem;">
                                <tr style="background: #f8f9fa;">
                                    <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;"># Incidencia</td>
                                    <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${incidencia.id_incidencia ?? '-'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Artículo</td>
                                    <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${incidencia.articulo || incidencia.id_articulo || '-'}</td>
                                </tr>
                                <tr style="background: #f8f9fa;">
                                    <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Descripción</td>
                                    <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${incidencia.descripcion_pedido || '-'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Resolución</td>
                                    <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${incidencia.descripcion_resolucion || 'Sin descripción de resolución.'}</td>
                                </tr>
                                <tr style="background: #f8f9fa;">
                                    <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Fecha</td>
                                    <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${incidencia.creado ? new Date(incidencia.creado).toLocaleDateString('es-AR') : '-'}</td>
                                </tr>
                            </table>
                            <p style="color: #6c757d; font-size: 0.85rem;">Este mensaje es informativo. No responda a este correo.</p>
                        </div>
                        <div style="background: #f8f9fa; padding: 12px 24px; text-align: center; color: #6c757d; font-size: 0.8rem; border-top: 1px solid #e1e8ed;">
                            Sistema Integrador de Incidencias &mdash; Municipalidad
                        </div>
                    </div>
                `,
            });

            console.log(`[MailService] Email "Finalizada" enviado a ${destinatario}. ID: ${info.messageId}`);
            // En modo Ethereal, muestra el link de previsualización
            const previewUrl = nodemailer.getTestMessageUrl(info);
            if (previewUrl) console.log(`   Preview: ${previewUrl}`);
        } catch (error) {
            // No propagamos el error para que un fallo de email no rompa el flujo principal
            console.error('[MailService] Error al enviar email "Finalizada":', error.message);
        }
    }

    /**
     * Envía una notificación de incidencia cancelada.
     * @param {Object} opts
     * @param {string} opts.destinatario - Email del usuario a notificar.
     * @param {Object} opts.incidencia   - Datos de la incidencia cancelada.
     */
    static async sendIncidenciaCancelada({ destinatario, incidencia }) {
        if (!destinatario) {
            console.warn('[MailService] No se pudo enviar email: destinatario vacío.');
            return;
        }

        try {
            const transporter = await this._crearTransporter();

            const info = await transporter.sendMail({
                from: `"Sistema Integrador - Municipalidad" <${process.env.SMTP_USER || 'noreply@municipalidad.gob.ar'}>`,
                to: destinatario,
                subject: `❌ Incidencia #${incidencia.id_incidencia} Cancelada`,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e8ed; border-radius: 8px; overflow: hidden;">
                        <div style="background-color: #2c3e50; color: white; padding: 20px 24px;">
                            <h2 style="margin: 0; font-size: 1.1rem;">Sistema de Gestión de Incidencias</h2>
                            <p style="margin: 4px 0 0; font-size: 0.85rem; opacity: 0.8;">Municipalidad - Dirección de Sistemas</p>
                        </div>
                        <div style="padding: 24px;">
                            <h3 style="color: #dc3545; margin-top: 0;">❌ Incidencia Cancelada</h3>
                            <p>Le informamos que la siguiente incidencia ha sido <strong>cancelada</strong>.</p>
                            <table style="width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 0.9rem;">
                                <tr style="background: #f8f9fa;">
                                    <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;"># Incidencia</td>
                                    <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${incidencia.id_incidencia ?? '-'}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Artículo</td>
                                    <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${incidencia.articulo || incidencia.id_articulo || '-'}</td>
                                </tr>
                                <tr style="background: #f8f9fa;">
                                    <td style="padding: 8px 12px; font-weight: bold; border: 1px solid #dee2e6;">Descripción</td>
                                    <td style="padding: 8px 12px; border: 1px solid #dee2e6;">${incidencia.descripcion_pedido || '-'}</td>
                                </tr>
                            </table>
                            <p>Si tiene consultas, contáctese con la Dirección de Sistemas.</p>
                            <p style="color: #6c757d; font-size: 0.85rem;">Este mensaje es informativo. No responda a este correo.</p>
                        </div>
                        <div style="background: #f8f9fa; padding: 12px 24px; text-align: center; color: #6c757d; font-size: 0.8rem; border-top: 1px solid #e1e8ed;">
                            Sistema Integrador de Incidencias &mdash; Municipalidad
                        </div>
                    </div>
                `,
            });

            console.log(`[MailService] Email "Cancelada" enviado a ${destinatario}. ID: ${info.messageId}`);
            const previewUrl = nodemailer.getTestMessageUrl(info);
            if (previewUrl) console.log(`   Preview: ${previewUrl}`);
        } catch (error) {
            console.error('[MailService] Error al enviar email "Cancelada":', error.message);
        }
    }
}

