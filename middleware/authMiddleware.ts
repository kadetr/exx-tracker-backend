import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import { IUserRequest } from '../types/custom';

const protect = asyncHandler(async (req: IUserRequest, res: Response, next: NextFunction) => {
   let token;

   if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
   ) {
      try {
         token = req.headers.authorization.split(" ")[1];
         
         const decoded = jwt.verify(token, process.env.JWT_SECRET as string ) as JwtPayload;

         req.user = await User.findById(decoded.id).select("-password") ?? undefined;

         next();
      } catch (error) {
         res.status(401);
         throw new Error("Not authorized, token failed");
      }
   }

   if (!token) {
      res.status(401);
      throw new Error("Not authorized, no token");
   }
});

const admin = (req: IUserRequest, res: Response , next: NextFunction) => {
   if (req.user && req.user.isAdmin) {
      next();
   } else {
      res.status(401);
      throw new Error("Not authorized as an admin");
   }
};

export { protect, admin };
