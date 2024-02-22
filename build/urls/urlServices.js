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
const dotenv = __importStar(require("dotenv"));
dotenv.config({ path: __dirname + '/./../../.env' });
const urlModel_1 = __importDefault(require("../model/urlModel"));
const validUrl_1 = require("../utils/validUrl");
const QrCode_1 = require("../utils/QrCode");
const shortUrl_1 = require("../utils/shortUrl");
const createShortUrl = (reqBody) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, validUrl_1.checkUrl)(reqBody.Long_url);
        if (!validUrl_1.checkUrl) {
            return {
                massage: 'Url not valid',
                code: 400
            };
        }
        const url_exist = yield urlModel_1.default.findOne({ Long_url: reqBody.Long_url, User_id: reqBody.User_id });
        if (url_exist.Long_url == reqBody.Long_url) {
            return {
                massage: 'short url exist',
                code: 401
            };
        }
        const short_url = yield urlModel_1.default.create({
            Long_url: reqBody.Long_url,
            Custom_url: reqBody.Custom_url,
            Qr_code: (0, QrCode_1.qrCode)(reqBody.Long_url),
            Short_url: (0, shortUrl_1.url_short)(reqBody.Custom_url),
        });
    }
    catch (error) {
    }
});
