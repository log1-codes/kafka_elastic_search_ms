import express, { NextFunction, Request, Response } from 'express'
import { CatalogRepository } from '../repository/catalog.repository';
import { CatalogService } from '../services/catalog.service';
import { RequestValidator } from '../utils/requestValidator';
import { CreateProductRequest } from '../dto/product.dto';
import { UpdateProductRequest } from '../dto/product.dto';
const router = express.Router();

export const catalogService = new CatalogService(new CatalogRepository())


router.post("/products", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { errors, input } = await RequestValidator(CreateProductRequest, req.body)
        if (errors) {
            return res.status(400).json(errors)
        }
        const data = await catalogService.createProduct(input)
        return res.status(201).json(data);
    } catch (error) {
        const err = error as Error
        res.status(500).json(err.message)
    }
})


router.patch("/products/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { errors, input } = await RequestValidator(UpdateProductRequest, req.body)
        const id = parseInt(
            Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id,
            10
        );
        // console.log(req.params)
        //   const id = parseInt(req.params.id[0]); 
        if (errors) {
            return res.status(400).json(errors)
        }
        const data = await catalogService.updateProduct({id, ...input}) ; 

        return res.status(200).json(data);
    } catch (error) {
        const err = error as Error
        res.status(500).json(err.message)
    }
})
export default router; 