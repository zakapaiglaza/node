export interface Movie {
    id: number;
    title: string;
    description?: string;
    date: string;
    createdAt?: Date;
    updatedAt?: Date;
};


export interface CacheInterface {
    data: Movie,
    expiration: number
};

export interface MovieValidation extends Movie {
    title : string
};