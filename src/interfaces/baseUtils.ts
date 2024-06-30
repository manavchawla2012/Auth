export interface BaseDataUtilsUtils<T> {
    create(data: T): Promise<T>;
    findById(id: number): Promise<T | null>;
    findAll(): Promise<T[]>;
    update(id: number, data: Partial<T>): Promise<T | null>;
    delete(id: number): Promise<boolean>;

}

export default BaseDataUtilsUtils;