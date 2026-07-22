import { Router } from "express";
import {
  addCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
} from "../controllers/customerController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", verifyToken, addCustomer);
router.get("/", verifyToken, getCustomers);
router.get("/:id", verifyToken, getCustomerById);
router.put("/:id", verifyToken, updateCustomer);

export default router;