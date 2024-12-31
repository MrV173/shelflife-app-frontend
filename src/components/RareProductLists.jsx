import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

const RareProductList = () => {
  const [rareProducts, setRareProducts] = useState([]);
  const { user } = useSelector((state) => state.auth);
  const categoryName = "Rarely Used Product";
  const api = process.env.REACT_APP_SERVER;

  useEffect(() => {
    getRareProducts();
  }, []);

  const getRareProducts = async () => {
    const response = await axios.get(
      `${api}/products/category-name?categoryName=${categoryName}`
    );
    setRareProducts(response.data);
  };

  const deleteRareProduct = async (productId) => {
    await axios.delete(`${api}/product/${productId}`);
    getRareProducts();
  };

  return (
    <div>
      <h1 className="title">Rare Used Products</h1>
      <h2 className="subtitle">List of Rare Used Products</h2>
      {user && user.role === "admin" && (
        <NavLink to={"/rare-products/add"}>
          <button className="button is-primary mb-3">
            Add New Rarely Used Product
          </button>
        </NavLink>
      )}

      <table className="table is-striped is-fullwidth">
        <thead>
          <tr className="is-link">
            <th>No</th>
            <th>Product Name</th>
            <th>Shelflife in Month</th>
            <th>Shelflife in Day</th>
            {user && user.role === "admin" && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {rareProducts.map((rareProduct, index) => (
            <tr key={rareProduct.uuid}>
              <td>{index + 1}</td>
              <td>{rareProduct.name}</td>
              <td>{rareProduct.shelflifeInHour} Bulan</td>
              <td> {rareProduct.shelflifeInMinute} Hari</td>
              {user && user.role === "admin" && (
                <td>
                  <Link
                    to={`/rare-products/edit/${rareProduct.uuid}`}
                    className="button is-small is-info"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deleteRareProduct(rareProduct.uuid)}
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

export default RareProductList;
