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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./db");
const userRoute_1 = __importDefault(require("./users/userRoute"));
const urlRoute_1 = __importDefault(require("./urls/urlRoute"));
const logger_1 = require("./logger");
const viewRouter_1 = __importDefault(require("./views/viewRouter"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// const redis = new Redis()
const port = process.env.PORT;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use('/public', express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/public', express_1.default.static(path_1.default.join(__dirname, 'reset.html')));
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send('Welcome to Url Shortrner');
}));
app.use('/user', userRoute_1.default);
app.use('/s', urlRoute_1.default);
app.use('/', viewRouter_1.default);
app.get('*', (req, res) => {
    res.status(404).json({
        data: null,
        massage: 'Route Not Found',
    });
});
app.use((err, req, res, next) => {
    res.status(500).json({
        data: null,
        error: err.stack,
    });
});
(0, db_1.connect)(process.env.DB_URL);
app.listen(port, () => {
    logger_1.logger.info('[Server]=> Started');
});
