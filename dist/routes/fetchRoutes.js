"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authenticate_1 = require("../middleware/authenticate");
const fetchControllers_1 = require("../controllers/fetchControllers");
const router = (0, express_1.Router)();
router.get("/", authenticate_1.authenticate, fetchControllers_1.fetchTodo);
exports.default = router;
