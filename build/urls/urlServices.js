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
// import { qrCode } from "../utils/QrCode"
const shortUrl_1 = require("../utils/shortUrl");
const axios_1 = __importDefault(require("axios"));
const logger_1 = require("../logger");
// declare global {
//     namespace Express{
//         interface Request{
//             userExist:IUrl
//         }
//     }
// }
const createShortUrl = (reqBody, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info('[Short Url Creation process ]=>  Started    ');
        const shortUrlGen = yield (0, shortUrl_1.url_short)(reqBody.Custom_url);
        logger_1.logger.info('[Short Url Genareted ]=>  Genareted    ');
        const data = {
            frame_name: 'no-frame',
            qr_code_text: shortUrlGen,
            image_format: 'SVG',
            qr_code_logo: 'scan-me-square',
        };
        const options = {
            method: 'POST',
            url: 'https://api.qr-code-generator.com/v1/create?access-token=k11u-0kcrtKLiXkpPEZnnNUH9RTpYxOOwxf8_zL52Jx2LzVjxvOaiD2lXyc69TMf',
            headers: {
                'content-type': 'application/json',
            },
            data: data,
        };
        logger_1.logger.info('[Qr Code  process]=>  Started    ');
        const response = yield axios_1.default.request(options);
        const QR_code = response.data;
        logger_1.logger.info('[QR Code  ]=>  Genareted    ');
        (0, validUrl_1.checkUrl)(reqBody.Long_url);
        logger_1.logger.info('[Long Url Validity  process ]=>  Started    ');
        if (!validUrl_1.checkUrl) {
            return {
                massage: 'Url not valid',
                code: 400
            };
        }
        logger_1.logger.info('[Long Url Validity  process ]=>  Completed    ');
        const url_exist = yield urlModel_1.default.findOne({ Long_url: reqBody.Long_url });
        if (url_exist) {
            logger_1.logger.info('[Long Url  ]=>  Exist    ');
            return {
                massage: 'short url exist',
                code: 401
            };
        }
        const short_url = yield urlModel_1.default.create({
            Long_url: reqBody.Long_url,
            Custom_url: reqBody.Custom_url,
            Qr_code: QR_code,
            Short_url: shortUrlGen,
            User_id: userId
        });
        logger_1.logger.info('[Short Url  process ]=>  Completed    ');
        return {
            massage: 'Short Url',
            data: `http://localhost:4500/s/s.com/${short_url.Short_url}`
        };
    }
    catch (error) {
        logger_1.logger.info('[Server Error ]=> Short Url    ');
        return {
            massage: 'Server Error',
            code: 500,
        };
    }
});
function redirectShortUrl(reqBody, reqParam2, reqParam, reqParam3) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.info('[Redirect Url  process ]=>  Started    ');
        try {
            const getShortUrl = yield urlModel_1.default.findOne({ Short_url: reqBody });
            if (getShortUrl) {
                getShortUrl.User_agent = reqParam2;
                getShortUrl.Click_by = reqParam;
                getShortUrl.Url_click_count += 1;
                getShortUrl.save();
            }
            logger_1.logger.info('[Redirect Url  process ]=>  COmpleted    ');
            return {
                massage: 'Please redirect ',
                data: getShortUrl
            };
        }
        catch (error) {
            logger_1.logger.info('[Server Error ]=> Redirecte Url    ');
            return {
                massage: 'Server Error',
                code: 500,
            };
        }
    });
}
function historyList(reqParam) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.logger.info('[Get all Url  History ]=>  Started    ');
            const history = yield urlModel_1.default.find({ User_id: reqParam.User_id });
            if (history.length <= 0) {
                return {
                    massage: 'No record found',
                    code: 422
                };
            }
            logger_1.logger.info('[Get all Url  History ]=>  Completed    ');
            return {
                massage: 'short link List',
                code: 200,
                data: history
            };
        }
        catch (error) {
            logger_1.logger.info('[Server Error ]=> Url History     ');
            return {
                massage: 'Server Error',
                code: 500,
            };
        }
    });
}
function editUrl(id, reqBody) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.info('[Edit Url  Process ]=>  Started    ');
        try {
            const findUrl = yield urlModel_1.default.findOneAndUpdate({ Short_url: id }, reqBody, { new: true });
            logger_1.logger.info('[Edit Url  Process ]=>  Completed    ');
            return {
                massage: 'Url updated',
                code: 200,
                data: findUrl
            };
        }
        catch (error) {
            logger_1.logger.info('[Server Error ]=> Url Edit ');
            return {
                massage: 'Server Error',
                code: 500,
            };
        }
    });
}
function deleteAll(reqParam) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.logger.info('[Delete Url  Process ]=>  Started    ');
            const deleteList = yield urlModel_1.default.deleteMany({ User_id: reqParam.User_id });
            logger_1.logger.info('[Delete Url  Process ]=>  Completed    ');
            return {
                massage: 'Delete List',
                code: 200,
                data: deleteList
            };
        }
        catch (error) {
            logger_1.logger.info('[Server Error ]=> Delete Url ');
            return {
                massage: 'Server Error',
                code: 500,
            };
        }
    });
}
function deleteOne(reqParam) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.logger.info('[Delete One Url  Process ]=>  Started    ');
            const deleteItem = yield urlModel_1.default.deleteOne({ _id: reqParam._id });
            logger_1.logger.info('[Delete One Url  Process ]=>  Completed    ');
            return {
                massage: 'Item Deleted',
                code: 200
            };
        }
        catch (error) {
            logger_1.logger.info('[Server Error ]=> Delete One Url ');
            return {
                massage: 'Server Error',
                code: 500,
            };
        }
    });
}
exports.default = {
    createShortUrl,
    redirectShortUrl,
    historyList,
    editUrl,
    deleteAll,
    deleteOne
};
