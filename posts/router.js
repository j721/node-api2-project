const express = require("express");

const Posts = require("../data/db.js");

const router = express.Router(); 


//GET  /api/posts Returns an array of all post objects saved in database.
router.get("/", (req, res) => {
    Posts.find(req.query)
      .then(posts => {
        res.status(200).json(posts);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({
          message: "The posts information could not be retrieved.",
        });
      });
  });

  //GET /api/posts/:id
  router.get("/:id", (req,res)=>{
    Posts.findById(req.params.id)
    .then((post)=>{
      if(post){
        res.status(200).json(post)
    }else{
      res.status(404).json({message: "Error retrieving the post."})
    }
  }).catch((error)=>{
    console.log(error);
    res.status(500).json({message:"The post information could not be retrieved."})
  })
})

// GET request to /api/posts/:id/comments

router.get("/:id/comments", (req, res)=>{
  Posts.findPostComments(req.params.id)
  .then((comments)=>{
    if(comments){
      res.status(200).json(comments);
    }else{
      res.status(404).json({message: "The post with the specified ID does not exist."})
    }
  }).catch(err=>{
    console.log(err);
    res.status(500).json({message: "The comments information could not be retrieved."})
  })
})