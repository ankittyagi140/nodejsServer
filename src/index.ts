import express,{NextFunction, Request,Response} from "express";
import cors from "cors";
import 'dotenv/config';
import ApiRoutes from "./routes/api";
import cookieParser from 'cookie-parser';
import logger from "./logger/winston";

const app = express();
const PORT = process.env.PORT || 8080;

//middleware
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true
}))
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(cookieParser())
app.use((req:Request,res:Response,next:NextFunction)=>{
    logger.info(`Request: ${req.method} ${req.url}`)
})

//headers
app.use((req:Request, res:Response, next) => {
    // CORS headers
    // res.setHeader('Access-Control-Allow-Origin', 'http://yourfrontend.com'); // Update with your frontend URL
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
    // Security headers
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    
    // Proceed to the next middleware
    next();
  });

//routes
app.use('/api',ApiRoutes)

app.get('/',async(req:Request,res:Response):Promise<any>=>{
    await res.status(200).json({message:"sucessfully redirected to Home route"})
})

app.listen(PORT,()=>{
    logger.info("Server is runnig on PORT:"+PORT)
})