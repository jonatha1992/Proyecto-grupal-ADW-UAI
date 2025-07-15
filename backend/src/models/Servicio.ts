import { query } from '@/config/database';
import { Servicio } from '@/types';

export class ServicioModel {
  static async findAll(activeOnly?: boolean, limit?: number, offset?: number): Promise<Servicio[]> {
    let queryText = 'SELECT * FROM servicios';
    const params: any[] = [];
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

    const result = await query(queryText, params);
    return result.rows;
  }

  static async findById(id: string): Promise<Servicio | null> {
    const result = await query(
      'SELECT * FROM servicios WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByName(nombre: string): Promise<Servicio | null> {
    const result = await query(
      'SELECT * FROM servicios WHERE LOWER(nombre) = LOWER($1)',
      [nombre]
    );
    return result.rows[0] || null;
  }

  static async create(servicioData: Omit<Servicio, 'id' | 'created_at' | 'updated_at'>): Promise<Servicio> {
    const result = await query(
      `INSERT INTO servicios (nombre, precio, duracion, descripcion, activo, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
       RETURNING *`,
      [
        servicioData.nombre,
        servicioData.precio,
        servicioData.duracion,
        servicioData.descripcion,
        servicioData.activo
      ]
    );
    return result.rows[0];
  }

  static async update(id: string, servicioData: Partial<Omit<Servicio, 'id' | 'created_at' | 'updated_at'>>): Promise<Servicio | null> {
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

    const result = await query(
      `UPDATE servicios SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM servicios WHERE id = $1',
      [id]
    );
    return result.rowCount > 0;
  }

  static async toggleActive(id: string): Promise<Servicio | null> {
    const result = await query(
      `UPDATE servicios 
       SET activo = NOT activo, updated_at = NOW() 
       WHERE id = $1 
       RETURNING *`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findActive(): Promise<Servicio[]> {
    const result = await query(
      'SELECT * FROM servicios WHERE activo = true ORDER BY nombre ASC'
    );
    return result.rows;
  }

  static async findByPriceRange(minPrice: number, maxPrice: number): Promise<Servicio[]> {
    const result = await query(
      'SELECT * FROM servicios WHERE precio >= $1 AND precio <= $2 AND activo = true ORDER BY precio ASC',
      [minPrice, maxPrice]
    );
    return result.rows;
  }

  static async count(activeOnly?: boolean): Promise<number> {
    let queryText = 'SELECT COUNT(*) as total FROM servicios';
    const params: any[] = [];

    if (activeOnly !== undefined) {
      queryText += ' WHERE activo = $1';
      params.push(activeOnly);
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].total);
  }

  // Método eliminado - ya está definido arriba
}
