import React, { useEffect } from "react";
import Layout from "./Layout";
import ShelflifeHistory from "../components/ShelflifeHistory";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const UserHistoryShelflife = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isError } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getMe());
  }, [dispatch]);

  useEffect(() => {
    if (isError) {
      navigate("/");
    }
  }, [isError, navigate]);
  return (
    <Layout>
      <ShelflifeHistory />
    </Layout>
  );
};

export default UserHistoryShelflife;
