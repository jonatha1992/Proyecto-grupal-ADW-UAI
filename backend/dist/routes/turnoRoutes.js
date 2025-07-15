"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const turnoController_1 = require("@/controllers/turnoController");
const auth_1 = require("@/middlewares/auth");
const validation_1 = require("@/middlewares/validation");
const router = (0, express_1.Router)();
router.post('/', auth_1.authenticateToken, validation_1.validateTurno, turnoController_1.TurnoController.create);
router.get('/', auth_1.authenticateToken, turnoController_1.TurnoController.getUserTurnos);
router.get('/:id', auth_1.authenticateToken, turnoController_1.TurnoController.getById);
router.put('/:id', auth_1.authenticateToken, validation_1.validateTurnoUpdate, turnoController_1.TurnoController.update);
router.patch('/:id/cancel', auth_1.authenticateToken, turnoController_1.TurnoController.cancel);
router.get('/availability/slots', turnoController_1.TurnoController.getAvailableSlots);
exports.default = router;
//# sourceMappingURL=turnoRoutes.js.map