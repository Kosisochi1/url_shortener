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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const UserSchema = new mongoose_1.default.Schema({
    Name: {
        type: String,
        require: true
    },
    Email: {
        type: String,
        require: true
    },
    Password: {
        type: String,
        require: true
    },
    verificationToken: {
        type: String,
        require: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedDate: {
        type: Date
    },
    passwordToken: {
        type: String,
        default: ''
    },
    passwordTokenExpDate: {
        type: Date,
        default: Date.now()
    }
});
UserSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        if (user.isModified('Password'))
            return next();
        try {
            const saltRounds = 10;
            const hash = bcrypt_1.default.hash(user.Password, saltRounds);
            user.Password = hash;
            next();
        }
        catch (error) {
            return next();
        }
    });
});
UserSchema.methods.isValidPassword = function (Password, hashPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield bcrypt_1.default.compare(Password, hashPassword);
    });
};
const UserModel = mongoose_1.default.model('user', UserSchema);
exports.default = UserModel;
