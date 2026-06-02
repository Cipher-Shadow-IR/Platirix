function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const error = new Error("Validation failed");
      error.status = 400;
      error.expose = true;
      error.details = result.error.flatten().fieldErrors;
      return next(error);
    }
    req.validatedBody = result.data;
    next();
  };
}

module.exports = { validate };
