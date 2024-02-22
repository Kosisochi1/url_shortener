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
const router = express_1.default.Router();
router.post('/signup', userMiddleware_1.validateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const createUser = yield userController_1.default.createUser(req.body);
    res.status(201).json({ createUser });
}));
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // const reqBody = req.body
    const loginUser = yield userController_1.default.login(req.body);
    // console.log(await userController.login(req.body))
    res.json({ loginUser });
}));
router.post('/verify_email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyMail = yield userController_1.default.verifyMail(req.body);
    res.json({ verifyMail });
}));
exports.default = router;
