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
exports.validateLogin = exports.validateUser = void 0;
const joi_1 = __importDefault(require("joi"));
function validateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                Name: joi_1.default.string().required().alphanum().min(4).max(20),
                Email: joi_1.default.string().required().email().required(),
                Password: joi_1.default.string().min(4).max(15).required(),
                verificationToken: joi_1.default.string(),
                isVerified: joi_1.default.boolean()
            });
            yield schema.validateAsync(req.body, { abortEarly: true });
            next();
        }
        catch (err) {
            return res.status(422).json({ err: err.details[1] });
        }
    });
}
exports.validateUser = validateUser;
function validateLogin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const schema = joi_1.default.object({
                Email: joi_1.default.string().required().email(),
                Password: joi_1.default.string().required()
            });
            yield schema.validateAsync(req.body, { abortEarly: true });
            next();
        }
        catch (err) {
            return res.status(422).json({ err: err.details[1] });
        }
    });
}
exports.validateLogin = validateLogin;
