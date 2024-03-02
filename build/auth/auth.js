"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const userModel_1 = __importDefault(require("../model/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv = __importStar(require("dotenv"));
const logger_1 = require("../logger");
// import { NextFunction } from "express";
dotenv.config();
const secrete_key = process.env.SECRETE_KEY;
function authenticateUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeaders = req.headers;
            if (!authHeaders) {
                return res.status(401).json({
                    massage: ' You are not Authorize',
                    // code: 401
                });
            }
            const token = authHeaders.authorization.split(' ')[1];
            const verifyToken = jsonwebtoken_1.default.verify(token, secrete_key);
            // console.log(verifyToken.Email)
            const verifyUser = yield userModel_1.default.findOne({ Email: verifyToken.Email });
            // console.log(verifyUser)
            if (!verifyUser) {
                return res.status(401).json({
                    massage: 'You are not Authorize',
                    // code : 401
                });
            }
            req.userExist = verifyToken;
            next();
        }
        catch (error) {
            return {
                massage: 'Server Error',
                code: 500
            };
        }
    });
}
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    logger_1.logger.info('[check]=> Available  Cookies  ');
    const token = req.cookies.jwt;
    if (token) {
        logger_1.logger.info('[Cookies]=> Available    ');
        try {
            logger_1.logger.info('[Auth Process]=> started    ');
            const decodeValue = yield jsonwebtoken_1.default.verify(token, secrete_key);
            res.locals.loginUser = decodeValue;
            logger_1.logger.info('[Auth Process]=> completed    ');
            next();
        }
        catch (error) {
            logger_1.logger.info('[Auth Process]=> Server Error    ');
            return res.status(500).json({
                massage: 'Server',
            });
        }
    }
});
exports.default = { authenticateUser, authenticate };
