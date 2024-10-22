import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddShelflife = () => {
  const [name, setName] = useState("");
  const [selectedWip, setSelectedWip] = useState("");
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [wips, setWips] = useState([]);
  const [msg, SetMsg] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getWip();
  }, []);

  const getWip = async () => {
    const response = await axios.get("http://localhost:5000/products");
    setWips(response.data);
  };

  const handleSelectChange = (e) => {
    const selectedWipName = e.target.value;
    const selectedWipData = wips.find((wip) => wip.name === selectedWipName);

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
      navigate("/shelflifes");
    } catch (error) {
      if (error.response) {
        SetMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Shelflifes</h1>
      <h2 className="subtitle">Add New Shelflife</h2>
      <div className="card is-shadowless">
        <div className="card-content">
          <div className="content">
            <form onSubmit={createShelflife}>
              <p className="has-text-centered">{msg}</p>
              {/* <div className="field">
                <label className="label">Product Name</label>
                <div className="control">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input"
                  />
                </div>
              </div> */}
              <div className="field">
                <label className="label">Product Name</label>
                <div className="control">
                  <div className="select is-fullwidth">
                    <select value={selectedWip} onChange={handleSelectChange}>
                      <option value="">-- Select a product --</option>
                      {wips.map((wip) => (
                        <option key={wip.uuid} value={wip.name}>
                          {wip.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Shelflife in Hour</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={hour}
                    onChange={(e) => setHour(parseInt(e.target.value) || 0)}
                    readOnly
                  />
                </div>
              </div>
              <div className="field">
                <label className="label">Shelflife in Minute</label>
                <div className="control">
                  <input
                    type="number"
                    className="input"
                    value={minute}
                    onChange={(e) => setMinute(parseInt(e.target.value) || 0)}
                    readOnly
                  />
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

export default AddShelflife;
