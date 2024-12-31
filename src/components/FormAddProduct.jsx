import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FormAddProduct = () => {
  const [name, setName] = useState("");
  const [shelflifeInHour, setShelflifeInHour] = useState("");
  const [shelflifeInMinute, setShelflifeInMinute] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [msg, setMsg] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const api = process.env.REACT_APP_SERVER;

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(`${api}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.error("error", error);
      }
    };
    getCategories();
  }, []);

  const createProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${api}/product`, {
        name: name,
        shelflifeInHour: shelflifeInHour,
        shelflifeInMinute: shelflifeInMinute,
        categoryId: categoryId,
      });
      navigate("/products");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Products</h1>
      <h2 className="subtitle">Add New Product</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={createProduct}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">Product Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Shelflife in Hour</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={shelflifeInHour}
                    onChange={(e) => setShelflifeInHour(e.target.value)}
                    placeholder="2"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Shelflife in Minute</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={shelflifeInMinute}
                    onChange={(e) => setShelflifeInMinute(e.target.value)}
                    placeholder="30"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Category</label>
                <div className="control">
                  <div className="select">
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.uuid} value={category.uuid}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field ">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Create
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAddProduct;
