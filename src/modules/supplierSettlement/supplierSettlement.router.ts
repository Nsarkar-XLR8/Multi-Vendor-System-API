import { Router } from "express";
import supplierSettlementController from "./supplierSettlement.controller";

const router = Router();

router.get("/all", supplierSettlementController.getAllSupplierSettlements);

const supplierSettlementRouter = router;
export default supplierSettlementRouter;
