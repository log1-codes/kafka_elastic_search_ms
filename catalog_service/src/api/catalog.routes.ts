
import express, { Request, Response } from 'express';
import { CatalogRepository } from '../repository/catalog.repository';
import { CatalogService } from '../services/catalog.service';
import { RequestValidator } from '../utils/requestValidator';
import {
    CreateProductRequest,
    UpdateProductRequest,
} from '../dto/product.dto';

const router = express.Router();

export const catalogService = new CatalogService(
    new CatalogRepository()
);
const parseProductId = (
    idParam: string | string[]
): number | null => {
    const value = Array.isArray(idParam) ? idParam[0] : idParam;

    if (!value || !/^\d+$/.test(value)) {
        return null;
    }

    const id = Number(value);

    if (!Number.isSafeInteger(id) || id <= 0) {
        return null;
    }

    return id;
};
router.post(
    '/products',
    async (req: Request, res: Response) => {
        try {
            const { errors, input } = await RequestValidator(
                CreateProductRequest,
                req.body
            );

            if (errors) {
                return res.status(400).json(errors);
            }

            const data = await catalogService.createProduct(input);

            return res.status(201).json(data);
        } catch (error) {
            const err = error as Error;

            return res.status(500).json({
                message: err.message,
            });
        }
    }
);

router.patch(
    '/products/:id',
    async (req: Request, res: Response) => {
        const id = parseProductId(req.params.id);

        if (id === null) {
            return res.status(400).json({
                message: 'Invalid product ID',
            });
        }

        try {
            const { errors, input } = await RequestValidator(
                UpdateProductRequest,
                req.body
            );

            if (errors) {
                return res.status(400).json(errors);
            }

            const data = await catalogService.updateProduct({
                id,
                ...input,
            });

            if (!data) {
                return res.status(404).json({
                    message: 'Product not found',
                });
            }

            return res.status(200).json(data);
        } catch (error) {
            const err = error as Error;

            return res.status(500).json({
                message: err.message,
            });
        }
    }
);

router.get(
    '/products',
    async (req: Request, res: Response) => {
        const limit =
            req.query.limit === undefined
                ? 10
                : Number(req.query.limit);

        const offset =
            req.query.offset === undefined
                ? 0
                : Number(req.query.offset);

        if (
            !Number.isInteger(limit) ||
            limit < 1 ||
            !Number.isInteger(offset) ||
            offset < 0
        ) {
            return res.status(400).json({
                message:
                    'limit must be a positive integer and offset must be a non-negative integer',
            });
        }

        try {
            const data = await catalogService.getProducts(
                limit,
                offset
            );

            return res.status(200).json(data);
        } catch (error) {
            const err = error as Error;

            return res.status(500).json({
                message: err.message,
            });
        }
    }
);

router.get(
    '/products/:id',
    async (req: Request, res: Response) => {
        const id = parseProductId(req.params.id);

        if (id === null) {
            return res.status(400).json({
                message: 'Invalid product ID',
            });
        }

        try {
            const data = await catalogService.getProduct(id);

            if (!data) {
                return res.status(404).json({
                    message: 'Product not found',
                });
            }

            return res.status(200).json(data);
        } catch (error) {
            const err = error as Error;

            return res.status(500).json({
                message: err.message,
            });
        }
    }
);

router.delete(
    '/products/:id',
    async (req: Request, res: Response) => {
        const id = parseProductId(req.params.id);

        if (id === null) {
            return res.status(400).json({
                message: 'Invalid product ID',
            });
        }

        try {
            const data = await catalogService.deleteProduct(id);

            if (!data) {
                return res.status(404).json({
                    message: 'Product not found',
                });
            }

            return res.status(200).json(data);
        } catch (error) {
            const err = error as Error;

            return res.status(500).json({
                message: err.message,
            });
        }
    }
);

export default router;
