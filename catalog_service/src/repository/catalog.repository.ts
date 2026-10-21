import { IcatalogRepository } from "../interface/catalogRepository.interface";
import { Product } from "../models/product.model";

export class CatalogRepository implements IcatalogRepository{ 
    
    create(data: any) : Promise<Product> {
        throw new Error("Method not implemented ")
    }
    update(data: any) : Promise<Product> {
        throw new Error("Method not implemented ")
    }
    delete (id : any) : Promise<Product> {
        throw new Error("Method not implemented ")
    }
    find() : Promise<Product[]> {
        throw new Error("Method not implemented ")
    }
    findOne(id: number) : Promise<Product> {
        throw new Error("Method not implemented ")
    }

}