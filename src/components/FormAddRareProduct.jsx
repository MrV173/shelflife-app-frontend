import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const FormAddRareProduct = () => {
  const [name, setName] = useState("");
  const [shelflifeInHour, setShelflifeInHour] = useState("");
  const [shelflifeInMinute, setShelflifeInMinute] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const categoryName = "Rarely Used Product";

  useEffect(() => {
    const getCategory = async () => {
      try {
        const response = await axios.get(
          `https://api.shelflife-app.my.d.shelflife-app.my.id/category/name/${categoryName}`
        );
        console.log(response.data);
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          setCategories([response.data]);
        }
      } catch (error) {
        console.log("error", error);
      }
    };
    getCategory();
  }, []);

  const createRareProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/product", {
        name: name,
        shelflifeInHour: shelflifeInHour,
        shelflifeInMinute: shelflifeInMinute,
        categoryId: categoryId,
      });
      navigate("/rare-products");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Products</h1>
      <h2 className="subtitle">Add New Rarely Used Product</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={createRareProduct}>
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
                <label className="label">Shelfife In Month</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={shelflifeInHour}
                    onChange={(e) => setShelflifeInHour(e.target.value)}
                    placeholder="Month"
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Shelflife in Day</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={shelflifeInMinute}
                    onChange={(e) => setShelflifeInMinute(e.target.value)}
                    placeholder="Day"
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

export default FormAddRareProduct;
