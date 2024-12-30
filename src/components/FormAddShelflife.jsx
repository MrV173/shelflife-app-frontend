import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  IoDesktop,
  IoCloud,
  IoWarning,
  IoPlay,
  IoBag,
  IoMedical,
  IoServer,
  IoEgg,
} from "react-icons/io5";
import { useSelector } from "react-redux";

const AddShelflife = () => {
  const [activeTab, setActiveTab] = useState("Hot Display");
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedWip, setSelectedWip] = useState("");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get(
        "https://api.shelflife-app.my.d.shelflife-app.my.id/categories"
      );
      setCategories(response.data);
    };
    getCategories();
  }, []);

  useEffect(() => {
    setSelectedCategory(activeTab);
  }, [activeTab]);

  useEffect(() => {
    const getProduct = async () => {
      if (selectedCategory) {
        const response = await axios.get(
          `https://api.shelflife-app.my.d.shelflife-app.my.id/products/category-name?categoryName=${selectedCategory}`
        );
        setProducts(response.data);
      }
    };
    getProduct();
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedProduct(""); // Reset produk yang dipilih
  };

  const handleSelectChange = (e) => {
    const selectedWipName = e.target.value;
    const selectedWipData = products.find(
      (product) => product.name === selectedWipName
    );

    if (selectedWipData) {
      setSelectedWip(selectedWipData.name);
      setHour(selectedWipData.shelflifeInHour || 0);
      setMinute(selectedWipData.shelflifeInMinute || 0);
      setCategoryId(selectedWipData.category?.uuid || "");
    }
  };

  const fetchData = async (tab) => {
    try {
      let url = "";
      switch (tab) {
        case "Hot Display":
          url =
            "https://api.shelflife-app.my.d.shelflife-app.my.id/shelflifes/category-name?categoryName=Hot Display";
          break;
        case "Thawing":
          url =
            "https://api.shelflife-app.my.d.shelflife-app.my.id/shelflifes/category-name?categoryName=Thawing";
          break;
        case "Bain Marie":
          url =
            "https://api.shelflife-app.my.d.shelflife-app.my.id/shelflifes/category-name?categoryName=Bain Marie";
          break;
        case "Suhu Ruang":
          url =
            "https://api.shelflife-app.my.d.shelflife-app.my.id/shelflifes/category-name?categoryName=Suhu Ruang";
          break;
        case "Bar":
          url =
            "https://api.shelflife-app.my.d.shelflife-app.my.id/shelflifes/category-name?categoryName=Bar";
          break;
        case "Open Pack":
          url =
            "https://api.shelflife-app.my.d.shelflife-app.my.id/shelflifes/category-name?categoryName=Open Pack";
          break;
        default:
          break;
      }
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      setError("Error fetching data");
      console.error("Error fetching data:", error);
    }
  };

  const createShelflife = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://api.shelflife-app.my.d.shelflife-app.my.id/shelflife",
        {
          name: selectedWip,
          hour: hour,
          minute: minute,
          categoryId: categoryId,
        }
      );
      fetchData(activeTab);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.msg);
      }
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  return (
    <div>
      <div className="tabs is-toggle is-centered mt-2">
        <ul>
          <li className={activeTab === "Thawing" ? "is-active" : ""}>
            <a onClick={() => setActiveTab("Thawing")}>
              <span className="icon is-small">
                <IoDesktop />
              </span>
              <span>Thawing</span>
            </a>
          </li>
          <li className={activeTab === "Hot Display" ? "is-active" : ""}>
            <a onClick={() => setActiveTab("Hot Display")}>
              <span className="icon is-small">
                <IoCloud />
              </span>
              <span>Hot Display</span>
            </a>
          </li>
          <li className={activeTab === "Bain Marie" ? "is-active" : ""}>
            <a onClick={() => setActiveTab("Bain Marie")}>
              <span className="icon is-small">
                <IoMedical />
              </span>
              <span>Bain Marie</span>
            </a>
          </li>
          <li className={activeTab === "Suhu Ruang" ? "is-active" : ""}>
            <a onClick={() => setActiveTab("Suhu Ruang")}>
              <span className="icon is-small">
                <IoBag />
              </span>
              <span>Suhu Ruang</span>
            </a>
          </li>
          <li className={activeTab === "Bar" ? "is-active" : ""}>
            <a onClick={() => setActiveTab("Bar")}>
              <span className="icon is-small">
                <IoServer />
              </span>
              <span>Bar</span>
            </a>
          </li>
          <li className={activeTab === "Open Pack" ? "is-active" : ""}>
            <a onClick={() => setActiveTab("Open Pack")}>
              <span className="icon is-small">
                <IoEgg />
              </span>
              <span>Open Pack</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="table-container">
        {user && user.role === "user" && (
          <div className="grid mb-3">
            <div className="card is-shadowless">
              <div className="card-content">
                <div className="content">
                  <form onSubmit={createShelflife}>
                    <p className="has-text-centered">{error}</p>
                    <div className="field" style={{ display: "none" }}>
                      <label className="label">Category Name</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                          >
                            <option value="">-- Select a category --</option>
                            {categories.map((category) => (
                              <option key={category.uuid} value={category.name}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="field">
                      <label className="label">Product Name</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            value={selectedWip}
                            onChange={handleSelectChange}
                            disabled={!selectedCategory}
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
        )}
      </div>
    </div>
  );
};

export default AddShelflife;
