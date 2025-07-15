import { query, transaction } from '@/config/database';
import { User, CreateUserDto, UpdateUserDto } from '@/types';

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] || null;
  }

  static async create(userData: CreateUserDto): Promise<User> {
    const result = await query(
      `INSERT INTO users (email, name, phone, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`,
      [userData.email, userData.name, userData.phone, userData.password_hash]
    );
    return result.rows[0];
  }

  static async update(id: string, userData: UpdateUserDto): Promise<User | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (userData.name !== undefined) {
      fields.push(`name = $${paramCount++}`);
      values.push(userData.name);
    }

    if (userData.phone !== undefined) {
      fields.push(`phone = $${paramCount++}`);
      values.push(userData.phone);
    }

    if (fields.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] || null;
  }

  static async delete(id: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM users WHERE id = $1',
      [id]
    );
    return result.rowCount > 0;
  }

  static async findAll(limit: number = 50, offset: number = 0): Promise<User[]> {
    const result = await query(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  static async count(): Promise<number> {
    const result = await query('SELECT COUNT(*) as total FROM users');
    return parseInt(result.rows[0].total);
  }
}
