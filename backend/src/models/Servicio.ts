import { query } from '@/config/database';
import { Servicio } from '@/types';
import crypto from 'crypto';

export class ServicioModel {
  static async findAll(activeOnly?: boolean, limit?: number, offset?: number): Promise<Servicio[]> {
    let queryText = 'SELECT * FROM servicios';
    const params: any[] = [];

    if (activeOnly !== undefined) {
      queryText += ' WHERE activo = ?';
      params.push(activeOnly ? 1 : 0);
    }

    queryText += ' ORDER BY nombre ASC';

    if (limit !== undefined) {
      queryText += ' LIMIT ?';
      params.push(limit);
    }

    if (offset !== undefined) {
      queryText += ' OFFSET ?';
      params.push(offset);
    }

    const result = await query(queryText, params);
    return result.rows;
  }

  static async findById(id: string): Promise<Servicio | null> {
    const result = await query(
      'SELECT * FROM servicios WHERE id = ?',
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByName(nombre: string): Promise<Servicio | null> {
    const result = await query(
      'SELECT * FROM servicios WHERE LOWER(nombre) = LOWER(?)',
      [nombre]
    );
    return result.rows[0] || null;
  }

  static async create(servicioData: Omit<Servicio, 'id' | 'created_at' | 'updated_at'>): Promise<Servicio> {
    const uuid = crypto.randomUUID();

    await query(
      `INSERT INTO servicios (id, nombre, precio, duracion, descripcion, activo, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [
        uuid,
        servicioData.nombre,
        servicioData.precio,
        servicioData.duracion,
        servicioData.descripcion,
        servicioData.activo ? 1 : 0
      ]
    );

    return this.findById(uuid) as Promise<Servicio>;
  }

  static async update(id: string, servicioData: Partial<Omit<Servicio, 'id' | 'created_at' | 'updated_at'>>): Promise<Servicio | null> {
    const fields = [];
    const values = [];

    if (servicioData.nombre !== undefined) {
      fields.push(`nombre = ?`);
      values.push(servicioData.nombre);
    }

    if (servicioData.precio !== undefined) {
      fields.push(`precio = ?`);
      values.push(servicioData.precio);
    }

    if (servicioData.duracion !== undefined) {
      fields.push(`duracion = ?`);
      values.push(servicioData.duracion);
    }

    if (servicioData.descripcion !== undefined) {
      fields.push(`descripcion = ?`);
      values.push(servicioData.descripcion);
    }

    if (servicioData.activo !== undefined) {
      fields.push(`activo = ?`);
      values.push(servicioData.activo ? 1 : 0);
    }

    if (fields.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    fields.push(`updated_at = datetime('now')`);

    await query(
      `UPDATE servicios SET ${fields.join(', ')} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM servicios WHERE id = ?',
      [id]
    );
    return result.rowCount > 0;
  }

  static async toggleActive(id: string): Promise<Servicio | null> {
    // En SQLite no tenemos operador NOT directo como en PostgreSQL
    // Primero obtenemos el servicio
    const servicio = await this.findById(id);

    if (!servicio) {
      return null;
    }

    // Luego invertimos su estado
    const nuevoEstado = servicio.activo ? 0 : 1;

    await query(
      `UPDATE servicios 
       SET activo = ?, updated_at = datetime('now') 
       WHERE id = ?`,
      [nuevoEstado, id]
    );

    return this.findById(id);
  }

  static async findActive(): Promise<Servicio[]> {
    const result = await query(
      'SELECT * FROM servicios WHERE activo = 1 ORDER BY nombre ASC'
    );
    return result.rows;
  }

  static async findByPriceRange(minPrice: number, maxPrice: number): Promise<Servicio[]> {
    const result = await query(
      'SELECT * FROM servicios WHERE precio >= ? AND precio <= ? AND activo = 1 ORDER BY precio ASC',
      [minPrice, maxPrice]
    );
    return result.rows;
  }

  static async count(activeOnly?: boolean): Promise<number> {
    let queryText = 'SELECT COUNT(*) as total FROM servicios';
    const params: any[] = [];

    if (activeOnly !== undefined) {
      queryText += ' WHERE activo = ?';
      params.push(activeOnly ? 1 : 0);
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].total);
  }
}
