import { Router } from "express";
import reportsController from "./reports.controller";

const router = Router();

router.get("/top-buyers", reportsController.getTopBuyers);

const reportsRouter = router;
export default reportsRouter;
