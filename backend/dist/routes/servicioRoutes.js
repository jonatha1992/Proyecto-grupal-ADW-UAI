"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const servicioController_1 = require("@/controllers/servicioController");
const router = (0, express_1.Router)();
router.get('/', servicioController_1.ServicioController.getAll);
router.get('/active', servicioController_1.ServicioController.getActive);
router.get('/price-range', servicioController_1.ServicioController.getByPriceRange);
router.get('/:id', servicioController_1.ServicioController.getById);
exports.default = router;
//# sourceMappingURL=servicioRoutes.js.map