import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../model/User";
import jsonwebtoken from "jsonwebtoken";

const jwt = jsonwebtoken;
const privatekey: string = process.env.PRIVATEKEY || "MONKEYDLUFFY";

export const regUser = async (req: Request, res: Response) => {
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
};

export const logUser = async (req: Request, res: Response) => {
  try {
    const email: string = req.body.email;
    const password: string = req.body.password;
    console.log(email, password);
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
};
// module.exports = {
//   regUser,
//   logUser,
// };
// export default {
//   regUser,
//   logUser,
// };
