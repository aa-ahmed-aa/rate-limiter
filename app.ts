import express from 'express';
import apisRoutes from './src/routes/apis';
import privateRoutes from './src/routes/private';
import publicRoutes from './src/routes/public';
import { initRedis } from "./src/utils/redis";

const app = express();
const port = process.env.PORT || 3000;

app.use(apisRoutes);
app.use(privateRoutes);
app.use(publicRoutes);

app.listen(port,async () => {
    await initRedis();
    console.log(`Server started on port ${port}.......`);
});



