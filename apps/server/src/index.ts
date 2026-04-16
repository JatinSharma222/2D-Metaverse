import express from 'express'
import { router } from './routes/v1/index.js';
import client from "@repo/db";

const app = express();

app.use(express.json())

app.use("/api/v1", router);



app.listen(process.env.PORT || 3000, () => {
    console.log("server started at port 3000");
});