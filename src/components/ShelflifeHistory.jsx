import React, { useState, useEffect } from "react";
import axios from "axios";

const ShelflifeList = () => {
  const [shelflifes, setShelflife] = useState([]);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const api = process.env.REACT_APP_SERVER;

  useEffect(() => {
    shelflifeByDate();
  }, []);

  const shelflifeByDate = async () => {
    try {
      if (!date) {
        setError("Silahkan Pilih Tanggal");
        return;
      }

      const response = await axios.get(
        `${api}/user-shelflifes/history?date=${date}`
      );
      setShelflife(response.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        setError(error.response.data.msg);
      } else {
        setError("Terjadi kesalahan saat mengambil data.");
      }
      setShelflife([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (date) {
      shelflifeByDate();
    } else {
      setError("Harap pilih tanggal.");
    }
  };

  useEffect(() => {
    if (date) shelflifeByDate();
  }, [date]);

  return (
    <div>
      <h1 className="title">Shelflife</h1>
      <h2 className="subtitle">List of Shelflife</h2>
      <div>
        <form onSubmit={handleSearch} className="box">
          <div className="field has-addons">
            <div className="control">
              <input
                type="date"
                className="input"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div className="control">
              <button type="submit" className="button is-primary">
                Search
              </button>
            </div>
          </div>
        </form>

        <table className="table is-bordered is-striped is-narrow is-hoverable is-fullwidth">
          <thead>
            <tr className="is-link">
              <th>No</th>
              <th>Product Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Start of Shelflife</th>
              <th>End of Shelflife</th>
            </tr>
          </thead>
          <tbody>
            {shelflifes.length > 0 ? (
              shelflifes.map((shelflife, index) => (
                <tr key={shelflife.uuid}>
                  <td>{index + 1}</td>
                  <td>{shelflife.name}</td>
                  <td>{shelflife.startDate}</td>
                  <td>{shelflife.endDate}</td>
                  <td>{shelflife.startShelflife}</td>
                  <td>{shelflife.endShelflife}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ fontSize: "25px" }}>
                  No Shelflife in this date
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShelflifeList;
