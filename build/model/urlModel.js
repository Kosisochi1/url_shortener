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
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const UrlSchema = new mongoose_1.Schema({
    Long_url: {
        type: String,
        require: true
    },
    Custom_url: {
        type: String
    },
    Qr_code: {
        type: String,
        // require: true
    },
    Short_url: {
        type: String,
        // require:true
    },
    Short_url_link: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    Url_click_count: {
        type: Number,
        default: 0
    },
    Click_by: {
        type: String,
        default: ''
    },
    Date_clicked: {
        type: Date,
        default: Date.now()
    },
    User_agent: {
        type: String,
        default: ''
    },
    User_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'user'
    }
});
const UrlModel = mongoose_1.default.model('url', UrlSchema);
exports.default = UrlModel;
