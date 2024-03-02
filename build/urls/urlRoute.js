"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../auth/auth"));
const urlController_1 = __importDefault(require("../urls/urlController"));
const cache_1 = require("../cach/cache");
const router = express_1.default.Router();
router.post('/short_url', auth_1.default.authenticateUser, urlController_1.default.createShortUrl
//     authenticateUser.authenticateUser, async (req: any, res: any) => {
//     const createUrl = await ShortUrl.createShortUrl(req.body,     req.userExist._id
//         )
//     res.status(200).json({createUrl})
// }
);
router.get('/s.com/:id', auth_1.default.authenticateUser, cache_1.cacheMiddleWare, urlController_1.default.redirectShortUrl
// async (req: any, res: any) => {
// const reqBody = req.params.id
// const reqParam = req.get('sec-ch-ua-platform')
// const reqParam2 = req.get('user-agent')
// const reqParam3 = req.url
// const { id } = req.params
// const dKey = `cache-${id}`
// const redirectShortUrl = await redirectUrl.redirectShortUrl(reqBody,reqParam2,reqParam, reqParam3)
// const goto = `http://${redirectShortUrl.data?.Long_url}`
// Cache.set(dKey,goto,24*60*60)
// res.redirect(goto)
// }
);
router.get('/history_list', auth_1.default.authenticateUser, urlController_1.default.historyList
// async (req: any, res: any) => {
// const allLinkList = await history.historyList({User_id:req.userExist._id})
// res.status(200).json({allLinkList})
// }
);
router.patch('/update/:id', auth_1.default.authenticateUser, urlController_1.default.editUrl
// async (req: any, res: any) => {
// const id = req.params.id
// const urlUpdate = await history.editUrl({_id:id}, req.body)
//     res.status(200).json({urlUpdate})
// // res.send('done')
// }
);
router.delete('/delete', auth_1.default.authenticateUser, urlController_1.default.deleteAll
// async (req: any, res: any) => {
// const id = req.userExist._id
// const urlDelete = await history.deleteAll({User_id:id})
// res.status(200).json({
//     massage: 'History List cleared',
// })
// }
);
router.delete('/deleteOneItem/:id', auth_1.default.authenticateUser, urlController_1.default.deleteOne
//     async (req: Request, res: Response) => {
//     const  id = req.params.id
//     const deleteOne = history.deleteOne({ _id: id })
//     res.status(200).json({massage:'Item Deleted',code:200})
// }
);
exports.default = router;
