"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("./userController"));
const userMiddleware_1 = require("./userMiddleware");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = express_1.default.Router();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 30 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false
});
router.post('/signup', userMiddleware_1.validateUser, userController_1.default.createUser);
router.post('/login', userMiddleware_1.validateLogin, userController_1.default.login);
router.post('/verify_email', userController_1.default.verifyMail);
router.post('/forget_password', userController_1.default.forgot_password);
router.get('/forget_password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send(`<div>
    <form >
    <input type= 'text'>
    <button>Reset</button>
    </form>
    </div>`);
}));
router.post('/reset_password', userController_1.default.resetPassword);
exports.default = router;
