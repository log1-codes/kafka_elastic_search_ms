import express, { NextFunction, Request, Response } from 'express'
import { CatalogRepository } from '../repository/catalog.repository';
import { CatalogService } from '../services/catalog.service';
import { RequestValidator } from '../utils/requestValidator';
import { CreateProductRequest } from '../dto/product.dto';
import { UpdateProductRequest } from '../dto/product.dto';
import { parse } from 'node:path';
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
        const data = await catalogService.updateProduct({ id, ...input });

        return res.status(200).json(data);
    } catch (error) {
        const err = error as Error
        res.status(500).json(err.message)
    }
})

router.get(
    "/products",
    async (req: Request, res: Response, next: NextFunction) => {
        const limit = req.query.limit === undefined
            ? 10
            : Number(req.query.limit);

        const offset = req.query.offset === undefined
            ? 0
            : Number(req.query.offset);

        if (
            !Number.isInteger(limit) ||
            limit < 1 ||
            !Number.isInteger(offset) ||
            offset < 0
        ) {
            return res.status(400).json({
                message: "limit must be a positive integer and offset must be a non-negative integer",
            });
        }

        try {
            const data = await catalogService.getProducts(limit, offset);
            return res.status(200).json(data);
        } catch (error) {
            const err = error as Error;
            return res.status(500).json(err.message);
        }
    }
);

router.get(
    "/products/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id[0])
        if(!id)
        {
            return res.status(500).json("Invalid product ID")
        }
        try {
            const data = await catalogService.getProduct(id);
            return res.status(200).json(data);
        } catch (error) {
            const err = error as Error;
            return res.status(500).json(err.message);
        }
    }
);

router.delete(
    "/products/:id",
    async (req: Request, res: Response, next: NextFunction) => {
        const id = parseInt(req.params.id[0])
        if(!id)
        {
            return res.status(500).json("Invalid product ID")
        }
        try {
            const data = await catalogService.deleteProduct(id);
            return res.status(200).json(data);
        } catch (error) {
            const err = error as Error;
            return res.status(500).json(err.message);
        }
    }
);


export default router;
