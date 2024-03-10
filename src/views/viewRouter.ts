
import express, { Express, Request, Response } from 'express'
import userController from '../users/userServices'
import urlServices from '../urls/urlServices'
import { validateLogin, validateUser } from "../users/userMiddleware"
import cookieParser from 'cookie-parser'
import auth from '../auth/auth'
import rateLimit from 'express-rate-limit'
import Cache from '../cach/cache'
import { cacheMiddleWare } from '../cach/cache'





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
router.get('/index2', async (req, res) => {
	res.render('dex2', {
		loginUser: res.locals.loginUser || null,
	});
});
router.get('/index', async (req, res) => {
	res.render('index', {
		loginUser: res.locals.loginUser || null,
	});
});


// signup
router.get('/signup', (req, res) => {
	res.render('signup', { loginUser: res.locals.loginUser || null });
});





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
router.get('/forgot_password', async (req: any, res: any) => {

	const reqQuery = req.query
	// console.log(reqQuery)

	res.render('forgotPassword',{ loginUser: res.locals.loginUser || null })
	

	
})
router.get('/reset_password', async (req: any, res: any) => {

	const reqQuery = req.query
	// console.log(reqQuery)

	res.render('resetPassword',{ loginUser: res.locals.loginUser || null })
	

	
})


router.post('/forgot_password', async (req: any, res: any) => {
	
	const forgotP = await userController.forgot_password(req.body.Email)
	if (forgotP?.code === 404) {
		res.render('404',{ loginUser: res.locals.loginUser || null })
	}
	
	res.render('success',{ loginUser: res.locals.loginUser || null })
})


router.post('/reset_password', async (req: any, res: any) => {
	// console.log(req.query)
	const response = await userController.resetPassword({ Password: req.body.Password, Email: req.body.Email })
	if (response.code === 404) {
		res.render('404',{ loginUser: res.locals.loginUser || null })

	}
	res.render('login',{ loginUser: res.locals.loginUser || null })
})

// login Section
router.get('/login', async(req, res) => {
	res.render('login', { loginUser: res.locals.loginUser || null });
});

router.post('/login',validateLogin,limiter, async (req: Request, res: any) => {
	
	const loginUser = await userController.login(req.body.Email,req.body.Password)
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

 //Home route
router.get('/home', auth.authenticate, async (req, res) => {
	res.render('home',{ loginUser: res.locals.loginUser || null } );
});



router.post('/short_url', auth.authenticate, async (req: any, res: any) => {
	const response = await urlServices.createShortUrl(req.body.Long_url, req.body.Custom_url, res.locals.loginUser._id)
	console.log(response)
	
	if (response.code === 201) {

		res.render('home_render',{Data:response})
		
	} else if (response.code === 409) {
		res.render('detail_exist',{loginUser: res.locals.loginUser || null})

	} else if (response.code === 400) {
		res.render('badRequest',{loginUser: res.locals.loginUser || null})

	} else {
		res.render('error',{loginUser: res.locals.loginUser || null})
	}
	
})


router.get('/s.com/*', async (req: any, res: any) => {

	console.log(req.url)
	 const reqBody = req.url
    const reqParam = req.get('sec-ch-ua-platform')
    const reqParam2 = req.get('user-agent')
    const reqParam3 = req.url
    const { id } = req.params
	const dKey = `cache-${id}`
	const response = await urlServices.redirectCustom(reqBody, reqParam2, reqParam, reqParam3)
	const goto = `http://${response.data?.Long_url}`
	// Cache.set(dKey, goto, 48 * 60 * 60)
	

	res.redirect(goto)
})
router.get('/history_list', auth.authenticate, cacheMiddleWare, async (req: any, res: any) => {
	
	const response = await urlServices.historyList({ User_id: res.locals.loginUser._id })
	const dKey = `cache-${res.locals.loginUser._id}`
	// console.log(response)
	if (response.code === 200) {
		Cache.set(dKey, response, 1 * 60 * 60)

		res.render('history',{Data: response.data})
	} else if (response.code === 500) {
		res.render('error',{loginUser: res.locals.loginUser || null})
	} else  {
		res.render('404',{loginUser: res.locals.loginUser || null})

	}
	
})
router.get('/analytic',auth.authenticate, async (req: any, res: any) => {
	const response = await urlServices.historyList({ User_id: res.locals.loginUser._id })
	// console.log(response)
	if (response.code === 200) {
		
		res.render('analystic',{Data: response.data})
	} else if (response.code === 500) {
		res.render('error',{loginUser: res.locals.loginUser || null})
	} else  {
		res.render('noRecord',{loginUser: res.locals.loginUser || null})

	}
	
})


router.post('/deleteOne/:id', auth.authenticate, async (req: any, res: any) => {
	 
	    const  id = req.params.id
	     await urlServices.deleteOne({ _id:id })
	res.redirect('/history_list')
	

		
})
router.post('/delete', auth.authenticate, async (req: any, res: any) => {
	console.log(req.body)
	await urlServices.deleteAll({ User_id: res.locals.loginUser._id })
	
		res.redirect('/history_list')

	
})
router.get('/analytic/:id', auth.authenticate,async (req: any,res: any) => {
	const response = await urlServices.findLongUrl({ _id: req.params.id })
	if (response.code === 200) {
		res.render('analyticDetails',{Data:response.data})
	} else if (response.code === 500) {
		res.render('error',{loginUser: res.locals.loginUser || null})

	} else {
		res.render('noRecord',{loginUser: res.locals.loginUser || null})

	}
	

})
	

// Logout Route
router.get('/logout', (req, res) => {
	res.clearCookie('jwt');
	res.redirect('/');
});

export default  router;
