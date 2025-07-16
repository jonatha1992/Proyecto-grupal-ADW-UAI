import { query, transaction } from '@/config/database';
import { User, CreateUserDto, UpdateUserDto } from '@/types';
import crypto from 'crypto';

export class UserModel {
  static async findByEmail(email: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return result.rows[0] || null;
  }

  static async findById(id: string): Promise<User | null> {
    const result = await query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return result.rows[0] || null;
  }

  static async create(userData: CreateUserDto): Promise<User> {
    const uuid = crypto.randomUUID();
    const result = await query(
      `INSERT INTO users (id, email, name, phone, password_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [uuid, userData.email, userData.name, userData.phone, userData.password_hash]
    );

    // Fetch and return the created user
    return this.findById(uuid) as Promise<User>;
  }

  static async update(id: string, userData: UpdateUserDto): Promise<User | null> {
    const fields = [];
    const values = [];

    if (userData.name !== undefined) {
      fields.push(`name = ?`);
      values.push(userData.name);
    }

    if (userData.phone !== undefined) {
      fields.push(`phone = ?`);
      values.push(userData.phone);
    }

    if (fields.length === 0) {
      throw new Error('No hay campos para actualizar');
    }

    fields.push(`updated_at = datetime('now')`);
    values.push(id);

    await query(
      `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
      [...values, id]
    );

    return this.findById(id);
  }

  static async delete(id: string): Promise<boolean> {
    const result = await query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    return result.rowCount > 0;
  }

  static async findAll(limit: number = 50, offset: number = 0): Promise<User[]> {
    const result = await query(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    return result.rows;
  }

  static async count(): Promise<number> {
    const result = await query('SELECT COUNT(*) as total FROM users');
    return parseInt(result.rows[0].total);
  }
}
