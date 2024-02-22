"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUrl = void 0;
const valid_url_1 = __importDefault(require("valid-url"));
function checkUrl(url) {
    return !!valid_url_1.default.isWebUri(url);
}
exports.checkUrl = checkUrl;
