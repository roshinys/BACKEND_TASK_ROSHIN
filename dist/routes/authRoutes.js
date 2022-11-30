"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const authControllers_2 = require("../controllers/authControllers");
const router = (0, express_1.Router)();
router.post("/", authControllers_1.regUser);
router.post("/loguser", authControllers_2.logUser);
exports.default = router;
