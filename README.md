# p4_integrador

## Arquitectura por Capas

El proyecto está dividido en dos partes: el back y el fron.

El back esta diseñado con una arquitectura de capas para separar responsabilidades, facilitar la mantenibilidad y la escalabilidad:

1.  **Capa de Rutas (`back/src/routes/`)**:
    Define los endpoints expuestos por la API y los redirige al controlador correspondiente.
2.  **Capa de esquemas  ('back/src/schemas')**:
    Ocupa el paquete zod para controlar los valores de los objetos entrantes (como cuerpos de solicitud). 
3.  **Capa de middlewares  ('back/src/middleware')**:
    En la que se encuentran controles de entradas. 
4.  **Capa de Controladores (`back/src/controller/`)**:
    Se encarga de procesar las peticiones HTTP. Aquí se captura los datos entrantes y se llama a la capa de Servicios. Por último, maneja los códigos de estado HTTP de respuesta.
5.  **Capa de Servicios (`back/src/services/`)**:
    Contiene la lógica de negocio. Es responsable de orquestar operaciones complejas, transformar/completar datos.
6.  **Capa de Repositorios (`back/src/repository/`)**:
    Comunicación directa con PostgreSQL.
7.  **Capa DTO (Data Transfer Object) (`back/src/dto/`)**:
    Devuelvo respuestas formateadas para ocultar informacion sensible al cliente.
