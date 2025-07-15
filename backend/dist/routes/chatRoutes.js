"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chatController_1 = require("../controllers/chatController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.post('/message', async (req, res) => {
    const authHeader = req.headers.authorization;
    let isAuthenticated = false;
    let userName = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
            const token = authHeader.substring(7);
            req.body.isAuthenticated = true;
        }
        catch (error) {
            req.body.isAuthenticated = false;
        }
    }
    await chatController_1.chatController.sendMessage(req, res);
});
router.get('/history', auth_1.authenticateToken, chatController_1.chatController.getChatHistory);
exports.default = router;
//# sourceMappingURL=chatRoutes.js.map