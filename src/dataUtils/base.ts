import BaseUtils from '@interfaces/baseUtils';
import Client from '../utils/dbClient'
import {PrismaClient} from "@prisma/client";

export abstract class BaseDataUtils<T, ModelDelegate> implements BaseUtils<T> {
    protected prisma: PrismaClient;
    protected abstract model: ModelDelegate; // Abstract property for model

    constructor() {
        this.prisma = Client;
    }

    async create(data: T): Promise<T> {
        return (this.model as any).create({data});
    }

    async findById(id: number): Promise<T | null> {
        return (this.model as any).findUnique({where: {id}});
    }

    async findAll(): Promise<T[]> {
        return (this.model as any).findMany();
    }

    async update(id: number, data: Partial<T>): Promise<T | null> {
        return (this.model as any).update({where: {id}, data});
    }

    async delete(id: number): Promise<boolean> {
        try {
            await (this.model as any).delete({where: {id}});
            return true;
        } catch {
            return false;
        }
    }

}