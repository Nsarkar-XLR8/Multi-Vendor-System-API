import { Router } from "express";
import wholeSaleController from "./wholeSale.controller";

const router = Router();

router.post("/add", wholeSaleController.addInWholeSale);
router.get("/all", wholeSaleController.getAllWholeSale);
// router.get("/single/:id", wholeSaleController.getSingleWholeSale);
router.put("/update/:id", wholeSaleController.updateWholeSale);
// router.delete("/delete/:id", wholeSaleController.deleteWholeSale);

const wholeSaleRouter = router;
export default wholeSaleRouter;
