export default interface Movie {
    id: number;
    title: string;
    description?: string;
    date: string;
    createdAt?: Date;
    updatedAt?: Date;
}
