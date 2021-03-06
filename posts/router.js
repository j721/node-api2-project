const express = require("express");
const server = express();
const Posts = require("../data/db");
const router = express.Router(); 

server.unsubscribe(express.json());

// POST request to /api/posts
router.post("/", (req, res)=>{
const { title, contents } = req.body;

if(!title || !contents){
  res.status(400).json({errorMessage: "Please provide title and contents for the post."})
}else {
  Posts.insert(req.body)
  .then((posts)=>{
    res.status(201).json(posts)
  }).catch((err)=>{
    res.status(500).json({error: "There was an error while saving the post to the database."})
  })
}
})


//POST request to /api/posts/:id/comments


// router.post("/:id/comments", (req, res)=>{
//   if (req.body.text === undefined){
//     res.status(400).json({errorMessage: "Please provide text for the comment."})
//   }
//   Posts.insertComment(req.body)
//   .then((comments)=>{
//     if(comments){
//       res.status(201).json(comments);
//     }else{
//       res.status(404).json({errorMessage: "The post with the specified ID does not exist."})
//     }
//   }).catch((err)=>{
//     res.status(500).json({errorMessage:"There was an error while saving the comment to the database."})
//   })
// })


// router.post('/:id/comments', (req, res)=>{
//   const { id } = req.params.id;
//   const [newComment] = req.body;

//   if(!newComment.text){
//     return res.status(400).json({errorMessage: "Please provide text for the comment."})
//   }else{
//     Posts.insertComment([newComment])
//     .then((comment)=>{
//       if(comment){
//         res.status(201).json(comment)
//       }else{
//         res.status(404).json({errorMessage: "The post with the specified ID does not exist."})
//       }
//     })
//     .catch((error)=>{
//       console.log(error);
//       res.status(500).json({errorMessage:"There was an error while saving the comment to the database."})
//     })
//   }


// router.post('/:id/comments', (req, res)=>{
//   Posts.findById(id)
//   .then((post)=>{
//     if (!post.length){
//       res.status(404).json({errorMessage: "The post with the specified ID does not exist."})
//     }else if(!req.body.text){
//         res.status(400).json({errorMessage: "Please provide text for the comment."})
//     }else{
//       Posts.insertComment(req.body)
//       .then((comment)=>{
//         res.status(201).json(comment);
//       })
//       .catch((err)=>{
//         res.status(500).json({errorMessage:"There was an error while saving the comment to the database."})
//       })
//     }
//   })  
// })



router.post('/:id/comments', (req, res) => {
  const id = req.params.id
  const commentReq = req.body

  Posts.findPostComments(id)
      .then(comment => {
          const [commentObj] = comment
          if (commentObj) {
              if (commentReq.text && typeof commentReq.text === 'string'){
                  Posts.insertComment(commentReq)
                  .then(newId => {
                      const CommentId = newId.id
                      return CommentId
                  })
                  .then(CommentId => {
                      Posts.findCommentById(CommentId)
                          .then(comment => {
                              res.status(201).json(comment)
                          })
                          .catch(err => {
                              res.status(201).json({ 
                                  error: 'Could not find comment'
                              })
                          })
                  })
                  .catch( err => {
                      console.log(err)
                      res.status(500).json({
                          error: "There was an error while saving the comment to the database"})})
              } else {          
                  res.status(400).json({
                      message: 'Please provide text for the comment.' })
              }
          } else {
              res.status(404).json({message: 'The post with the specified ID does not exist.'})
          }
      })
      .catch(err => {
          console.log(err)
          res.status(500).json({message: 'error retrieving the posts' });
      });
});



// router.post("/:id/comments", (req,res)=>{
//   Posts.insertComment(req.body)
//   .then(comment=>{
//     res.status(201).json(comment)
//   }).catch(err=>{
//     res.status(404).json({message:"The post with the specified ID does not exist." })
//   })
// })



// router.post("/:id/comments", (req, res)=>{
//   const {id } = req.params;
//   posts.findPostComments(id)
//   .then(comments =>{
//     res.status(201).json(comments)
//   })
//   .catch((err)=>{
//     res.status(500).json({errorMessage: 'There was an error while saving the comment to the database.'})
//   })
// }

