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
// import express, {Express, req: Request, res: Response } from "express"
const dotenv = __importStar(require("dotenv"));
const userModel_1 = __importDefault(require("../model/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv.config({ path: __dirname + '/./../../.env' });
const crypto_1 = __importDefault(require("crypto"));
const mailling_1 = require("../utils/mailling");
const logger_1 = require("../logger");
const bcrypt_1 = __importDefault(require("bcrypt"));
const secrete_key = process.env.SECRETE_KEY;
const createUser = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info('[Create User Process]=> started    ');
        const userExist = yield userModel_1.default.findOne({ Email: reqBody.Email });
        if (userExist) {
            return {
                massage: 'User Exist',
                code: 409
            };
        }
        const verificationToken = crypto_1.default.randomBytes(16).toString("hex");
        console.log(reqBody.Password);
        const newUser = yield userModel_1.default.create({
            Name: reqBody.Name,
            Email: reqBody.Email,
            Password: reqBody.Password,
            verificationToken: verificationToken,
            // isVerified: reqBody.isVerified,
        });
        const token = jsonwebtoken_1.default.sign({ Email: newUser.Email, _id: newUser._id }, secrete_key);
        logger_1.logger.info('[Create User Process]=> completed    ');
        const origin = 'http://localhost:4500';
        logger_1.logger.info('[ Mail verification Process]=> started    ');
        (0, mailling_1.sendVerification)({
            name: newUser.Name,
            verificationToken: newUser.verificationToken,
            origin: origin,
            to: newUser.Email,
            subject: ' Mail Verification',
            html: ` <h4>Hi ${newUser.Name}</h4> </br>
            <p>Please verify your mail!!!  <a href="${origin}/verify_email?verificationToken=${newUser.verificationToken}&Email=${newUser.Email}">here</a></p>`
        });
        logger_1.logger.info('[Verification Mail ]=> Sent    ');
        return {
            massage: ' User Created, Check  your Mail and Verify',
            code: 201,
            data: { token }
        };
    }
    catch (error) {
        logger_1.logger.info('[Server Error ]=> Create User    ');
        return {
            massage: ' Server Error',
            code: 500
        };
    }
});
const verifyMail = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verifyUser = yield userModel_1.default.findOne({ Email: reqBody.Email });
        if (!verifyUser) {
            return {
                massege: ' Mail not Verified',
                code: 401
            };
        }
        if (verifyUser.verificationToken !== reqBody.verificationToken) {
            return {
                massage: 'Mail not Verified',
                code: 401
            };
        }
        verifyUser.isVerified = true;
        verifyUser.verifiedDate = new Date();
        verifyUser.verificationToken = '';
        verifyUser.save();
        logger_1.logger.info('[Mail Verification Process]=> Completed    ');
        return {
            massage: 'User Verified',
            code: 200
        };
    }
    catch (error) {
        logger_1.logger.info('[Server Error ]=> Mail Verification    ');
        return {
            massage: ' Server Error',
            code: 500
        };
    }
});
function forgot_password(reqBody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!reqBody) {
                return { massage: 'Enter Valid Mail', code: 404 };
            }
            const user = yield userModel_1.default.findOne({ Email: reqBody });
            if (user) {
                const passwordToken = crypto_1.default.randomBytes(16).toString("hex");
                const origin = 'http://localhost:4500';
                logger_1.logger.info('[ Mail verification Process]=> started    ');
                (0, mailling_1.passwordReset)({
                    name: user.Name,
                    passwordToken: user.passwordToken,
                    origin: origin,
                    to: user.Email,
                    subject: ' Mail Verification',
                    html: ` <h4>Hi ${user.Name}</h4> </br>
                <p>Please verify your Account!!!  <a href="${origin}/reset_password?passwordToken=${user.passwordToken}&Email=${user.Email}"> Click Reset Password</a></p>`
                });
                const tenMinutes = 1000 * 60 * 10;
                const passwordTokenExpDate = new Date(Date.now() + tenMinutes);
                user.passwordToken = passwordToken;
                user.passwordTokenExpDate = passwordTokenExpDate;
                user.save();
                return {
                    massage: 'Check Your Mail for Reset Link',
                    code: 200
                };
            }
        }
        catch (error) {
            logger_1.logger.info('[Server Error ]=> Forgot Password    ');
            return {
                massage: ' Server Error',
                code: 500
            };
        }
    });
}
function resetPassword(reqBody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const timeNow = new Date();
            const newPassword = yield userModel_1.default.findOne({ Email: reqBody.Email });
            console.log(newPassword);
            if (!newPassword) {
                return {
                    massage: 'No User Matched',
                    code: 404
                };
            }
            if (newPassword.Email === reqBody.Email && newPassword.passwordTokenExpDate > timeNow) {
                const saltRounds = 10;
                const hashedPassword = yield bcrypt_1.default.hash(reqBody.Password, saltRounds);
                newPassword.Password = hashedPassword;
                newPassword.passwordTokenExpDate = null;
                newPassword.passwordToken = null;
                newPassword.save();
            }
            return {
                massage: 'Reset completed',
                code: 200,
                newPassword
            };
        }
        catch (error) {
            logger_1.logger.info('[Server Error ]=> Reset Password    ');
            return {
                massage: ' Server Error',
                code: 500
            };
        }
    });
}
function login(reqBody, reqBody2) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.logger.info('[ Login Process]=> started    ');
            const userExit = yield userModel_1.default.findOne({ Email: reqBody });
            if (!userExit) {
                return {
                    massage: 'Not User matched',
                    code: 404
                };
            }
            const validaUser = yield userExit.isValidPassword(reqBody2);
            console.log(validaUser);
            if (!validaUser) {
                return {
                    massage: 'Incorrect Login Details',
                    code: 422
                };
            }
            if (userExit.isVerified == false) {
                return {
                    massage: 'User not verified',
                    code: 401
                };
            }
            const token = jsonwebtoken_1.default.sign({ Email: userExit.Email, _id: userExit._id }, secrete_key, { expiresIn: '1h' });
            logger_1.logger.info('[ Login Process]=> Completed    ');
            return {
                massage: 'Login Successful',
                code: 200,
                data: {
                    userExit,
                    token
                }
            };
        }
        catch (error) {
            logger_1.logger.info('[Server Error ]=> Login    ');
            return {
                massage: ' Server Error',
                code: 500
            };
        }
    });
}
exports.default = {
    createUser,
    login,
    verifyMail,
    forgot_password,
    resetPassword
};
