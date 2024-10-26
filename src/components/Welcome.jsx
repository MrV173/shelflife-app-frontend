import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const Welcome = () => {
  const [selectedWip, setSelectedWip] = useState("");
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [wips, setWips] = useState([]);
  const [products, setProducts] = useState([]);
  const [msg, SetMsg] = useState("");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    getProduct();
    getWip();
  }, []);

  const getProduct = async () => {
    const response = await axios.get("http://localhost:5000/products")
    setProducts(response.data)
  }

  const getWip = async () => {
    const response = await axios.get("http://localhost:5000/shelflifes");
    setWips(response.data);
  };

  const handleSelectChange = (e) => {
    const selectedWipName = e.target.value;
    const selectedWipData = products.find((product) => product.name === selectedWipName);

    if (selectedWipData) {
      setSelectedWip(selectedWipData.name);
      setHour(selectedWipData.shelflifeInHour || 0);
      setMinute(selectedWipData.shelflifeInMinute || 0);
    }
  };
  const createShelflife = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/shelflife", {
        name: selectedWip,
        hour: hour,
        minute: minute,
      });
      getWip();
    } catch (error) {
      if (error.response) {
        SetMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <div className="has-text-centered">
        <h1 className="title">Shelflifes</h1>
      </div>
      <div>
        {user && user.role === "user" && (
          <div className="grid">
            <div className="card is-shadowless">
              <div className="card-content">
                <div className="content">
                  <form onSubmit={createShelflife}>
                    <p className="has-text-centered">{msg}</p>
                    <div className="field">
                      <label className="label">Product Name</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            value={selectedWip}
                            onChange={handleSelectChange}
                          >
                            <option value="">-- Select a product --</option>
                            {products.map((product) => (
                              <option key={product.uuid} value={product.name}>
                                {product.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="field" style={{ display: "none" }}>
                      <label className="label">Shelflife in Hour</label>
                      <div className="control">
                        <input
                          type="number"
                          className="input"
                          value={hour}
                          onChange={(e) =>
                            setHour(parseInt(e.target.value) || 0)
                          }
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="field" style={{ display: "none" }}>
                      <label className="label">Shelflife in Minute</label>
                      <div className="control">
                        <input
                          type="number"
                          className="input"
                          value={minute}
                          onChange={(e) =>
                            setMinute(parseInt(e.target.value) || 0)
                          }
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="field ">
                      <div className="control">
                        <button type="submit" className="button is-success">
                          Create Shelflife
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
        {user && user.role === "user" && (
          <div className="grid">
            <table className="table is-striped is-fullwidth">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Product Name</th>
                  <th>Date</th>
                  <th>Start of Shelflife</th>
                  <th>End of Shelflife</th>
                </tr>
              </thead>
              <tbody>
                {wips.map((wip, index) => (
                  <tr key={wip.uuid}>
                    <td>{index + 1}</td>
                    <td>{wip.name}</td>
                    <td>{wip.date}</td>
                    <td>{wip.startShelflife}</td>
                    <td>{wip.endShelflife}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {user && user.role === "admin" && (
        <div style={{ fontSize: "25px", fontFamily: "sans-serif"}}>
          <strong>Welcome... {user && user.name}</strong>
        </div>
      )}
    </div>
  );
};

export default Welcome;
