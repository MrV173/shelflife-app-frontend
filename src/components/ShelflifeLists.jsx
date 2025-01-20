import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  IoDesktop,
  IoCloud,
  IoWarning,
  IoBag,
  IoMedical,
  IoServer,
  IoEgg,
  IoCart,
} from "react-icons/io5";
import { useSelector } from "react-redux";
import alarmSound from "../alarm.wav";
import { NavLink } from "react-router-dom";

const ShelflifeList = () => {
  const [activeTab, setActiveTab] = useState("Hot Display");
  const [currentTime, setCurrentTime] = useState("");
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
  const [activeButton, setActiveButton] = useState({});
  const audioRefs = useRef({});
  const [mutedAlarm, setMutedAlarms] = useState({});
  const { user } = useSelector((state) => state.auth);
  const api = process.env.REACT_APP_SERVER;

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
  }, [selectedCategory]);

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setSelectedProduct("");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("en-GB", {
        hour12: false,
      });
      setCurrentTime(formattedTime);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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

  const createShelflife = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${api}/shelflife`, {
        name: selectedWip,
        hour: hour,
        minute: minute,
        categoryId: categoryId,
      });
      await fetchData(activeTab);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.msg);
      }
    }
  };

  const updateStatus = async (uuid, status) => {
    try {
      await axios.patch(`${api}/shelflifes/${uuid}`, { status: status });
      await fetchData(activeTab);
      console.log("status updated");
    } catch (error) {
      console.error(error.response?.data?.msg);
    }
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
      setError("Error fetching data");
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const waste = (endDate, endShelflife, uuid) => {
    const now = new Date();
    const today = now.toISOString().split("T")[0];

    if (endDate === today) {
      const [endHour, endMinute, endSecond] = endShelflife
        .split(":")
        .map(Number);
      const endTime = new Date();
      endTime.setHours(endHour, endMinute, endSecond, 0);

      if (now >= endTime) {
        playAlarm(uuid);
        return true;
      }
    }
    return false;
  };

  const playAlarm = (uuid) => {
    if (!audioRefs.current[uuid]) {
      audioRefs.current[uuid] = new Audio(alarmSound);
    }
    audioRefs.current[uuid]
      .play()
      .then(() => {
        setActiveButton((prev) => ({ ...prev, [uuid]: true }));
      })
      .catch((error) => console.error("Alarm error", error));
  };

  const muteAlarm = (uuid) => {
    if (audioRefs.current[uuid]) {
      audioRefs.current[uuid].volume = 0;
      audioRefs.current[uuid].currentTime = 0;
      setMutedAlarms((prev) => ({
        ...prev,
        [uuid]: true,
      }));
    }
  };

  const handleMuteandWaste = (uuid) => {
    muteAlarm(uuid);
    updateStatus(uuid, "Waste");
  };

  const handleUpdateandHidden = (uuid) => {
    muteAlarm(uuid);
    updateStatus(uuid, "Habis");
  };

  return (
    <div>
      {user && user.role === "user" && (
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
            <li>
              <NavLink to={"/shelflifes/rare-product"}>
                <span className="icon is-small">
                  <IoCart />
                </span>
                <span>Rarely Used Product</span>
              </NavLink>
            </li>
          </ul>
        </div>
      )}
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

      {user && user.role === "user" && (
        <table className="table is-striped is-fullwidth is-narrow">
          <thead>
            <tr className="is-link">
              <th className="has-text-white">Product Name</th>
              <th className="has-text-white">Start Date</th>
              <th className="has-text-white">End Date</th>
              <th className="has-text-white">Start of Shelflife</th>
              <th className="has-text-white">End of Shelflife</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data
                .filter((item) => item.status === "none")
                .map((item, index) => {
                  const isWaste = waste(
                    item.endDate,
                    item.endShelflife,
                    item.uuid
                  );
                  const isMuted = mutedAlarm[item.uuid] || false;
                  const isButtonActive = activeButton[item.uuid] || false;
                  return (
                    <tr
                      key={index}
                      style={{
                        fontWeight: "bolder",
                        backgroundColor: isMuted
                          ? "green"
                          : isWaste
                          ? "red"
                          : "transparent",
                        color: isWaste ? "white" : "black",
                      }}
                    >
                      <td
                        style={{
                          color: isWaste ? "white" : "black",
                        }}
                      >
                        {item.name}
                      </td>
                      <td style={{ color: isWaste ? "white" : "black" }}>
                        {item.startDate}
                      </td>
                      <td style={{ color: isWaste ? "white" : "black" }}>
                        {item.endDate}
                      </td>
                      <td style={{ color: isWaste ? "white" : "black" }}>
                        {item.startShelflife}
                      </td>
                      <td style={{ color: isWaste ? "white" : "black" }}>
                        {item.endShelflife}
                      </td>
                      <td>
                        <button
                          className="button is-small is-fullwidth has-text-weight-bold has-text-danger is-rounded "
                          onClick={() => handleUpdateandHidden(item.uuid)}
                        >
                          Habis
                        </button>
                      </td>
                      <td>
                        {isButtonActive && (
                          <button
                            className="button is-small is-fullwidth has-text-weight-bold has-text-danger is-inverted is-rounded is-outlined"
                            onClick={() => handleMuteandWaste(item.uuid)}
                          >
                            Waste
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td>
                  <div>No Shelfifes</div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      {user && user.role === "admin" && (
        <div className="grid mb-3">
          <div className="card is-shadowless">
            <div className="card-content">
              <div className="content">
                <h1>Welcome Admin</h1>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShelflifeList;
