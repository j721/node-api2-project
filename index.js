const express = require("express");

const postsRouter = require("./posts/router.js");
const server = express();

server.use(express.json());

server.use("/api/posts", postsRouter);

server.get("/", (req, res)=>{
   res.send(`
   <h2>Lambda Posts</h2>
   <p>Welcome to Lambda Posts!</p>
   `)
})

server.listen(5000, ()=>{
    console.log("\n*** Server Running on http://localhost:5000 ***\n")
})