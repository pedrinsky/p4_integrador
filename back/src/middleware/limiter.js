import rateLimit from 'express-rate-limit';

//limite para que un bot no baje la pagina al hacer miles de solicitudes por seg
export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, //ventana de 15 minutos
    max: 100,                  //máximo 100 requests por IP en esa ventana
    message: { error: 'Demasiadas solicitudes, intente más tarde.' }
});