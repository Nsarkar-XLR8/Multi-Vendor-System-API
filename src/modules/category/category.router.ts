import { Router } from "express";
import { upload } from "../../middleware/multer.middleware";
import categoryController from "./category.controller";

const router = Router();

router.post(
  "/create",
  upload.fields([
    { name: "productImage", maxCount: 1 },
    { name: "regionImage", maxCount: 1 },
  ]),
  categoryController.createCategory
);

router.get("/get-all", categoryController.getCategories);
router.put(
  "/update/:id",
  upload.fields([
    { name: "productImage", maxCount: 1 },
    { name: "regionImage", maxCount: 1 },
  ]),
  categoryController.updateCategory
);

const categoryRouter = router;
export default categoryRouter;
