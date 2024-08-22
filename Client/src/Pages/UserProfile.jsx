import React, { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { FaCheck } from "react-icons/fa";
import { UserContext } from "../context/userContext";
import axios from "axios";

const UserProfile = () => {
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [error, setError] = useState("");
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);

  // navigate
  const navigate = useNavigate();

  // Access control using use context (user are not allow to access some url until he is not login)
  const { currentUser } = useContext(UserContext);

  const token = currentUser?.token;

  // redirect to login page for any user who is not logged in
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    const getUser = async () => {
      const response = await axios.get(
        `https://blog-site-mern.vercel.app/api/users/${currentUser.userId}`,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { name, email, avatar } = response.data.user;
      setName(name);
      setEmail(email);
      setAvatar(avatar);
    };

    getUser();
  }, []);

  // change avatar handler
  const changeAvatarHandler = async () => {
    setIsAvatarTouched(false);

    try {
      const postData = new FormData();
      postData.set("avatar", avatar);

      const response = await axios.post(
        `http://localhost:5000/api/users/changeAvatar`,
        postData,
        { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
      );

      console.log(response);

      setAvatar(response.data.avatar);
    } catch (error) {
      console.log(error);
    }
  };

  const updateUserDetails = async (e) => {
    e.preventDefault();
    try {
      
    const userData = new FormData();
    userData.set("name", name);
    userData.set("email", email);
    userData.set("currentPassword", currentPassword);
    userData.set("newPassword", newPassword);
    userData.set("confirmNewPassword", confirmNewPassword);

    const response = await axios.patch(
      `http://localhost:5000/api/users/editUser`,
      userData,
      { withCredentials: true, headers: { Authorization: `Bearer ${token}` } }
    );
    if(response.status == 200){
      //log user out 
      navigate('/logout')

    }

    } catch (error) {
      setError(error.response.data.msg)
      
    }

  };

  return (
    <>
      <section className="profile">
        <div className="container profile_container">
          <Link to={`/myposts/${currentUser.userId}`} className="btn">
            My Post
          </Link>

          <div className="profile_detail">
            <div className="avatar_wrapper">
              <div className="profile_avatar">
                <img src={`http://localhost:5000/uploads/${avatar}`} alt="" />
              </div>
              {/* form to update avatar  */}
              <form action="#" className="avatar-form">
                <input
                  type="file"
                  name="avatar"
                  id="avatar"
                  onChange={(e) => setAvatar(e.target.files[0])}
                  accept="png, jpg, jpeg"
                />
                <label
                  htmlFor="avatar"
                  onClick={() => setIsAvatarTouched(true)}
                >
                  {" "}
                  <FaEdit />{" "}
                </label>
              </form>
              {isAvatarTouched && (
                <button
                  className="profile-avatar-btn"
                  onClick={changeAvatarHandler}
                >
                  <FaCheck />
                </button>
              )}
            </div>

            <h1>{currentUser.name}</h1>

            {/* form details  user detail */}
            <div className="form profile-form" onSubmit={updateUserDetails}>
              {error && <p className="form-error-massage">{error}</p>}
              <input
                type="text"
                placeholder="Full Name"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                placeholder="Current Password"
                name="currentPassword"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="New Password"
                name="newPassword"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                name="newPassword2"
                id="newPassword2"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />

              <button type="submit" className="btn Primary">
                Update Details
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserProfile;
