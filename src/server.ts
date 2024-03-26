import dotenv from "dotenv";
import app from "./app";
import path from "path";
import { connectDB } from "./database/connection/connect";

dotenv.config({path:path.join(__dirname, "..", "public/.env")})
const PORT = process.env.PORT || 5050;
app.listen(PORT,()=>{
   connectDB();
   console.log(`server is running on http://localhost${PORT}`);
});
