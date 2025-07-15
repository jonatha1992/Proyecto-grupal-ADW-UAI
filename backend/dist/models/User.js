"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const database_1 = require("@/config/database");
class UserModel {
    static async findByEmail(email) {
        const result = await (0, database_1.query)('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0] || null;
    }
    static async findById(id) {
        const result = await (0, database_1.query)('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0] || null;
    }
    static async create(userData) {
        const result = await (0, database_1.query)(`INSERT INTO users (email, name, phone, password_hash, created_at, updated_at)
       VALUES ($1, $2, $3, $4, NOW(), NOW())
       RETURNING *`, [userData.email, userData.name, userData.phone, userData.password_hash]);
        return result.rows[0];
    }
    static async update(id, userData) {
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
        const result = await (0, database_1.query)(`UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`, values);
        return result.rows[0] || null;
    }
    static async delete(id) {
        const result = await (0, database_1.query)('DELETE FROM users WHERE id = $1', [id]);
        return result.rowCount > 0;
    }
    static async findAll(limit = 50, offset = 0) {
        const result = await (0, database_1.query)('SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2', [limit, offset]);
        return result.rows;
    }
    static async count() {
        const result = await (0, database_1.query)('SELECT COUNT(*) as total FROM users');
        return parseInt(result.rows[0].total);
    }
}
exports.UserModel = UserModel;
//# sourceMappingURL=User.js.map