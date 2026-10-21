# p4_integrador

## Arquitectura por Capas

El proyecto está diseñado bajo una arquitectura de capas para separar responsabilidades, facilitar la mantenibilidad y escalar de forma ordenada:

1.  **Capa de Rutas (`src/routes.js`)**:
    Define los endpoints expuestos por la API y los redirige al controlador correspondiente.
2.  **Capa de Controladores (`src/controller/`)**:
    Se encarga de procesar las peticiones HTTP. Aquí se captura los datos entrantes, se valida mediante los **DTOs**, y si es correcta, se llama a la capa de Servicios. Por último, maneja los códigos de estado HTTP de respuesta (Ej. `201 Created`, `400 Bad Request`, `404 Not Found`, etc).
3.  **Capa de Servicios (`src/services/`)**:
    Contiene la lógica de negocio. Es responsable de orquestar operaciones complejas, transformar/completar datos (por ejemplo, hashear una contraseña o mapear estados por defecto) y comunicarse con el Repositorio.
4.  **Capa de Repositorios (`src/repository/` y `src/utils/base.repository.js`)**:
    Única responsable de la persistencia de datos (comunicación directa con PostgreSQL).
    - **BaseRepo** implementa operaciones CRUD genéricas, incluyendo búsquedas parametrizables de registros activos (`findActives`).
    - **Repositorios de Entidad** extienden o usan la base pasándole la configuración específica de su tabla (nombre, columna ID y constantes de estado para altas/bajas lógicas).
5.  **Capa DTO (Data Transfer Object) (`src/dto/`)**:
    Se utiliza para sanitizar y validar estrictamente los datos de entrada (cuerpos de POST y PUT). Retorna arrays con los errores detectados para frenar ejecuciones maliciosas o incompletas de forma temprana en el controlador.
