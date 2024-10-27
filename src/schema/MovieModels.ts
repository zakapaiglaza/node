import { DataTypes, Model, Optional } from 'sequelize';
import db from '../Config/DBconnection';
import {Movie} from '../interface/MovieInterface';



type MovieKey = Optional<Movie, 'id' | 'createdAt' | 'updatedAt'>;


class MovieModels extends Model<Movie, MovieKey> {
    public id!: number;
    public title!: string;
    public description?: string;
    public date!: string;
    public createdAt!: Date;
    public updatedAt!: Date;
}

MovieModels.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: { type: DataTypes.STRING, allowNull: false },
        description: { type: DataTypes.STRING, allowNull: true },
        date: { type: DataTypes.STRING, allowNull: false },
    },
    {
        sequelize: db.sequelize,
        tableName: 'Movies',
        timestamps: true,
    }
);

export default MovieModels;
