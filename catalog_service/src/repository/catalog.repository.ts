import { IcatalogRepository } from "../interface/catalogRepository.interface";
import { Product } from "../models/product.model";
import { prisma } from "../prisma";
export class CatalogRepository implements IcatalogRepository {
    _prisma = prisma;
    async create(data: any): Promise<Product> {
        return this._prisma.product.create({
            data
        })
    }
    async update(data: any): Promise<Product> {
        return this._prisma.product.update({
            where: {
                id: data.id
            },
            data: data
        })
    }
    async delete(id: any): Promise<Product> {
        return this._prisma.product.delete({ where: { id } })
    }
    async find(limit: number, offset: number): Promise<Product[]> {
        return this._prisma.product.findMany({
            take: limit,
            skip: offset
        })
    }
    async findOne(id: number): Promise<Product> {
        const product = await this._prisma.product.findFirst({ where: { id } });
        if (product) {
            return Promise.resolve(product);
        }
        throw new Error("product not find")
    }

}