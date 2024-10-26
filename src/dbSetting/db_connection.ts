import { Sequelize } from 'sequelize';
import Config from './db_config';

class DB {
    public sequelize: Sequelize;

    constructor() {
        this.sequelize = new Sequelize(
            Config.DBconfig.db,
            Config.DBconfig.username,
            Config.DBconfig.pass,
            {
                host: Config.DBconfig.host,
                dialect: 'postgres',
                port: Config.DBconfig.port,
            }
        );
    }

    async connection() {
        try {
            await this.sequelize.authenticate();
            console.log('connected to db');
        } catch (e) {
            console.error('err connecting to db', e);
        }
    }
}

export default new DB();
