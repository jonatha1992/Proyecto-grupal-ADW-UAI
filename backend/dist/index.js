"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("@/config/database");
const routes_1 = __importDefault(require("@/routes"));
const errorHandler_1 = require("@/middlewares/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)('combined'));
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use('/api/v1', routes_1.default);
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Turnos Backend API',
        version: '1.0.0',
        documentation: '/api/v1/health',
        authentication: 'JWT Bearer Token'
    });
});
app.use(errorHandler_1.errorHandler);
async function startServer() {
    try {
        console.log('🔌 Conectando a la base de datos...');
        await (0, database_1.connectDatabase)();
        console.log('✅ Base de datos conectada exitosamente');
        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
            console.log(`📚 API documentación: http://localhost:${PORT}/api/v1/health`);
            console.log(`🔐 Autenticación: JWT Bearer Token`);
            console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
        });
    }
    catch (error) {
        console.error('❌ Error al inicializar el servidor:', error);
        process.exit(1);
    }
}
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error);
    process.exit(1);
});
process.on('SIGTERM', () => {
    console.log('🛑 SIGTERM recibido, cerrando servidor...');
    process.exit(0);
});
process.on('SIGINT', () => {
    console.log('🛑 SIGINT recibido, cerrando servidor...');
    process.exit(0);
});
startServer();
//# sourceMappingURL=index.js.map