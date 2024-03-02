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
// const express = require('express');
// const controller = require('../user/userService');
// const cookieParser = require('cookie-parser');
// const { authenticate, authenticateUser } = require('../authorization/index');
// const upCominBDays = require('../utility/birthday');
// const birth_details = require('../birthDetails/birthServices');
const express_1 = __importDefault(require("express"));
const userServices_1 = __importDefault(require("../users/userServices"));
const userMiddleware_1 = require("../users/userMiddleware");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_1 = __importDefault(require("../auth/auth"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
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
// signup
router.get('/signup', (req, res) => {
    res.render('signup', { loginUser: res.locals.loginUser || null });
});
// router.post('/signup', async (req, res) => {
// 	console.log(req.body);
// 	const response = await controller.createUser({
// 		Username: req.body.Username,
// 		DoB: req.body.DoB,
// 		Email: req.body.Email,
// 		Password: req.body.Password,
// 	});
// 	if (response.code == 201) {
// 		res.render('index', {
// 			loginUser: res.locals.loginUser || null,
// 			quotes: ` "${quote.text}" `,
// 		});
// 	} else if (response.code == 409) {
// 		res.render('user_exist', { loginUser: res.locals.loginUser || null });
// 	} else {
// 		res.render('error', { loginUser: res.locals.loginUser || null });
// 	}
// });
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
// login Section
router.get('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('login', { loginUser: res.locals.loginUser || null });
}));
// router.post('/login', async (req, res) => {
// 	const response = await controller.loginUser({
// 		Email: req.body.email,
// 		Password: req.body.password,
// 	});
// 	if (response.code === 200) {
// 		res.cookie('jwt', response.data.token, { maxAge: 60 * 60 * 1000 });
// 		res.redirect('home');
// 	} else if (response.code == 404) {
// 		res.render('404', { loginUser: res.locals.loginUser || null });
// 	} else if (response.code == 422) {
// 		res.render('wrongDetails', { loginUser: res.locals.loginUser || null });
// 	} else {
// 		res.render('error', { loginUser: res.locals.loginUser || null });
// 	}
// });
router.post('/login', userMiddleware_1.validateLogin, limiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const loginUser = yield userServices_1.default.login(req.body);
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
// //Home route
router.get('/home', auth_1.default.authenticate, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('home');
}));
// //Root directory
// router.get('/', async (req, res) => {
// 	quote = getQuote({ author: false });
// 	//
// 	res.render('index', {
// 		loginUser: res.locals.loginUser || null,
// 		quotes: ` "${quote.text}" `,
// 	});
// });
// //Create Birthday Details
// router.get('/addDetails', authenticate, (req, res) => {
// 	res.render('birthDayDetails', { loginUser: res.locals.loginUser });
// });
// router.post('/addDetails', authenticate, async (req, res) => {
// 	quote = getQuote();
// 	const response = await birth_details.createBDdetails({
// 		Name: req.body.Name,
// 		Email: req.body.Email,
// 		DoB: req.body.DoB,
// 		user_id: res.locals.loginUser._id,
// 	});
// 	console.log(response);
// 	if (response.code === 201) {
// 		res.redirect('home');
// 	} else if (response.code === 409) {
// 		res.render('detail_exist', { loginUser: res.locals.loginUser || null });
// 	}
// });
// // Logout Route
// router.get('/logout', (req, res) => {
// 	res.clearCookie('jwt');
// 	res.redirect('/');
// });
exports.default = router;
