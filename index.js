const express = require("express");

const router = require("./posts/router.js");
const server = express();

server.use(express.json());

server.use("/api/posts", router);

server.get("/", (req, res)=>{
   res.json({query: req.query, params: req.params, headers: req.headers})
})

server.listen(5000, ()=>{
    console.log("\n*** Server Running on http://localhost:5000 ***\n")
})