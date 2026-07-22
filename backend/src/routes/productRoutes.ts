import { Router } from "express";
import { 
  addProduct,
  getProducts,
  getProductById,
  updateProduct
} from "../controllers/productController";
import { verifyToken } from "../middleware/authMiddleware";

const router = Router();

router.post("/", verifyToken, addProduct);

router.get("/", verifyToken, getProducts);

router.get("/:id", verifyToken, getProductById);

router.put("/:id", verifyToken, updateProduct);

export default router;