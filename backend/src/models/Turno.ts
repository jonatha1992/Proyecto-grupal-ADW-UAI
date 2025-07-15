import { query, transaction } from '@/config/database';
import { Turno, CreateTurnoDto, UpdateTurnoDto, TurnoEstado } from '@/types';

export class TurnoModel {
  static async findById(id: string): Promise<Turno | null> {
    const result = await query(
      `SELECT t.*, u.name as user_name, u.email as user_email 
       FROM turnos t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  static async findByUserId(
    user_id: string,
    estado?: TurnoEstado,
    limit: number = 50,
    offset: number = 0
  ): Promise<Turno[]> {
    let queryText = `
      SELECT t.*, u.name as user_name, u.email as user_email 
      FROM turnos t 
      JOIN users u ON t.user_id = u.id 
      WHERE t.user_id = $1
    `;
    const params: any[] = [user_id];

    if (estado) {
      queryText += ' AND t.estado = $2';
      params.push(estado);
    }

    queryText += ' ORDER BY t.fecha DESC, t.hora DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows;
  }

  static async findByDateRange(
    startDate: Date,
    endDate: Date,
    estado?: TurnoEstado
  ): Promise<Turno[]> {
    let queryText = `
      SELECT t.*, u.name as user_name, u.email as user_email 
      FROM turnos t 
      JOIN users u ON t.user_id = u.id 
      WHERE t.fecha >= $1 AND t.fecha <= $2
    `;
    const params: any[] = [startDate, endDate];

    if (estado) {
      queryText += ' AND t.estado = $3';
      params.push(estado);
    }

    queryText += ' ORDER BY t.fecha ASC, t.hora ASC';

    const result = await query(queryText, params);
    return result.rows;
  }

  static async create(user_id: string, turnoData: CreateTurnoDto): Promise<Turno> {
    const result = await query(
      `INSERT INTO turnos (user_id, fecha, hora, servicio, precio, estado, notas, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
       RETURNING *`,
      [
        user_id,
        turnoData.fecha,
        turnoData.hora,
        turnoData.servicio,
        turnoData.precio,
        TurnoEstado.CONFIRMADO,
        turnoData.notas
      ]
    );
    return result.rows[0];
  }

  static async update(id: string, turnoData: UpdateTurnoDto): Promise<Turno | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (turnoData.fecha !== undefined) {
      fields.push(`fecha = $${paramCount++}`);
      values.push(turnoData.fecha);
    }

    if (turnoData.hora !== undefined) {
      fields.push(`hora = $${paramCount++}`);
      values.push(turnoData.hora);
    }

    if (turnoData.servicio !== undefined) {
      fields.push(`servicio = $${paramCount++}`);
      values.push(turnoData.servicio);
    }

    if (turnoData.precio !== undefined) {
      fields.push(`precio = $${paramCount++}`);
      values.push(turnoData.precio);
    }

    if (turnoData.estado !== undefined) {
      fields.push(`estado = $${paramCount++}`);
      values.push(turnoData.estado);
    }

    if (turnoData.notas !== undefined) {
      fields.push(`notas = $${paramCount++}`);
      values.push(turnoData.notas);
    }

    if (fields.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE turnos SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async cancel(id: string, user_id: string): Promise<Turno | null> {
    const result = await query(
      `UPDATE turnos 
       SET estado = $1, updated_at = NOW() 
       WHERE id = $2 AND user_id = $3 AND estado = $4
       RETURNING *`,
      [TurnoEstado.CANCELADO, id, user_id, TurnoEstado.CONFIRMADO]
    );
    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM turnos WHERE id = $1',
      [id]
    );
    return result.rowCount > 0;
  }

  static async findAvailableSlots(fecha: string, servicio: string): Promise<string[]> {
    // Horarios disponibles por defecto
    const allSlots = [
      '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
      '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
    ];

    // Buscar horarios ocupados
    const result = await query(
      `SELECT hora FROM turnos 
       WHERE fecha = $1 AND estado IN ($2, $3)`,
      [fecha, TurnoEstado.CONFIRMADO, TurnoEstado.REPROGRAMADO]
    );

    const occupiedSlots = result.rows.map((row: any) => row.hora);
    return allSlots.filter(slot => !occupiedSlots.includes(slot));
  }

  static async countByUser(user_id: string, estado?: TurnoEstado): Promise<number> {
    let queryText = 'SELECT COUNT(*) as total FROM turnos WHERE user_id = $1';
    const params: any[] = [user_id];

    if (estado) {
      queryText += ' AND estado = $2';
      params.push(estado);
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].total);
  }

  static async findByFechaHora(fecha: string, hora: string): Promise<Turno | null> {
    const result = await query(
      `SELECT t.*, u.name as user_name, u.email as user_email 
       FROM turnos t 
       JOIN users u ON t.user_id = u.id 
       WHERE t.fecha = $1 AND t.hora = $2`,
      [fecha, hora]
    );
    return result.rows[0] || null;
  }

  static async countByUserId(user_id: string, estado?: TurnoEstado): Promise<number> {
    return this.countByUser(user_id, estado);
  }

  static async getAvailableSlots(fecha: string): Promise<string[]> {
    return this.findAvailableSlots(fecha, '');
  }
}
