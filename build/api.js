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
const userController_1 = __importDefault(require("./users/userController"));
const userRoute_1 = __importDefault(require("./users/userRoute"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(express_1.default.json());
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // await user.createUser(req.body)
    console.log(req.body);
    const cUser = yield userController_1.default.createUser(req.body);
    // console.log(cUser)
    res.send('Express+TypeScript');
}));
app.use('/user', userRoute_1.default);
// app.post('/login',authenticateUser,async (req:Request,res:Response) => {
// 	// console.log(authenticate.authenticateUser)
// 	console.log(Headers)
// 	return {
// 		massage:' okays'
// 	}
// })
(0, db_1.connect)(process.env.DB_URL);
app.listen(port, () => {
    console.log('Server Started');
});
