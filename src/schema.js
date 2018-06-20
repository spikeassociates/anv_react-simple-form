import Joi from "joi";

export default Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
  surname: Joi.string().alphanum(),
  person0: Joi.object({
    email: Joi.string().required(),
    name: Joi.string().required()
  })
});
