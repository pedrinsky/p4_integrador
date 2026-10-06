import { pool } from '../config/db.js';
import * as US from '../services/usuarios.service.js'

export const getAll = async (req, res, next) => {
  try {
    const result = await US.getAll();
    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const getById = async (req, res, next) => {
  try {
    const result = await US.getById(req.params.id);
    if (!result || result.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(result[0] || result);
  } catch (e) {
    next(e);
  }
};

export const getEmpleadosSistemas = async (req, res, next) => {
    try {
        const result = await US.getSistemasEmpleados();
        res.json(result);
    } catch (e) {
        console.error("Error fetching sistemas emp:", e);
        res.status(500).json({ error: 'Error del servidor al obtener empleados' });
    }
};
