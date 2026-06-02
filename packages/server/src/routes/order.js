const { Router } = require("express");
const orderController = require("../controllers/orderController");
const { validate } = require("../middleware/validate");
const { z } = require("zod");

const router = Router();

const statusSchema = z.object({
  status: z.enum(["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"]),
});

router.get("/", orderController.list);
router.get("/:id", orderController.getById);
router.post("/", orderController.create);
router.patch("/:id/status", validate(statusSchema), orderController.updateStatus);

module.exports = router;
