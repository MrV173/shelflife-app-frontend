import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import {
  IoDesktop,
  IoCloud,
  IoBag,
  IoMedical,
  IoServer,
  IoEgg,
} from "react-icons/io5";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState("Hot Display");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [activeButton, setActiveButton] = useState({});
  const [data, setData] = useState([]);
  const [reload, setReload] = useState(false);
  const api = process.env.REACT_APP_SERVER;

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab, reload]);

  const deleteProduct = async (productId) => {
    await axios.delete(`${api}/product/${productId}`);
    setReload((prev) => !prev);
  };

  const fetchData = async (tab) => {
    try {
      let url = "";
      switch (tab) {
        case "Hot Display":
          url = `${api}/shelflifes/category-name?categoryName=Hot Display`;
          break;
        case "Thawing":
          url = `${api}/shelflifes/category-name?categoryName=Thawing`;
          break;
        case "Bain Marie":
          url = `${api}/shelflifes/category-name?categoryName=Bain Marie`;
          break;
        case "Suhu Ruang":
          url = `${api}/shelflifes/category-name?categoryName=Suhu Ruang`;
          break;
        case "Bar":
          url = `${api}/shelflifes/category-name?categoryName=Bar`;
          break;
        case "Open Pack":
          url = `${api}/shelflifes/category-name?categoryName=Open Pack`;
          break;
        default:
          break;
      }
      const response = await axios.get(url);
      setData(response.data);
    } catch (error) {
      console.log("Error fetching data");
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      const response = await axios.get(`${api}/categories`);
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
          `${api}/products/category-name?categoryName=${selectedCategory}`
        );
        setProducts(response.data);
      }
    };
    getProduct();
  }, [selectedCategory, reload]);

  return (
    <div>
      <h1 className="title">Products</h1>
      <h2 className="subtitle">List of Products</h2>
      {user && user.role === "admin" && (
        <Link to="/products/add" className="button is-primary mb-2">
          Add New Product
        </Link>
      )}

      <div className="tabs is-toggle is-centered mt-5">
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

      <table className="table is-bordered is-striped is-fullwidth">
        <thead>
          <tr className="is-link">
            <th>No</th>
            <th>Product Name</th>
            <th>Shelflife in Hour</th>
            <th>Shelflife in Minute</th>
            {user && user.role === "admin" && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.uuid}>
              <td>{index + 1}</td>
              <td>{product.name}</td>
              <td>{product.shelflifeInHour} Jam</td>
              <td>{product.shelflifeInMinute} Menit</td>
              {user && user.role === "admin" && (
                <td>
                  <Link
                    to={`/products/edit/${product.uuid}`}
                    className="button is-small is-info"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.uuid)}
                    className="button is-small is-danger ml-3"
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;
