"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("@/controllers/authController");
const auth_1 = require("@/middlewares/auth");
const validation_1 = require("@/middlewares/validation");
const router = (0, express_1.Router)();
router.post('/register', validation_1.validateRegister, authController_1.AuthController.register);
router.post('/login', validation_1.validateLogin, authController_1.AuthController.login);
router.get('/profile', auth_1.authenticateToken, authController_1.AuthController.getProfile);
router.post('/refresh', auth_1.authenticateToken, authController_1.AuthController.refreshToken);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map