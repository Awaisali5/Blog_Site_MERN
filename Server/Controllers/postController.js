const Post = require("../models/postModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const HttpError = require("../models/errorModel");

// *************Create A Post **************
// POST: api/posts
// Projected

const createPost = async (req, res, next) => {
  try {
    let { title, category, description } = req.body;

    if (!title || !category || !description) {
      return next(
        new HttpError(`Fill in all fields and choose thumbnail`, 422)
      );
    }

    const { thumbnail } = req.files;

    // check the file size
    if (thumbnail.size > 2000000) {
      return next(
        new HttpError(`Thumbnail size should not be more than 2000 kb`)
      );
    }

    // uploading the files
    let fileName = thumbnail.name;

    let splittedFileName = fileName.split(".");
    let newFileName =
      splittedFileName[0] +
      uuid() +
      "." +
      splittedFileName[splittedFileName.length - 1];

    thumbnail.mv(
      path.join(__dirname, `..`, "/uploads", newFileName),
      async (err) => {
        if (err) {
          return next(
            new HttpError(`Unable to upload the post thumbnail`, 422)
          );
        } else {
          const newPost = await Post.create({
            title,
            category,
            description,
            thumbnail: newFileName,
            creator: req.user.userId,
          });
          if (!newPost) {
            return next(new HttpError(`Post couldn't be Created`, 422));
          }
          // find user and increate post count by 1
          const currentUser = await User.findById(req.user.userId);
          console.log(currentUser);
          const userPostCount = currentUser.posts + 1;
          console.log(currentUser);

          await User.findByIdAndUpdate(req.user.userId, {
            posts: userPostCount,
          });

          res.status(200).json(newPost);
        }
      }
    );
  } catch (error) {
    return next(
      new HttpError(`Unable to Create new Post! Acha code likh bhai`, 422)
    );
  }
};

// *************Get All the Post **************
// Get: api/posts
// UnProjected

const GetPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ updateAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    return next(
      new HttpError(`Unable to fetch all Posts! Acha code likh bhai`, 422)
    );
  }
};

// *************Get a Single Post **************
// Get: api/posts/:id
// UnProjected

const GetSinglePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new HttpError("Post not found"), 404);
    }

    res.status(200).json(post);
  } catch (error) {
    return next(
      new HttpError(`Unable to fetch a single Post! Acha code likh bhai`, 422)
    );
  }
};

// *************Get Post by Category **************
// GET: api/posts/categories/:category
// UnProjected

const GetCatePost = async (req, res, next) => {
  try {
    const { category } = req.params;

    const catePosts = await Post.find({ category }).sort({ createAT: -1 });
    res.status(200).json(catePosts);
  } catch (error) {
    return next(
      new HttpError(`Unable to fetch a Post category! Acha code likh bhai`, 422)
    );
  }
};

// *************Get Post by Author **************
// Get: api/posts/users/:id
// UnProjected

const getUserPost = async (req, res, next) => {
  try {
    const { id } = req.params;

    const posts = await Post.find({ creator: id }).sort({ createAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    return next(
      new HttpError(`Unable to fetch a User Post! Acha code likh bhai`, 422)
    );
  }
};

// *************Edit Post**************
// Patch: api/posts/:id
// Projected

const editPost = async (req, res, next) => {
  try {
    let fileName;
    let newFileName;
    let updatePost;
    const postId = req.params.id;
    console.log(postId);

    let { title, category, description } = req.body;

    if (!title || !category || description < 12) {
      return next(
        new HttpError("Fill in all Fields, desc must be greater than 12 words"),
        422
      );
    }

    if (!req.files) {
      updatePost = await Post.findByIdAndUpdate(
        postId,
        { title, category, description },
        { new: true }
      );
    } else {
      //get old post from database
      const oldPost = await Post.findById(postId);
      if(req.user.userId == oldPost.creator){

     // delete old thumbnail if user change it
     fs.unlink(
      path.join(__dirname, "..", "uploads", oldPost.thumbnail),
      async (err) => {
        if (err) {
          return next(new HttpError("Error in uploading the file"), 422);
        }
      } 
    );
    //uploading the thumbnail
    const { thumbnail } = req.files;
  

    // checking the size of thumbnail
    if (thumbnail.size > 2000000) {
      return next(
        new HttpError("Thumbnail too big, it must be less than 2000kb")
      );
    }

    fileName = thumbnail.name;
    let splittedFileName = fileName.split(".");
    newFileName = splittedFileName[0] =
      uuid() + "." + splittedFileName[splittedFileName.length - 1];
    thumbnail.mv(
      path.join(__dirname, "..", "uploads", newFileName),
      async (err) => {
        if (err) {
          return next(new HttpError(err));
        }
      }
    );

    //update the post
    updatePost = await Post.findByIdAndUpdate(
      postId,
      { title, category, description, thumbnail: newFileName },
      { new: true }
    );

      } 
 

      if (!updatePost) {
        return next(new HttpError("Cannot edit the post"), 422);
      }

      res.status(200).json(updatePost);
    }
  } catch (error) {
    return next(new HttpError(`Unable to Edit Post! Acha code likh bhai`, 422));
  }
};

// *************Delete Post**************
// Delete: api/posts/:id
// Projected

const deletePost = async (req, res, next) => {
  try {
    const postId= req.params.id;
    

    if(!postId){
      return next(new HttpError('Post Unavailable', 400))
    }

    const post = await Post.findById(postId)
    
  


    const fileName = post?.thumbnail;
    if(req.user.userId == post.creator){
       // delete thumbnail from upload file 
    fs.unlink(path.join(__dirname, '..', 'uploads', fileName), async (err) => {
      if(err) {
        return next(new HttpError(err))
      }
      else {
        await  Post.findByIdAndDelete(postId)
        //find user and reduce post count by 1
        const currentUser = await User.findById(req.user.userId);
        console.log(currentUser)
        const userPostCount = currentUser?.posts - 1;
        console.log(userPostCount)

        await User.findByIdAndUpdate(req.user.userId,{posts: userPostCount})



      }
    })
        
    }else {
      return next(new HttpError('Post could not deleted',403))
    }

   

    res.status(200).json('Deleted successfully')
    
      
    
  } catch (error) {
    return next(new HttpError(`Unable to Delete Post! Acha code likh bhai`, 422));

    
  }
};

module.exports = {
  deletePost,
  editPost,
  getUserPost,
  GetCatePost,
  GetPosts,
  GetSinglePost,
  createPost,
};
