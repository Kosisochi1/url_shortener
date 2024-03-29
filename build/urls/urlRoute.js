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
router.post('/short_url', auth_1.default.authenticate, urlController_1.default.createShortUrl
//     authenticateUser.authenticateUser, async (req: any, res: any) => {
//     const createUrl = await ShortUrl.createShortUrl(req.body,     req.userExist._id
//         )
//     res.status(200).json({createUrl})
// }
);
router.get('/s.com/:id', auth_1.default.authenticate, cache_1.cacheMiddleWare, urlController_1.default.redirectShortUrl);
router.get('/history_list', auth_1.default.authenticateUser, urlController_1.default.historyList);
router.patch('/update/:id', auth_1.default.authenticateUser, urlController_1.default.editUrl);
router.delete('/delete', auth_1.default.authenticateUser, urlController_1.default.deleteAll);
router.delete('/deleteOneItem/:id', auth_1.default.authenticateUser, urlController_1.default.deleteOne);
exports.default = router;
