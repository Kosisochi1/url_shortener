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
const logger_1 = require("../logger");
const createShortUrl = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { Long_url, Custom_url } = req.body;
        logger_1.logger.info('[Short Url Creation process ]=>  Started    ');
        const shortUrlGen = yield (0, shortUrl_1.url_short)(Custom_url);
        logger_1.logger.info('[Short Url Genareted ]=>  Genareted    ');
        const shortUrl = `http://localhost:4500/url/v1/api${shortUrlGen}`;
        const options = `http://api.qrserver.com/v1/create-qr-code/?data=${shortUrl}&size=100x100`;
        logger_1.logger.info('[Qr Code  process]=>  Started    ');
        const QR_code = options;
        logger_1.logger.info('[QR Code  ]=>  Genareted    ');
        (0, validUrl_1.checkUrl)(Long_url);
        logger_1.logger.info('[Long Url Validity  process ]=>  Started    ');
        if (!validUrl_1.checkUrl) {
            return res.status(400).json({ massage: 'Url not valid',
            });
        }
        logger_1.logger.info('[Long Url Validity  process ]=>  Completed    ');
        const url_exist = yield urlModel_1.default.findOne({ Long_url: Long_url });
        if (url_exist) {
            logger_1.logger.info('[Long Url  ]=>  Exist    ');
            return res.status(409).json({
                massage: 'short url exist',
            });
        }
        const short_url = yield urlModel_1.default.create({
            Long_url: Long_url,
            Custom_url: Custom_url,
            Qr_code: QR_code,
            Short_url: shortUrlGen,
            Short_url_link: shortUrl,
            User_id: req.userExist._id
        });
        logger_1.logger.info('[Short Url  process ]=>  Completed    ');
        return res.status(201).json({
            massage: 'Short Url',
            data: { Short_url_link: short_url.Short_url_link, Long_url: short_url.Long_url, qRcode: short_url.Qr_code }
        });
    }
    catch (error) {
        logger_1.logger.info('[Server Error ]=> Short Url    ');
        return res.status(500).json({
            massage: 'Server Error'
        });
    }
});
function redirectShortUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(req.url);
        logger_1.logger.info('[Redirect Url  process ]=>  Started    ');
        const reqBody = req.url;
        const reqParam = req.get('sec-ch-ua-platform');
        const reqParam2 = req.get('user-agent');
        const reqParam3 = req.url;
        const { id } = req.params;
        const dKey = `cache-${id}`;
        try {
            // const {Short_url} =req.params.id
            const getShortUrl = yield urlModel_1.default.findOne({ Short_url: reqBody });
            if (getShortUrl) {
                getShortUrl.User_agent = reqParam2;
                getShortUrl.Click_by = reqParam;
                getShortUrl.Url_click_count += 1;
                getShortUrl.save();
            }
            logger_1.logger.info('[Redirect Url  process ]=>  COmpleted    ');
            const goto = `http://${getShortUrl === null || getShortUrl === void 0 ? void 0 : getShortUrl.Long_url}`;
            //  Cache.set(dKey,goto,24*60*60)
            return res.status(308).redirect(goto);
        }
        catch (error) {
            logger_1.logger.info('[Server Error ]=> Redirecte Url    ');
            return res.status(500).json({
                massage: 'Server Error',
            });
        }
    });
}
function historyList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.logger.info('[Get all Url  History ]=>  Started    ');
            const history = yield urlModel_1.default.find({ User_id: req.userExist._id });
            if (history.length <= 0) {
                return res.status(404).json({
                    massage: 'No record found',
                });
            }
            logger_1.logger.info('[Get all Url  History ]=>  Completed    ');
            return res.status(200).json({
                massage: 'short link List',
                data: history
            });
        }
        catch (error) {
            logger_1.logger.info('[Server Error ]=> Url History     ');
            return res.status(500).json({
                massage: 'Server Error',
            });
        }
    });
}
function analytic(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.logger.info('[Get all Url  History ]=>  Started    ');
            const history = yield urlModel_1.default.find({ User_id: req.userExist._id });
            if (history.length <= 0) {
                return res.status(404).json({
                    massage: 'No record found',
                });
            }
            logger_1.logger.info('[Get all Url  History ]=>  Completed    ');
            return res.status(200).json({
                massage: 'short link List',
                data: history
            });
        }
        catch (error) {
            logger_1.logger.info('[Server Error ]=> Url History     ');
            return res.status(500).json({
                massage: 'Server Error',
            });
        }
    });
}
function editUrl(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.info('[Edit Url  Process ]=>  Started    ');
        // const { id } = req.params.id
        try {
            const findUrl = yield urlModel_1.default.findOne({ _id: req.params.id });
            if (!findUrl) {
                return res.status(404).json({ massage: 'Not Found' });
            }
            const updatedUrl = yield urlModel_1.default.updateOne({ _id: findUrl._id }, { Long_url: req.body.Long_url });
            logger_1.logger.info('[Edit Url  Process ]=>  Completed    ');
            return res.status(200).json({
                massage: 'Url updated',
                data: updatedUrl
            });
        }
        catch (error) {
            logger_1.logger.info('[Server Error ]=> Url Edit ');
            return res.status(500).json({
                massage: 'Server Error',
            });
        }
    });
}
function deleteAll(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.logger.info('[Delete Url  Process ]=>  Started    ');
            const deleteList = yield urlModel_1.default.deleteMany({ User_id: req.userExist._id });
            if (deleteList) {
                logger_1.logger.info('[Delete Url  Process ]=>  Completed    ');
                return res.status(200).json({
                    massage: 'Delete List',
                    data: deleteList
                });
            }
            else {
                return res.status(404).json({ massage: 'No Record Found',
                });
            }
        }
        catch (error) {
            logger_1.logger.info('[Server Error ]=> Delete Url ');
            return res.status(500).json({
                massage: 'Server Error',
            });
        }
    });
}
function deleteOne(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            logger_1.logger.info('[Delete One Url  Process ]=>  Started    ');
            const deleteItem = yield urlModel_1.default.deleteOne({ _id: req.params.id });
            if (deleteItem) {
                logger_1.logger.info('[Delete One Url  Process ]=>  Completed    ');
                return res.status(200).json({
                    massage: 'Item Deleted',
                });
            }
            else {
                return res.status(404).json({ massage: 'No Record FOund',
                });
            }
        }
        catch (error) {
            logger_1.logger.info('[Server Error ]=> Delete One Url ');
            return res.status(500).json({
                massage: 'Server Error',
            });
        }
    });
}
function analyticDetails(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const findUrl = yield urlModel_1.default.findById({ _id: req.params.id });
            if (findUrl) {
                return res.status(200).json({ massage: 'Url detail Information',
                    data: findUrl });
            }
            else {
                return res.status(409).json({ massage: 'User Found' });
            }
        }
        catch (error) {
            return res.status(409).json({ massage: 'User Found' });
        }
    });
}
exports.default = {
    createShortUrl,
    redirectShortUrl,
    historyList,
    editUrl,
    deleteAll,
    deleteOne,
    analyticDetails,
    analytic
};