// router.post("/:id/comments", (req, res)=>{
//   const { id } = req.params;
//   Posts.findById(id).then((post)=>{
//     if (!post.length){
//       res.status(404).json({errorMessage: "The post with the specified ID does not exist."})
//     }else{
//       if(!req.body.text){
//         res.status(400).json({errorMessage: "Please provide text for the comment."})
//       }else{
//         Posts.insertComment(req.body)
//         .then((comment)=>{
//           res.status(201).json(comment)
//         })
//         .catch((err)=>{
//           res.status(500).json({errorMessage:"There was an error while saving the comment to the database."})
//         })
//       }
//     }
//   })
// })


//GET  /api/posts                   Returns an array of all post objects saved in database.
router.get("/", (req, res) => {
    Posts.find()
      .then(posts => {
        res.status(200).json(posts);
      })
      .catch(error => {
        console.log(error);
        res.status(500).json({message: "The posts information could not be retrieved."});
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

// DELETE request to /api/posts/:id

router.delete("/:id", (req, res)=>{
  const { id }= req.params.id
  Posts.findById(id)
  .then((post)=>{
    if(!post.length){
      res.status(404).json({error:"The post with the specified ID does not exist." })
    }else{
      Posts.remove(id)
      .then((post)=>{
        res.status(200).json(post);
      }).catch((err=>{
        res.status(500).json({error: "The post could not be removed." })
      }))
    }
  })
})

// router.delete('/:id', (req, res)=>{
//   const { id } = req.params;
//   Posts.remove(id)
//   .then(post=>{
//     if(post){
//       res.status(200).json( post)
//     }else{
//       res.status(404).json({message: "The post with the specified ID does not exist."})
//     }
//   }).catch((err)=>{
//     res.status(500).json({error:"The post could not be removed."})
//   })
// })


//PUT request to /api/posts/:id:

// router.put("/:id", (req,res)=>{
//   const { body} = req.body;
//   const {id }= req.params.id;

//   Posts.findById(id)
//   .then(postId=>{
//     if(!postId.length){
//       res.status(404).json({message: 'The post with the specified ID does not exist.'})
//     }else if (!body.title || !body.contents){
//       res.status(400).json({errorMessage:  "Please provide title and contents for the post."})
//     }else{
//       Posts.update(id, body)
//       .then((post)=>{
//        res.status(200).json(post)
//       }).catch((err)=>{
//         res.status(500).json({error: "The post information could not be modified."})
//       })
//     }
//   })
// })

// router.put("/:id", (req,res)=>{
//   const {body} = req.body;

//   Posts.update(req.params.id, body)
//   .then(post=>{
//     if(post){
//       res.status(200).json(post)
//     }else{
//       res.status(404).json({message: "The post with the specified ID does not exist."})
//     }
//   }).catch(err=>{
//     res.status(500).json({message:"The post information could not be modified."})
//   })
// })



// router.put('/:id', (req, res)=>{
//   const id = req.params.id;
//   if(!req.body.title || !req.body.contents){
//     res.status(400).json({errorMessage:  "Please provide title and contents for the post."})
//   }
//   Posts.update(id, req.body)
//   .then(post=>{
//     if(post === 1){
//       res.status(200).json(req.body)
//     }else{
//       res.status(404).json({message: "The post with the specified ID does not exist"})
//     }
//   })
//   .catch(err=>{
//     res.status(500).json({{message:"The post information could not be modified."})
//   })
    
// })



router.put('/:id', (req, res) => {
  const update = req.body
  Posts.update(req.params.id, update)
      .then( response => {
          if (response) {
              if (update.title && update.contents){
                  Posts.findById(req.params.id)
                      .then(post => {
                          res.status(200).json(post)
                      })
                      .catch(error => {
                          res.status(200).json({
                              message: 'there was an error finding the post id'
                          });
                      });
              } else {
                  res.status(400).json({ message: "Please provide title and contents for the post."})
              }
          } else {
              res.status(404).json({message: "The post with the specified ID does not exist." })
          }
      })
      .catch( error => {
          res.status(500).json({ message: 'The post information could not be modified.'});
      });
});


module.exports = router; 


