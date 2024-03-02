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
exports.cacheMiddleWare = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const Cache = new node_cache_1.default();
const cacheMiddleWare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const dKey = `cache-${id}`;
        const cachedData = Cache.get(dKey);
        if (cachedData) {
            console.log('cache hit');
            return res.redirect(cachedData);
        }
        next();
    }
    catch (error) {
        return res.status(500).json({
            massage: 'Server error',
        });
    }
});
exports.cacheMiddleWare = cacheMiddleWare;
exports.default = Cache;
