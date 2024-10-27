import express from 'express';
import bodyParser from 'body-parser';
import db from './src/Config/DBconnection';
import movieRoutes from './src/routes/MovieRoutes';

const app = express();
const PORT = process.env.PORT || 3000; 

app.use(bodyParser.json());
app.use('/api', movieRoutes);


const startServer = async () => {
    try {
        await db.connection();
        console.log('Connected to Redis');
        console.log('Connected to Db');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Error starting the server:', error);
    }
};

startServer();
