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
const userServices_1 = __importDefault(require("../users/userServices"));
const urlServices_1 = __importDefault(require("../urls/urlServices"));
const userMiddleware_1 = require("../users/userMiddleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("../auth/auth"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const cache_1 = __importDefault(require("../cach/cache"));
const cache_2 = require("../cach/cache");
const router = express_1.default.Router();
router.use((0, cookie_parser_1.default)());
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 30 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false
});
// Index 
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('index', {
        loginUser: res.locals.loginUser || null,
    });
}));
router.get('/index2', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('dex2', {
        loginUser: res.locals.loginUser || null,
    });
}));
router.get('/index', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('index', {
        loginUser: res.locals.loginUser || null,
    });
}));
// signup
router.get('/signup', (req, res) => {
    res.render('signup', { loginUser: res.locals.loginUser || null });
});
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const createUser = yield userServices_1.default.createUser(req.body);
    if (createUser.code == 201) {
        res.render('login', {
            loginUser: res.locals.loginUser,
            user: createUser
        });
    }
    else if (createUser.code == 409) {
        res.render('user_exist', { loginUser: res.locals.loginUser || null });
    }
    else {
        res.render('error', { loginUser: res.locals.loginUser || null });
    }
}));
router.get('/verify_email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqQuery = req.query;
    // console.log(reqQuery)
    const userVerification = yield userServices_1.default.verifyMail(reqQuery);
    res.render('login', { loginUser: res.locals.loginUser || null });
}));
router.get('/forgot_password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqQuery = req.query;
    // console.log(reqQuery)
    res.render('forgotPassword', { loginUser: res.locals.loginUser || null });
}));
router.get('/reset_password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqQuery = req.query;
    // console.log(reqQuery)
    res.render('resetPassword', { loginUser: res.locals.loginUser || null });
}));
router.post('/forgot_password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const forgotP = yield userServices_1.default.forgot_password(req.body.Email);
    if ((forgotP === null || forgotP === void 0 ? void 0 : forgotP.code) === 404) {
        res.render('404', { loginUser: res.locals.loginUser || null });
    }
    res.render('success', { loginUser: res.locals.loginUser || null });
}));
router.post('/reset_password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(req.query)
    const response = yield userServices_1.default.resetPassword({ Password: req.body.Password, Email: req.body.Email });
    if (response.code === 404) {
        res.render('404', { loginUser: res.locals.loginUser || null });
    }
    res.render('login', { loginUser: res.locals.loginUser || null });
}));
// login Section
router.get('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('login', { loginUser: res.locals.loginUser || null });
}));
router.post('/login', userMiddleware_1.validateLogin, limiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const loginUser = yield userServices_1.default.login(req.body.Email, req.body.Password);
    console.log(req.body);
    if (loginUser.code == 200) {
        res.cookie('jwt', (_a = loginUser.data) === null || _a === void 0 ? void 0 : _a.token, { maxAge: 60 * 60 * 1000 });
        res.redirect('home');
    }
    else if (loginUser.code == 404) {
        res.render('404', { loginUser: res.locals.loginUser || null });
    }
    else if (loginUser.code == 422) {
        res.render('wrongDetails', { loginUser: res.locals.loginUser || null });
    }
    else if (loginUser.code == 401) {
        res.render('verify', { loginUser: res.locals.loginUser || null });
    }
    else {
        res.render('error', { loginUser: res.locals.loginUser || null });
    }
}));
//Home route
router.get('/home', auth_1.default.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('home', { loginUser: res.locals.loginUser || null });
}));
router.post('/short_url', auth_1.default.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield urlServices_1.default.createShortUrl(req.body.Long_url, req.body.Custom_url, res.locals.loginUser._id);
    console.log(response);
    if (response.code === 201) {
        res.render('home_render', { Data: response });
    }
    else if (response.code === 409) {
        res.render('detail_exist', { loginUser: res.locals.loginUser || null });
    }
    else if (response.code === 400) {
        res.render('badRequest', { loginUser: res.locals.loginUser || null });
    }
    else {
        res.render('error', { loginUser: res.locals.loginUser || null });
    }
}));
router.get('/s.com/*', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    console.log(req.url);
    const reqBody = req.url;
    const reqParam = req.get('sec-ch-ua-platform');
    const reqParam2 = req.get('user-agent');
    const reqParam3 = req.url;
    const { id } = req.params;
    const dKey = `cache-${id}`;
    const response = yield urlServices_1.default.redirectCustom(reqBody, reqParam2, reqParam, reqParam3);
    const goto = `http://${(_b = response.data) === null || _b === void 0 ? void 0 : _b.Long_url}`;
    // Cache.set(dKey, goto, 48 * 60 * 60)
    res.redirect(goto);
}));
router.get('/history_list', auth_1.default.authenticate, cache_2.cacheMiddleWare, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield urlServices_1.default.historyList({ User_id: res.locals.loginUser._id });
    const dKey = `cache-${res.locals.loginUser._id}`;
    // console.log(response)
    if (response.code === 200) {
        cache_1.default.set(dKey, response, 1 * 60 * 60);
        res.render('history', { Data: response.data });
    }
    else if (response.code === 500) {
        res.render('error', { loginUser: res.locals.loginUser || null });
    }
    else {
        res.render('404', { loginUser: res.locals.loginUser || null });
    }
}));
router.get('/analytic', auth_1.default.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield urlServices_1.default.historyList({ User_id: res.locals.loginUser._id });
    // console.log(response)
    if (response.code === 200) {
        res.render('analystic', { Data: response.data });
    }
    else if (response.code === 500) {
        res.render('error', { loginUser: res.locals.loginUser || null });
    }
    else {
        res.render('noRecord', { loginUser: res.locals.loginUser || null });
    }
}));
router.post('/deleteOne/:id', auth_1.default.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    yield urlServices_1.default.deleteOne({ _id: id });
    res.redirect('/history_list');
}));
router.post('/delete', auth_1.default.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    yield urlServices_1.default.deleteAll({ User_id: res.locals.loginUser._id });
    res.redirect('/history_list');
}));
router.get('/analytic/:id', auth_1.default.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield urlServices_1.default.findLongUrl({ _id: req.params.id });
    if (response.code === 200) {
        res.render('analyticDetails', { Data: response.data });
    }
    else if (response.code === 500) {
        res.render('error', { loginUser: res.locals.loginUser || null });
    }
    else {
        res.render('noRecord', { loginUser: res.locals.loginUser || null });
    }
}));
// Logout Route
router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
});
exports.default = router;
