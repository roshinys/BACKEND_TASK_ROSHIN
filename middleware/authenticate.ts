import * as jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

const privatekey: string = process.env.PRIVATEKEY || "MONKEYDLUFFY";
interface IGetUserAuthInfoRequest extends Request {
  user: JSON;
}

export const authenticate = (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header("Authorization")!;
    const user: any = jwt.verify(token, privatekey);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    return res.status(401).json({ success: false });
  }
};

// export default authenticate;
