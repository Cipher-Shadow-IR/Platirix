const { Router } = require("express");
const orderController = require("../controllers/orderController");
const { validate } = require("../middleware/validate");
const { z } = require("zod");

const router = Router();

const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"]),
});

const createOrderSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(255),
  customerAddress: z.string().min(1, "Address is required"),
  customerPhone: z.string().min(1, "Phone is required").max(20),
});

router.get("/", orderController.list);
router.get("/:id", orderController.getById);
router.post("/", validate(createOrderSchema), orderController.create);
router.patch("/:id/status", validate(statusSchema), orderController.updateStatus);

router.post("/advance", orderController.advanceStatus);

module.exports = router;
