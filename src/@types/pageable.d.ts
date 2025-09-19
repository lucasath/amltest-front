export interface IPageable {
    sort?: string;
    page?: number;
    size?: number;
}

export interface IPage<T>{
    content: T[]
    page: IPaginate
}

interface IPaginate {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
}