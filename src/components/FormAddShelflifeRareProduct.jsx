import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";

const FormAddShelflifeRareProduct = () => {
  const [rareProducts, setRareProducts] = useState([]);
  const [data, setData] = useState([]);
  const [month, setMonth] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [day, setDay] = useState(0);
  const [error, setError] = useState("");
  const [selectedWip, setSelectedWip] = useState("");

  const categoryName = "Rarely Used Product";

  useEffect(() => {
    const getRareProducts = async () => {
      const response = await axios.get(
        `https://api.shelflife-app.my.d.shelflife-app.my.id/products/category-name?categoryName=${categoryName}`
      );
      setRareProducts(response.data);
    };
    getRareProducts();
  });

  const getShelflifeRareProduct = async () => {
    const response = await axios.get(
      `https://api.shelflife-app.my.d.shelflife-app.my.id/shelflifes/rare-product/${categoryName}`
    );
    setData(response.data);
  };

  const handleSelectChange = (e) => {
    const selectedWipName = e.target.value;
    const selectedWipData = rareProducts.find(
      (rareProduct) => rareProduct.name === selectedWipName
    );

    if (selectedWipData) {
      setSelectedWip(selectedWipData.name);
      setMonth(selectedWipData.shelflifeInHour || 0);
      setDay(selectedWipData.shelflifeInMinute || 0);
      setCategoryId(selectedWipData.category?.uuid || "");
    }
  };

  const createShelflife = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://api.shelflife-app.my.d.shelflife-app.my.id/shelflife/rare-product",
        {
          name: selectedWip,
          month: month,
          day: day,
          categoryId: categoryId,
        }
      );
      await getShelflifeRareProduct();
    } catch {
      if (error.response) {
        console.log(error.response.data.msg);
      }
    }
  };

  useEffect(() => {
    getShelflifeRareProduct();
  }, []);

  return (
    <div>
      <div className="my-5">
        <NavLink to={"/dashboard"}>
          <button className="button is-info">
            <IoArrowBackCircle className="mr-2" /> Back to Dashboard
          </button>
        </NavLink>
      </div>
      <div>
        <div className="grid">
          <div className="card is-shadowless">
            <div className="card-content">
              <div className="content">
                <form onSubmit={createShelflife}>
                  <div className="field">
                    <label className="label">Product Name</label>
                    <div className="control">
                      <div className="select is-fullwidth">
                        <select
                          value={selectedWip}
                          onChange={handleSelectChange}
                        >
                          <option value="">-- Select a product --</option>
                          {rareProducts.map((rareProduct) => (
                            <option
                              key={rareProduct.uuid}
                              value={rareProduct.name}
                            >
                              {rareProduct.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="field" style={{ display: "none" }}>
                    <label className="label">Shelflife in Month</label>
                    <div className="control">
                      <input
                        type="number"
                        className="input"
                        value={month}
                        onChange={(e) =>
                          setMonth(parseInt(e.target.value) || 0)
                        }
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="field" style={{ display: "none" }}>
                    <label className="label">Shelflife in Day</label>
                    <div className="control">
                      <input
                        type="number"
                        className="input"
                        value={day}
                        onChange={(e) => setDay(parseInt(e.target.value) || 0)}
                        readOnly
                      />
                    </div>
                  </div>
                  <div className="field" style={{ display: "none" }}>
                    <label className="label">Category UUID</label>
                    <div className="control">
                      <input
                        type="text"
                        className="input"
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
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

        <div className="grid">
          <table className="table is-bordered is-striped is-fullwidth">
            <thead>
              <tr className="is-link">
                <th>Product Name</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Start of Shelflife</th>
                <th>End of Shelflife</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.uuid}>
                  <td>{item.name}</td>
                  <td>{item.startDate}</td>
                  <td>{item.endDate}</td>
                  <td>{item.startShelflife}</td>
                  <td>{item.endShelflife}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FormAddShelflifeRareProduct;
