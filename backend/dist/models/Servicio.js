"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioModel = void 0;
const database_1 = require("@/config/database");
class ServicioModel {
    static async findAll(activeOnly, limit, offset) {
        let queryText = 'SELECT * FROM servicios';
        const params = [];
        let paramCount = 1;
        if (activeOnly !== undefined) {
            queryText += ' WHERE activo = $' + paramCount++;
            params.push(activeOnly);
        }
        queryText += ' ORDER BY nombre ASC';
        if (limit !== undefined) {
            queryText += ' LIMIT $' + paramCount++;
            params.push(limit);
        }
        if (offset !== undefined) {
            queryText += ' OFFSET $' + paramCount;
            params.push(offset);
        }
        const result = await (0, database_1.query)(queryText, params);
        return result.rows;
    }
    static async findById(id) {
        const result = await (0, database_1.query)('SELECT * FROM servicios WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    static async findByName(nombre) {
        const result = await (0, database_1.query)('SELECT * FROM servicios WHERE LOWER(nombre) = LOWER($1)', [nombre]);
        return result.rows[0] || null;
    }
    static async create(servicioData) {
        const result = await (0, database_1.query)(`INSERT INTO servicios (nombre, precio, duracion, descripcion, activo, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`, [
            servicioData.nombre,
            servicioData.precio,
            servicioData.duracion,
            servicioData.descripcion,
            servicioData.activo
        ]);
        return result.rows[0];
    }
    static async update(id, servicioData) {
        const fields = [];
        const values = [];
        let paramCount = 1;
        if (servicioData.nombre !== undefined) {
            fields.push(`nombre = $${paramCount++}`);
            values.push(servicioData.nombre);
        }
        if (servicioData.precio !== undefined) {
            fields.push(`precio = $${paramCount++}`);
            values.push(servicioData.precio);
        }
        if (servicioData.duracion !== undefined) {
            fields.push(`duracion = $${paramCount++}`);
            values.push(servicioData.duracion);
        }
        if (servicioData.descripcion !== undefined) {
            fields.push(`descripcion = $${paramCount++}`);
            values.push(servicioData.descripcion);
        }
        if (servicioData.activo !== undefined) {
            fields.push(`activo = $${paramCount++}`);
            values.push(servicioData.activo);
        }
        if (fields.length === 0) {
            throw new Error('No hay campos para actualizar');
        }
        fields.push(`updated_at = NOW()`);
        values.push(id);
        const result = await (0, database_1.query)(`UPDATE servicios SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
        return result.rows[0] || null;
    }
    static async delete(id) {
        const result = await (0, database_1.query)('DELETE FROM servicios WHERE id = $1', [id]);
        return result.rowCount > 0;
    }
    static async toggleActive(id) {
        const result = await (0, database_1.query)(`UPDATE servicios 
       SET activo = NOT activo, updated_at = NOW() 
       WHERE id = $1 
       RETURNING *`, [id]);
        return result.rows[0] || null;
    }
    static async findActive() {
        const result = await (0, database_1.query)('SELECT * FROM servicios WHERE activo = true ORDER BY nombre ASC');
        return result.rows;
    }
    static async findByPriceRange(minPrice, maxPrice) {
        const result = await (0, database_1.query)('SELECT * FROM servicios WHERE precio >= $1 AND precio <= $2 AND activo = true ORDER BY precio ASC', [minPrice, maxPrice]);
        return result.rows;
    }
    static async count(activeOnly) {
        let queryText = 'SELECT COUNT(*) as total FROM servicios';
        const params = [];
        if (activeOnly !== undefined) {
            queryText += ' WHERE activo = $1';
            params.push(activeOnly);
        }
        const result = await (0, database_1.query)(queryText, params);
        return parseInt(result.rows[0].total);
    }
}
exports.ServicioModel = ServicioModel;
//# sourceMappingURL=Servicio.js.map