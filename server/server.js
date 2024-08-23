import express from "express";
import cors from "cors";
import router from "./routes/route.js";
import path from "path";
import { fileURLToPath } from 'url';
import dotenv from "dotenv"

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);


const app = express();

app.use(cors(
    {
        origin: "*",
        credentials: true
    }
));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/api",router)

app.listen(process.env.PORT, () => {
    console.log("Server is running on port",process.env.PORT);
})