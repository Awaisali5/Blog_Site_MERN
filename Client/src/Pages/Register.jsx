import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  // register user to register the user
  const registerUser = async (e) => {
    e.preventDefault();
    setError("");
    console.log("1");
    try {
      const response = await axios.post(
        `https://blog-site-mern.vercel.app/api/users/register`,
        userData
      );
      console.log(response);
      const newUser = await response.data;
      console.log(newUser);
      if (!newUser) {
        setError("Could not Register User, Please try again later");
      }

      navigate("/");
      console.log("2");
    } catch (err) {
      setError(err.response.data.msg);
    }
  };

  const ChangeInputHandler = (e) => {
    setUserData((preState) => {
      return { ...preState, [e.target.name]: e.target.value };
    });
  };
  return (
    <>
      <section className="register">
        <div className="container">
          <h2>Sign Up</h2>

          <form
            action="#"
            className="form register-form"
            onSubmit={registerUser}
          >
            {error && <p className="form-error-massage">{error}</p>}

            <input
              type="text"
              name="name"
              id="name"
              placeholder="Full Name"
              value={userData.name}
              onChange={ChangeInputHandler}
            />

            <input
              type="text"
              name="email"
              id="email"
              placeholder="Email"
              value={userData.email}
              onChange={ChangeInputHandler}
            />

            <input
              type="text"
              name="password"
              id="password"
              placeholder="Password"
              value={userData.password}
              onChange={ChangeInputHandler}
            />

            <input
              type="text"
              name="password2"
              id="password2"
              placeholder="Confirm Password"
              value={userData.password2}
              onChange={ChangeInputHandler}
            />

            <button type="submit" className="btn Primary">
              Register
            </button>
          </form>

          <small>
            Already Have an Account?{" "}
            <Link to={`/login`} className="sm">
              Sign In
            </Link>
          </small>
        </div>
      </section>
    </>
  );
};

export default Register;
