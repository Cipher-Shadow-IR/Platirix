const { Router } = require("express");
const cartController = require("../controllers/cartController");
const { validate } = require("../middleware/validate");
const { z } = require("zod");

const router = Router();

const addSchema = z.object({
  menuItemId: z.number().int().positive(),
  quantity: z.number().int().positive().default(1),
});

const updateSchema = z.object({
  quantity: z.number().int().positive(),
});

router.get("/", cartController.list);
router.post("/", validate(addSchema), cartController.add);
router.patch("/:id", validate(updateSchema), cartController.update);
router.delete("/:id", cartController.remove);

module.exports = router;
