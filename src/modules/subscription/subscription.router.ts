import { Router } from "express";
import subscriptionController from "./subscription.controller";

const router = Router();

router.post("/create", subscriptionController.createSubscription);
router.get("/get-all-subscription", subscriptionController.getAllSubscription);
router.delete("/delete-subscription/:id", subscriptionController.deleteSubcription);
router.get("/all", subscriptionController.getAllSubscription);
router.post("/send-bulk", subscriptionController.sendBulkEmail);
router.post("/send-one/:id", subscriptionController.sendIndividualEmail);


const subscriptionRouter = router;
export default subscriptionRouter;


