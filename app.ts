import express from 'express';
import api from './src/routes/api';
import { initRedis } from "./src/utils/redis";

const app = express();
const port = process.env.PORT || 3000;

api(app);

app.listen(port,async () => {
    await initRedis();
    console.log(`Server started on port ${port}.......`);
});



