import { Router } from "express";
import { 
  createChallan,
  getChallans
} from "../controllers/challanController";

import { verifyToken } from "../middleware/authMiddleware";


const router = Router();


router.post("/", verifyToken, createChallan);

router.get("/", verifyToken, getChallans);


export default router;