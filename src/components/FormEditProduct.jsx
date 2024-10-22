import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormEditProduct = () => {
  const [name, setName] = useState("");
  const [shelflifeInHour, setShelflifeInHour] = useState("");
  const [shelflifeInMinute, setShelflifeInMinute] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getProductById = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/product/${id}`);
        setName(response.data.name);
        setShelflifeInHour(response.data.shelflifeInHour);
        setShelflifeInMinute(response.data.shelflifeInMinute);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getProductById();
  }, [id]);

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:5000/product/${id}`, {
        name: name,
        shelflifeInHour: shelflifeInHour,
        shelflifeInMinute: shelflifeInMinute,
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
      <h2 className="subtitle">Edit Product</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={updateProduct}>
              <p className="has-text-centered">{msg}</p>
              <div className="field">
                <label className="label">Product Name</label>
                <div className="control">
                  <input
                    type="text"
                    className="input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  />
                </div>
              </div>
              <div className="field ">
                <div className="control">
                  <button type="submit" className="button is-success">
                    Update
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

export default FormEditProduct;
