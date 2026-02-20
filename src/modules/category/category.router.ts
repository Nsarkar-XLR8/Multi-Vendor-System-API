import { Router } from "express";
import { upload } from "../../middleware/multer.middleware";
import categoryController from "./category.controller";

const router = Router();

router.post("/create", upload.any(), categoryController.createCategory);

router.get("/get-all", categoryController.getCategories);
router.put("/update/:id", upload.any(), categoryController.updateCategory);
router.get("/get-region", categoryController.getCategoryRegion);

const categoryRouter = router;
export default categoryRouter;
