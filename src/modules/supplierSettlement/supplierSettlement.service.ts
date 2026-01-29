import Order from "../order/order.model";
import { SupplierSettlement } from "./supplierSettlement.model";

const getAllSupplierSettlements = async () => {
  const result = await SupplierSettlement.find()
    .populate({
      path: "orderId",
      model: Order, // 👈 force exact model
      select: "orderNumber totalAmount orderStatus paymentStatus",
    })
    .populate({
      path: "supplierId",
      select: "name email shopName brandName",
    });

  return result;
};

const supplierSettlementService = {
  getAllSupplierSettlements,
};

export default supplierSettlementService;
