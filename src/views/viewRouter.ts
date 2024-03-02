// const express = require('express');
// const controller = require('../user/userService');
// const cookieParser = require('cookie-parser');
// const { authenticate, authenticateUser } = require('../authorization/index');
// const upCominBDays = require('../utility/birthday');
// const birth_details = require('../birthDetails/birthServices');
import express, { Express, Request, Response } from 'express'
import userController from '../users/userServices'
import { validateLogin, validateUser } from "../users/userMiddleware"
import cookieParser from 'cookie-parser'
import auth from '../auth/auth'
import rateLimit from 'express-rate-limit'





const router = express.Router();
router.use(cookieParser());
const limiter = rateLimit({
    windowMs: 30 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders:false
})
// Index 
router.get('/', async (req, res) => {
	res.render('index', {
		loginUser: res.locals.loginUser || null,
	});
});

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

router.post("/signup", async (req: any, res: any) => {

	console.log(req.body)
	const createUser = await userController.createUser(req.body)
	
	if (createUser.code == 201) {
		
		res.render('login', {
			loginUser: res.locals.loginUser,
			user: createUser
		})
	} else if (createUser.code == 409) {
		res.render('user_exist', { loginUser: res.locals.loginUser || null })
		
	} else {
		res.render('error', { loginUser: res.locals.loginUser || null })
		
	}
})



router.get('/verify_email', async (req: any, res: any) => {

	const reqQuery = req.query
	// console.log(reqQuery)
	const userVerification = await userController.verifyMail(reqQuery)

	res.render('login',{ loginUser: res.locals.loginUser || null })
	

	
})

// login Section
router.get('/login', async(req, res) => {
	res.render('login', { loginUser: res.locals.loginUser || null });
});
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
router.post('/login',validateLogin, limiter, async (req: Request, res: any) => {
	
	const loginUser = await userController.login(req.body)
	console.log(req.body)
	if (loginUser.code == 200) {
		
		res.cookie('jwt', loginUser.data?.token, { maxAge: 60 * 60 * 1000 });
		res.redirect('home');
	} else if (loginUser.code == 404) {
		res.render('404', { loginUser: res.locals.loginUser || null })
		
	} else if (loginUser.code == 422) {
		res.render('wrongDetails', { loginUser: res.locals.loginUser || null })
		
	} else if (loginUser.code == 401) {
		res.render('verify', { loginUser: res.locals.loginUser || null })
	}
	else {
		res.render('error', { loginUser: res.locals.loginUser || null })
	}
})


// //Home route
router.get('/home', auth.authenticate, async (req, res) => {
	


	res.render('home' );
});
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

export default  router;
