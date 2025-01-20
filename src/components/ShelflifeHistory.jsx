import React, { useState, useEffect } from "react";
import axios from "axios";

const ShelflifeList = () => {
  const [shelflifes, setShelflife] = useState([]);
  const [date, setDate] = useState("");
  const [name, setName] = useState("");
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

      const query = `${api}/user-shelflifes/history?date=${date}${
        name ? `&name=${encodeURIComponent(name)}` : ""
      }`;

      const response = await axios.get(query);
      setShelflife(response.data);
      setError("");
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
          <div className="field">
            <label className="label">Nama Produk</label>
            <div className="control">
              <input
                type="text"
                className="input"
                placeholder="Cari berdasarkan nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <div className="field">
            <div className="field has-addons">
              <div className="control">
                <input
                  type="date"
                  className="input"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
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
              <th className="has-text-white">No</th>
              <th className="has-text-white">Product Name</th>
              <th className="has-text-white">Start Date</th>
              <th className="has-text-white">End Date</th>
              <th className="has-text-white">Start of Shelflife</th>
              <th className="has-text-white">End of Shelflife</th>
              <th className="has-text-white">Status</th>
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
                  <td>{shelflife.status}</td>
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
