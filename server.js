const express =require("express");
const cors=require("cors");
const dotenv=require("dotenv").config();
const app=express();




// Database Connect
const ConnectDB=require("./DB/ConnectDB")

// routes

const CategoryRoutes=require("./routes/categoryRoutes");
const BookRoutes=require("./routes/bookRoutes");





app.use(cors({
    origin:"*",
    methods:["GET","POST","DELETE","PUT"],
    
}))

// Error MiddleWare
const GolbalError=require("./middlewares/ErrorMiddleware")

// This MiddleWare For body parser
app.use(express.json());

// routes
app.use("/api/categories",CategoryRoutes);
app.use("/api/books",BookRoutes);


// Error MiddleWare
app.use(GolbalError);

app.listen(process.env.PORT,()=>{
    console.log(`listening on port:${process.env.PORT}....`)
    ConnectDB();
})