"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("@/controllers/userController");
const auth_1 = require("@/middlewares/auth");
const validation_1 = require("@/middlewares/validation");
const router = (0, express_1.Router)();
router.put('/profile', auth_1.authenticateToken, validation_1.validateUserUpdate, userController_1.UserController.updateProfile);
router.delete('/account', auth_1.authenticateToken, userController_1.UserController.deleteAccount);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map