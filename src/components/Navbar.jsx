import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  IoFastFood,
  IoHome,
  IoTime,
  IoBusiness,
  IoCart,
  IoLogOut,
  IoPerson,
  IoPricetag,
} from "react-icons/io5";
import logo from "../logo.png";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(LogOut());
    dispatch(reset());
    navigate("/");
  };
  return (
    <div>
      <nav
        className="navbar is-fixed-top has-shadow"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <NavLink to="/dashboard" className="navbar-item">
            <img src={logo} width="112" height="28" alt="logo" />
          </NavLink>

          <a
            href="#"
            role="button"
            className="navbar-burger burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu">
          <div className="navbar-start">
            <NavLink to={"/dashboard"} className="navbar-item">
              <IoHome />
              Dashboard
            </NavLink>
            {user && user.role === "user" && (
              <NavLink to={"/shelflifes/user-history"} className="navbar-item">
                <IoTime />
                Shelflifes History
              </NavLink>
            )}

            {user && user.role === "admin" && (
              <NavLink to={"/users"} className="navbar-item">
                <IoPerson />
                Users
              </NavLink>
            )}

            {user && user.role === "admin" && (
              <NavLink to={"/categories"} className="navbar-item">
                <IoPricetag />
                Category
              </NavLink>
            )}

            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link">
                <IoFastFood />
                Products
              </a>

              <div className="navbar-dropdown">
                <NavLink to={"/products"} className="navbar-item">
                  <IoBusiness />
                  Product
                </NavLink>
                <NavLink to={"/rare-products"} className="navbar-item">
                  <IoCart />
                  Rarely Used Product
                </NavLink>
              </div>
            </div>
          </div>
          <div className="navbar-end">
            <div className="navbar-item">
              <h1>{user && user.name}</h1>
              <div className="buttons">
                <button
                  onClick={logout}
                  className="button is-danger is-outlined"
                >
                  <IoLogOut className="pr-2" />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
