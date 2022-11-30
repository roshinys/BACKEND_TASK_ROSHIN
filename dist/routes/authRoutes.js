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
const express_1 = require("express");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../model/User"));
const jwt = jsonwebtoken_1.default;
const privatekey = process.env.PRIVATEKEY || "MONKEYDLUFFY";
const router = (0, express_1.Router)();
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const hashPass = yield bcrypt_1.default.hash(password, 10);
        const newuser = yield User_1.default.create({ email: email, password: hashPass });
        res.status(200).json({ newuser, success: true });
    }
    catch (err) {
        console.log(err);
        res.json({ success: false });
    }
}));
router.post("/loguser", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        // console.log(email, password);
        const user = yield User_1.default.findOne({ email: email });
        if (!user) {
            res.json({ msg: "no user found", succss: false });
            return;
        }
        const passmatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passmatch) {
            res.json({ msg: "passno match", success: false });
            return;
        }
        const token = jwt.sign(JSON.stringify(user), privatekey);
        res.json({ user, token, success: true });
    }
    catch (err) {
        console.log(err);
        res.json({ success: false, msg: "something went wrong" });
    }
}));
exports.default = router;
