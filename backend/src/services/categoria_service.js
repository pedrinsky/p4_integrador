// backend/src/services/categorias.service.js
import * as CategoriasRepo from '../repository/categorias.repository.js';

// BROWSE: Procesa paginación, pide datos al repo y arma el objeto final
export const getAll = async (queryParams = {}) => {
    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;
    const offset = (page - 1) * limit;
    const search = queryParams.search ? String(queryParams.search).trim() : '';

    // Consultamos al repositorio enviándole los datos listos
    const { categorias, totalRegistros } = await CategoriasRepo.cargarCategoria({
        limit,
        offset,
        search
    });

    const totalPaginas = Math.ceil(totalRegistros / limit) || 1;

    // Retorna la estructura lista que consumirá el frontend
    return {
        categorias,
        paginacion: {
            totalRegistros,
            totalPaginas,
            paginaActual: page,
            limitePorPagina: limit
        }
    };
};

// READ: Obtener una categoría puntual por ID
export const readCategoria = async (id) => {
    return await CategoriasRepo.readCategoria(id);
};

// ADD: Crear una nueva categoría a partir de los datos validados del DTO
export const crearCategoria = async (dto) => {
    // Si tuvieras una regla como: "no repetir nombres", se consulta acá antes de crear
    return await CategoriasRepo.crearCategoria({
        descripcion: dto.descripcion
    });
};

// EDIT: Actualizar una categoría existente
export const editarCategoria = async (id, dto) => {
    return await CategoriasRepo.editarCategoria(id, {
        descripcion: dto.descripcion
    });
};

// DELETE: Baja lógica
export const borrarCategoria = async (id) => {
    return await CategoriasRepo.borrarCategoria(id);
};