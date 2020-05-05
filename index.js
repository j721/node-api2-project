const express = require("express");

const dataRouter = require("./data/data-router.js");

const server = express();

server.use(express.json());

server.get("/", (req, res)=>{
    res.json({})
})

server.use("/api/data", dataRouter);

server.listen(5000, ()=>{
    console.log("\n*** Server Running on http://localhost:5000 ***\n")
})