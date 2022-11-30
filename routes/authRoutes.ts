import { Router } from "express";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import User from "../model/User";
import Todo from "../model/Todo";

const jwt = jsonwebtoken;
const privatekey: string = process.env.PRIVATEKEY || "MONKEYDLUFFY";

const router = Router();
router.post("/", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const hashPass = await bcrypt.hash(password, 10);
    const newuser = await User.create({ email: email, password: hashPass });
    res.status(200).json({ newuser, success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false });
  }
});

router.post("/loguser", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    // console.log(email, password);
    const user = await User.findOne({ email: email });
    if (!user) {
      res.json({ msg: "no user found", succss: false });
      return;
    }
    const passmatch = await bcrypt.compare(password, user.password);
    if (!passmatch) {
      res.json({ msg: "passno match", success: false });
      return;
    }
    const token = jwt.sign(JSON.stringify(user), privatekey);
    res.json({ user, token, success: true });
  } catch (err) {
    console.log(err);
    res.json({ success: false, msg: "something went wrong" });
  }
});

export default router;
