const User = require("../models/userModel");
const HttpError = require("../models/errorModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const fs = require("fs");
const path = require("path");
const { v4: uuid } = require("uuid");

//  ********to register the users**********
// Post req : api/users/register
//Unprotected
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, password2 } = req.body;

    if (!name || !email || !password) {
      return next(new HttpError("Fill in all Field", 422));
    }
    const newEmail = email.toLowerCase();

    const emailExists = await User.findOne({ email: newEmail });
    if (emailExists) {
      return next(new HttpError("Email Already Exists", 422));
    }
    if (password.trim().length < 6) {
      return next(
        new HttpError("Password should be at least 6 characters", 422)
      );
    }

    if (password != password2) {
      return next(new HttpError("Password does not Match", 422));
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email: newEmail,
      password: hashPassword,
    });

    res
      .status(201)
      .json(`New User ${newUser.email} is Registered Successfully!`);
  } catch (error) {
    return next(new HttpError("user Registration failed", 422));
  }
};

//  ********Login a Registered user**********
// Post req : api/users/login
//Unprotected
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new HttpError("Fill in all Fields", 422));
    }

    const newEmail = email.toLowerCase();

    const user = await User.findOne({ email: newEmail });

    if (!user) {
      return next(new HttpError("Invalid Credentials", 422));
    }

    const comparePassword = await bcrypt.compare(password, user.password);

    if (!comparePassword) {
      return next(new HttpError("invalid credentials", 422));
    }

    const { _id: userId, name } = user;

    const token = jwt.sign({ userId, name }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

    res.status(200).json({ name, userId, token });
  } catch (error) {
    return next(
      new HttpError("Login Failed!, Please Check your Credentials", 402)
    );
  }
};

//  ********User Profile**********
// Post req : api/users/:id
//protected
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return next(new HttpError(`User Not found with Id : ${id}`, 404));
    }

    res.status(200).json({ user });
  } catch (error) {
    return next(new HttpError("User not found", 404));
  }
};

//  ********Change user Avatar**********
// Post req : api/users/change-Avatar
//protected
const changeAvatar = async (req, res, next) => {
  try {
    if (!req.files.avatar) {
      return next(new HttpError("Please choose an image", 422));
    }
    // current user data [find user from database]
    const user = await User.findById(req.user.userId);
   

    //    delete old avatar if exist
    if (user.avatar) {
      fs.unlink(path.join(__dirname, "..", "uploads", user.avatar), (err) => {
        if (err) {
          return next(new HttpError(`Error in deleting old image ${err}`));
        }
      });
    }

    const { avatar } = req.files;
    //check the file size
    if (avatar.size > 500000) {
      return next(
        new HttpError("Profiles picture too big, should be less than 500kb"),
        422
      );
    }

    let fileName;
    fileName = avatar.name;
    let splittedFileName = fileName.split(".");
    let newFileName =
      splittedFileName[0] +
      uuid() +
      "." +
      splittedFileName[splittedFileName.length - 1];

    avatar.mv(
      path.join(__dirname, "..", "uploads", newFileName),
      async (err) => {
        if (err) {
          return next(
            new HttpError(`Error in moving and uploading the file${err}`)
          );
        }
        const updateAvatar = await User.findByIdAndUpdate(
          req.user.userId,
          { avatar: newFileName },
          { new: true }
        );
        if (!updateAvatar) {
          return http(new HttpError("Avatar could not upload"), 422);
        }
        res.status(200).json({ updateAvatar });
      }
    );
  } catch (error) {
    return next(new HttpError(error));
  }
};

//  ********Edit User Details (from Profile**********
// patch req : api/users/edit-user
//protected

const editUser = async (req, res, next) => {
  try {
    const { name, email, currentPassword, newPassword, confirmNewPassword } =
      req.body;

    // check all the fields are filled
    if (!name || !email || !currentPassword || !newPassword) {
      return next(new HttpError(`Fill in all fields`, 422));
    }

    // Get users from the DB
    const user = await User.findById(req.user.userId);

    if (!user) {
      return next(HttpError(`User Not found`, 403));
    }

    // make sure new email does not already exists

    const emailExists = await User.findOne({ email });

    if (emailExists && emailExists._id != req.user.id) {
      return next(new HttpError(`Email Already Exist`, 422));
    }

    // compare current password with the db password

    const validateUserPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!validateUserPassword) {
      return next(new HttpError(`Invalid current Password `, 422));
    }

    // compare new password

    if (newPassword !== confirmNewPassword) {
      return next(new HttpError(`New Passwords do not match`, 422));
    }

    // hash new password

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(newPassword, salt);

    // update user info in database
    const newInfo = await User.findByIdAndUpdate(
      req.user.userId,
      { name, email, password: hashPassword },
      { new: true }
    );

    res.status(200).json(newInfo);
  } catch (error) {
    return next(new HttpError(`Unable to edit the details`, 422));
  }
};

//  ********Get All the Users**********
// get : api/users/getUsers
//unprotected
const getAuthors = async (req, res, next) => {
  try {
    const authors = await User.find().select("-password");
    res.json(authors);
  } catch (error) {
    return next(new HttpError("Author Not Found", 404));
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  getAuthors,
  changeAvatar,
  editUser,
};
