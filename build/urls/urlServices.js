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
const shortUrl_1 = require("../utils/shortUrl");
const logger_1 = require("../logger");
const createShortUrl = (long_url, custom_url, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        logger_1.logger.info('[Short Url Creation process ]=>  Started    ');
        const shortUrlGen = yield (0, shortUrl_1.url_short)(custom_url);
        logger_1.logger.info('[Short Url Genareted ]=>  Genareted    ');
        const shortUrl = `https://k-short-url.onrender.com${shortUrlGen}`;
        const options = `http://api.qrserver.com/v1/create-qr-code/?data=${shortUrl}&size=100x100`;
        logger_1.logger.info('[Qr Code  process]=>  Started    ');
        // const response = await axios.get<AxiosResponse>(options);
        // console.log(response)
        const QR_code = options;
        logger_1.logger.info('[QR Code  ]=>  Genareted    ');
        (0, validUrl_1.checkUrl)(long_url);
        logger_1.logger.info('[Long Url Validity  process ]=>  Started    ');
        if (!validUrl_1.checkUrl) {
            return {
                massage: 'Url not valid',
                code: 400
            };
        }
        logger_1.logger.info('[Long Url Validity  process ]=>  Completed    ');
        const url_exist = yield urlModel_1.default.findOne({ Long_url: long_url });
        if (url_exist) {
            logger_1.logger.info('[Long Url  ]=>  Exist    ');
            return {
                massage: 'short url exist',
                code: 409,
                url_exist: url_exist
            };
        }
        const short_url = yield urlModel_1.default.create({
            Long_url: long_url,
            Custom_url: custom_url,
            Qr_code: QR_code,
            Short_url: shortUrlGen,
            Short_url_link: shortUrl,
            User_id: userId
        });
        logger_1.logger.info('[Short Url  process ]=>  Completed    ');
        return {
            massage: 'Short Url',
            code: 201,
            data: { Short_url_link: short_url.Short_url_link, Long_url: short_url.Long_url, qRcode: short_url.Qr_code }
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
        // const reqBody = reqBody
        // const reqParam = req.get('sec-ch-ua-platform')
        // const reqParam2 = req.get('user-agent')
        // const reqParam3 = req.url
        // const { id } = req.params
        // const dKey = `cache-${id}`
        try {
            const getShortUrl = yield urlModel_1.default.findOne({ Short_url: reqBody });
            if (getShortUrl) {
                getShortUrl.User_agent = reqParam2;
                getShortUrl.Click_by = reqParam;
                getShortUrl.Url_click_count += 1;
                getShortUrl.save();
            }
            logger_1.logger.info('[Redirect Url  process ]=>  COmpleted    ');
            //  const goto = `http://${getShortUrl?.Long_url}`
            //  Cache.set(dKey,goto,24*60*60)
            return {
                code: 308,
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
function redirectCustom(reqBody, reqParam2, reqParam, reqParam3) {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.info('[Redirect Url  process ]=>  Started    ');
        // const reqBody = reqBody
        // const reqParam = req.get('sec-ch-ua-platform')
        // const reqParam2 = req.get('user-agent')
        // const reqParam3 = req.url
        // const { id } = req.params
        // const dKey = `cache-${id}`
        try {
            const getShortUrl = yield urlModel_1.default.findOne({ Short_url: reqBody });
            console.log(getShortUrl);
            if (getShortUrl) {
                getShortUrl.User_agent = reqParam2;
                getShortUrl.Click_by = reqParam;
                getShortUrl.Url_click_count += 1;
                getShortUrl.save();
            }
            logger_1.logger.info('[Redirect Url  process ]=>  COmpleted    ');
            //  const goto = `http://${getShortUrl?.Long_url}`
            //  Cache.set(dKey,goto,24*60*60)
            return {
                code: 308,
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
                    code: 404
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
            if (findUrl) {
                logger_1.logger.info('[Edit Url  Process ]=>  Completed    ');
                return {
                    massage: 'Url updated',
                    code: 200,
                    data: findUrl
                };
            }
            else {
                return {
                    massage: 'No Record Found',
                    code: 404,
                };
            }
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
            yield urlModel_1.default.deleteMany({ User_id: reqParam.User_id });
            logger_1.logger.info('[Delete Url  Process ]=>  Completed    ');
            return {
                massage: 'Delete List',
                code: 200,
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
        // const { _id }= reqParam
        try {
            logger_1.logger.info('[Delete One Url  Process ]=>  Started    ');
            yield urlModel_1.default.findByIdAndDelete({ _id: reqParam._id });
            // if (deleteItem) {
            logger_1.logger.info('[Delete One Url  Process ]=>  Completed    ');
            return {
                massage: 'Item Deleted',
                code: 200
            };
            // } else {
            //     return {
            //         massage: 'No Record FOund',
            //         code: 404
            //     }
            // }
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
function findLongUrl(reqBody) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const findUrl = yield urlModel_1.default.findById({ _id: reqBody._id });
            if (findUrl) {
                return {
                    massage: 'Url detail Information',
                    code: 200,
                    data: findUrl
                };
            }
            else {
                return {
                    massage: 'User Found',
                    code: 409,
                };
            }
        }
        catch (error) {
            return {
                massage: 'Server Error Analytic',
                code: 500,
            };
        }
    });
}
exports.default = {
    findLongUrl,
    createShortUrl,
    redirectShortUrl,
    historyList,
    editUrl,
    deleteAll,
    deleteOne,
    redirectCustom
};
