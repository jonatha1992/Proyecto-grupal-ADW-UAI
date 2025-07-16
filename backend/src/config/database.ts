// Import from SQLite implementation
import db, {
  testConnection,
  connectDatabase,
  query,
  transaction
} from './database-sqlite';

export {
  testConnection,
  connectDatabase,
  query,
  transaction
};

export default db;
