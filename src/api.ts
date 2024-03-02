import express, { Express, Request, Response,NextFunction } from "express";
import dotenv from "dotenv";
import { connect } from './db';
// import user from "./users/userServices"
// import user from "./users/userServices"

import authenticateUser from './auth/auth'
import router from "./users/userRoute";
import urlRoute from "./urls/urlRoute";
import { logger } from "./logger";
import viewRouter from './views/viewRouter'
import path from "path";
import cookieParser from "cookie-parser";


dotenv.config();

const app: Express = express();
// const redis = new Redis()

const port = process.env.PORT;
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())

app.use('/public' ,express.static(path.join(__dirname,'public')));
app.use('/public' ,express.static(path.join(__dirname,'reset.html')));
app.set('views',path.join(__dirname,'views'))

app.set('view engine', 'ejs');

app.get('/', async(req: Request, res: Response) => {
	
	res.send('Welcome to Url Shortrner');
});
app.use('/user', router)
app.use('/s', urlRoute)
app.use('/',viewRouter)

app.get('*', (req:Request, res:Response) => {
	res.status(404).json({
		data: null,
		massage: 'Route Not Found',
	});
});

app.use((err:any, req:Request, res:Response, next:NextFunction) => {
	res.status(500).json({
		data: null,
		error: err.stack,
	});
});
connect(process.env.DB_URL)

app.listen(port, () => {
	logger.info('[Server]=> Started');
});
