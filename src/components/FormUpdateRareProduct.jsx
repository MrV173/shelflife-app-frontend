import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FormUpdateRareProduct = () => {
  const [name, setName] = useState("");
  const [shelflifeInHour, setShelflifeInHour] = useState("");
  const [shelflifeInMinute, setShelflifeInMinute] = useState("");
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const getRareProductById = async () => {
      try {
        const response = await axios.get(
          `https://api.shelflife-app.my.d.shelflife-app.my.id/product/${id}`
        );
        setName(response.data.name);
        setShelflifeInHour(response.data.shelflifeInHour);
        setShelflifeInMinute(response.data.shelflifeInMinute);
      } catch (error) {
        if (error.response) {
          setMsg(error.response.data.msg);
        }
      }
    };
    getRareProductById();
  }, [id]);

  const updateRareProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(
        `https://api.shelflife-app.my.d.shelflife-app.my.id/product/${id}`,
        {
          name: name,
          shelflifeInHour: shelflifeInHour,
          shelflifeInMinute: shelflifeInMinute,
        }
      );
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
            <form onSubmit={updateRareProduct}>
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
                <label className="label">Shelfife In Month</label>
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
                <label className="label">Shelflife in Day</label>
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

export default FormUpdateRareProduct;
