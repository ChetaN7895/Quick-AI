import express from "express";
import { auth } from "../middleware/auth.js";
import { 
  getUserCreations, 
  getPublishedCreations, 
  toggleLikeCreations 
} from "../controller/userController.js";

const userRouter = express.Router();

// ✅ Routes
userRouter.get("/get-user-creations", auth, getUserCreations);
userRouter.get("/get-published-creations", auth, getPublishedCreations);
userRouter.post("/toggle-like-creation", auth, toggleLikeCreations);

export default userRouter;
