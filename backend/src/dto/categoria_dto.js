export const categoriaDTO = (data) => {
    const dto = {
        descripcion: data.descripcion ? String(data.descripcion).trim() : null
    };

    return dto;
};

export const validateCategoriaDTO = (dto) => {
    const errors = [];

    if (!dto.descripcion || dto.descripcion.trim() === '') {
        errors.push("La descripción es obligatoria");
    }

    return errors;
};