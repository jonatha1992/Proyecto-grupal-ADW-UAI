"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const turnoRoutes_1 = __importDefault(require("./turnoRoutes"));
const servicioRoutes_1 = __importDefault(require("./servicioRoutes"));
const chatRoutes_1 = __importDefault(require("./chatRoutes"));
const router = (0, express_1.Router)();
router.use('/auth', authRoutes_1.default);
router.use('/users', userRoutes_1.default);
router.use('/turnos', turnoRoutes_1.default);
router.use('/servicios', servicioRoutes_1.default);
router.use('/chat', chatRoutes_1.default);
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'API funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
exports.default = router;
//# sourceMappingURL=index.js.map