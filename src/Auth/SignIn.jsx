import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";
import queryString from "query-string";
import User from "../API/User";
import { useDispatch, useSelector } from "react-redux";
import { addSession } from "../Redux/Action/ActionSession";
import Cart from "../API/CartAPI";
import { changeCount } from "../Redux/Action/ActionCount";

SignIn.propTypes = {};

function SignIn(props) {
  const [username, set_username] = useState("");
  const [password, set_password] = useState("");

  const [error_username, set_error_username] = useState(false);
  const [error_password, set_error_password] = useState(false);

  const [error, setError] = useState("");
  const [redirect, set_redirect] = useState(false);

  // Get carts từ redux khi user chưa đăng nhập
  const carts = useSelector((state) => state.Cart.listCart);

  // Get isLoad từ redux để load lại phần header
  const count_change = useSelector((state) => state.Count.isLoad);

  const handler_signin = (e) => {
    e.preventDefault();

    const fetchData = async () => {
      const params = {
        username,
        password,
      };

      //   const query = "?" + queryString.stringify(params);

      // const response = await User.Get_Detail_User(query)
      const response = await User.Login(params).then((res) => res);
      console.log(response);

      if (response.status === "error") {
        setError(response.message);
      } else {
        sessionStorage.setItem("id_user", response.user.id);

        set_redirect(true);

        // const action = addSession(response.id);
        // dispatch(action);
        // const idUser= useSelector((state) => state?.idUser);
        // const action_count_change = changeCount(count_change);
        // dispatch(action_count_change);
      }
    };

    fetchData();
  };

  return (
    <div>
      <div className="breadcrumb-area">
        <div className="container">
          <div className="breadcrumb-content">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li className="active">Login</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="page-section mb-60">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 col-md-12 col-xs-12 col-lg-6 mb-30 mr_signin">
              <form action="#">
                <div className="login-form">
                  <h4 className="login-title">Login</h4>
                  <div className="row">
                    <div className="col-md-12 col-12 mb-20">
                      <label>Username *</label>
                      <input
                        className="mb-0"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => set_username(e.target.value)}
                      />
                    </div>
                    <div className="col-12 mb-20">
                      <label>Password</label>
                      <input
                        className="mb-0"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => set_password(e.target.value)}
                      />
                      {error && <span style={{ color: "red" }}>{error}</span>}
                    </div>
                    <div className="col-md-8">
                      <div className="check-box d-inline-block ml-0 ml-md-2 mt-10">
                        <Link to="/signup">Do You Have Account?</Link>
                      </div>
                    </div>
                    <div className="col-md-4 mt-10 mb-20 text-left text-md-right">
                      <a href="#"> Forgotten password?</a>
                    </div>
                    <div className="col-md-12">
                      {redirect && <Redirect to="/" />}
                      <button
                        className="register-button mt-0"
                        style={{ cursor: "pointer" }}
                        onClick={handler_signin}
                      >
                        Login
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
