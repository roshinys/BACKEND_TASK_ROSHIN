"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticate_1 = __importDefault(require("../middleware/authenticate"));
const jwt = jsonwebtoken_1.default;
const privatekey = process.env.PRIVATEKEY || "MONKEYDLUFFY";
const router = (0, express_1.Router)();
router.get("/", authenticate_1.default, (req, res) => {
    res.json({ msg: "fetch all" });
});
exports.default = router;
