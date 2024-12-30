import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const { user } = useSelector((state) => state.auth);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = async () => {
    const response = await axios.get(
      "https://api.shelflife-app.my.d.shelflife-app.my.id/categories"
    );
    setCategories(response.data);
  };

  const deleteCategory = async (categoryId) => {
    await axios.delete(
      `https://api.shelflife-app.my.d.shelflife-app.my.id/category/${categoryId}`
    );
    getCategories();
  };

  const createCategory = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://api.shelflife-app.my.d.shelflife-app.my.id/category",
        {
          name: name,
        }
      );
      getCategories();
    } catch (error) {
      if (error.message) {
        setMsg(error.response.data.msg);
      }
    }
  };

  return (
    <div>
      <h1 className="title">Categories</h1>
      <h2 className="subtitle">List of Category</h2>

      {user && user.role === "admin" && (
        <div className="content">
          <form onSubmit={createCategory}>
            <p className="has-text-centered">{msg}</p>
            <div className="field">
              <label className="label">Category Name</label>
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
            <div className="field ">
              <div className="control">
                <button type="submit" className="button is-success">
                  Create
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      <table className="table is-striped is-fullwidth">
        <thead>
          <tr className="is-link">
            <th>No</th>
            <th>Category Name</th>
            {user && user.role === "admin" && <th>Action</th>}
          </tr>
        </thead>
        <tbody>
          {categories.map((category, index) => (
            <tr key={category.uuid}>
              <td>{index + 1}</td>
              <td>{category.name}</td>
              {user && user.role === "admin" && (
                <td>
                  <button
                    onClick={() => deleteCategory(category.uuid)}
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

export default CategoryList;
