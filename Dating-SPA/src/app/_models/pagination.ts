import { User } from './user';

export interface Pagination {
    pageSize:number;
    pageNumber:number;
    pagesCount:number;
    totalItems:number;
}


export class PaginationResult<T>{
    result:T;
    pagination:Pagination;
}

