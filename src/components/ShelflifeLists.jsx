import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ShelflifeList = () => {
  const [shelflifes, setShelflife] = useState([]);


  useEffect(() => {
    getShelflife();
  }, []);

  const getShelflife = async () => {
    const response = await axios.get("http://localhost:5000/shelflifes");
    setShelflife(response.data);
  };


  return (
    <div>
      <h1 className="title">Shelflife</h1>
      <h2 className="subtitle">List of Shelflife</h2>
      <Link to="/shelflifes/add" className="button is-primary mb-2 mr-2">
        Add New Shelflife
      </Link>
      <Link to="/shelflifes/user-history" className="button is-info mb-2">
        See History
      </Link>
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
          {shelflifes.map((shelflife, index) => (
            <tr key={shelflife.uuid}>
              <td>{index + 1}</td>
              <td>{shelflife.name}</td>
              <td>{shelflife.date}</td>
              <td>{shelflife.startShelflife}</td>
              <td>{shelflife.endShelflife}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShelflifeList;
