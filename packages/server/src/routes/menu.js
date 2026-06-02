const { Router } = require("express");
const menuController = require("../controllers/menuController");
const { validate } = require("../middleware/validate");
const { z } = require("zod");

const router = Router();

const createSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  price: z.number().positive(),
  categoryId: z.number().int().positive().optional(),
  imageUrl: z.string().url().optional(),
});

router.get("/", menuController.list);
router.get("/:id", menuController.getById);
router.post("/", validate(createSchema), menuController.create);

module.exports = router;
