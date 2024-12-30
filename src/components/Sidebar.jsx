import React from "react";
import {
  IoPricetag,
  IoPerson,
  IoTime,
  IoHome,
  IoLogOut,
  IoFastFood,
  IoFastFoodSharp,
  IoCart,
} from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, reset } from "../features/authSlice";

const Sidebar = () => {
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
      <aside className="menu pl-2 has-shadow">
        <p className="menu-label">General</p>
        <ul className="menu-list">
          <li>
            <NavLink to={"/dashboard"}>
              <IoHome className="pr-2" />
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to={"/products"}>
              <IoFastFood className="pr-2" />
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to={"/rare-products"}>
              <IoCart className="pr-2" />
              Rarely Used Products
            </NavLink>
          </li>
          {user && user.role === "admin" && (
            <li>
              <NavLink to={"/categories"}>
                <IoPricetag className="pr-2" />
                Category
              </NavLink>
            </li>
          )}
          {user && user.role === "user" && (
            <li>
              <NavLink to={"/shelflifes/user-history"}>
                <IoTime className="pr-2" />
                Shelflifes
              </NavLink>
            </li>
          )}
        </ul>
        {user && user.role === "admin" && (
          <div>
            <p className="menu-label">Admin</p>
            <ul className="menu-list">
              <li>
                <NavLink to={"/users"}>
                  <IoPerson className="pr-2" />
                  Users
                </NavLink>
              </li>
            </ul>
          </div>
        )}
        <p className="menu-label">Settings</p>
        <ul className="menu-list">
          <li>
            <button onClick={logout} className="button is-white">
              <IoLogOut className="pr-2" />
              Logout
            </button>
          </li>
        </ul>
      </aside>
    </div>
  );
};

export default Sidebar;
