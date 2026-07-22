import { Router } from "express";
import {
  addStockMovement,
  getStockMovements
} from "../controllers/stockController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", verifyToken, addStockMovement);

router.get("/", verifyToken, getStockMovements);

export default router;