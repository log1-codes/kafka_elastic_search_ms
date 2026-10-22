import { IcatalogRepository } from "../interface/catalogRepository.interface";
import { Product } from "../models/product.model";
import { ProductFactory } from "../utils/fixtures";

export class CatalogRepository implements IcatalogRepository {

    async create(data: any): Promise<Product> {

        const product = ProductFactory.build();

        return Promise.resolve(product)
    }
    async update(data: any): Promise<Product> {
        const product = ProductFactory.build();

        return Promise.resolve(product)
    }
    async delete(id: any): Promise<Product> {
        const product = ProductFactory.build();

        return Promise.resolve(product)
    }
    async find(limit: number, offset: number): Promise<Product[]> {
        const product = ProductFactory.buildList(limit);

        return Promise.resolve(product)
    }
    findOne(id: number): Promise<Product> {
        const product = ProductFactory.build(); 

        return Promise.resolve(product)

    }

}