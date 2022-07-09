import responseFormat from '@shared/responseFormat';
import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
const schemas = {
  signUpSchema: Joi.object({
    email: Joi.string()
      .email()
      .lowercase()
      .required(),
    password: Joi.string()
      .min(6)
      .required(),
    confirm_password: Joi.ref('password'),
    name: Joi.string().min(3).required()
  }),
  signInSchema: Joi.object({
    email: Joi.string()
      .email()
      .lowercase()
      .required(),
    password: Joi.string()
      .min(6)
      .required(),
  }),

  createProduct: Joi.object({
    name: Joi.string()
      .required(),
    sku: Joi.string(),
    weight: Joi.number()
      .required(),
    height: Joi.number()
      .required(),
    length: Joi.number()
      .required(),
    width: Joi.number()
      .required(),
    weightUnit: Joi.string()
      .required(),
    dimensionUnit: Joi.string()
      .required(),
    importPrice: Joi.number()
      .min(1),
    exportPrice: Joi.number()
      .min(1),
    type: Joi.string()
      .required(),
    quantity: Joi.number()
      .required(),
    description: Joi.string(),
    branch: Joi.string(),
    inventoryNumber: Joi.number(),
    image: Joi.string(),
    images: Joi.array()
      .items(Joi.string()),
    isAllowSell: Joi.bool(),
  }),

  updateProduct: Joi.object({
    name: Joi.string(),
    sku: Joi.string(),
    weight: Joi.number(),
    weightUnit: Joi.string(),
    importPrice: Joi.number()
      .min(1),
    exportPrice: Joi.number()
      .min(1),
    type: Joi.string(),
    description: Joi.string(),
    branch: Joi.string(),
    inventoryNumber: Joi.number(),
    images: Joi.array()
      .items(Joi.string()),
    isAllowSell: Joi.bool(),
    height: Joi.number(),
    length: Joi.number(),
    width: Joi.number(),
    dimensionUnit: Joi.string(),
    quantity: Joi.number(),
    image: Joi.string(),
  }),

  createPostTemplate: Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required()
  }),
  updatePostTemplate: Joi.object({
    title: Joi.string(),
    content: Joi.string()
  }),
  deleteManyTemplate: Joi.object({
    templateIds: Joi.array().items(Joi.string()).required()
  }),
  createFavoriteKeyword: Joi.object({
    content: Joi.string().required().min(1)
  }),
  deleteManyKeyword: Joi.object({
    keywordIds: Joi.array().items(Joi.string()).required()
  }),
}

function validate(schema: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validateAsync(req.body, { allowUnknown: true });
      next();
    } catch (error) {
      res.json(responseFormat(false, { message: error.message }));
    }
  }
}

export { validate, schemas };