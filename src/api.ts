import express, { Express, Request, Response,NextFunction } from "express";
import dotenv from "dotenv";
import { connect } from './db';
import user from "./users/userController"
import authenticateUser from './auth/auth'
import router from "./users/userRoute";
import urlRoute from "./urls/urlRoute";

dotenv.config();

const app:Express = express();
const port = process.env.PORT;
app.use(express.json())

app.post('/', async(req: Request, res: Response) => {
	
	// await user.createUser(req.body)
	console.log(req.body)
	const cUser = await user.createUser(req.body)
	// console.log(cUser)
	res.send('Express+TypeScript');
});
app.use('/user', router)
app.use('/url',urlRoute)
// app.post('/login',authenticateUser,async (req:Request,res:Response) => {
// 	// console.log(authenticate.authenticateUser)
// 	console.log(Headers)
// 	return {
// 		massage:' okays'
// 	}
// })
connect(process.env.DB_URL)

app.listen(port, () => {
	console.log('Server Started');
});
