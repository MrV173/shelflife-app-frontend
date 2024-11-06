import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import alarmSound from "../alarm.wav";
import { useSelector } from "react-redux";
import { IoWarning, IoPlay } from "react-icons/io5";

const Welcome = () => {
  const [selectedWip, setSelectedWip] = useState("");
  const [hour, setHour] = useState(0);
  const [minute, setMinute] = useState(0);
  const [wips, setWips] = useState([]);
  const [isAlarmActive, setIsAlarmActive] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [products, setProducts] = useState([]);
  const [msg, SetMsg] = useState("");
  const audioRefs = useRef({});
  const [startAlarm, setStartAlarm] = useState({});
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    getWip();
    getProduct();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false });
      setCurrentTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const getProduct = async () => {
    const response = await axios.get("http://localhost:5000/products");
    setProducts(response.data);
  };

  const getWip = async () => {
    const response = await axios.get("http://localhost:5000/shelflifes");
    setWips(response.data);
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
      getWip();
    } catch (error) {
      if (error.response) {
        SetMsg(error.response.data.msg);
      }
    }
  };

  const playAlarm = (uuid) => {
    if (!audioRefs.current[uuid]) {
      audioRefs.current[uuid] = new Audio(alarmSound);
    }
    audioRefs.current[uuid]
      .play()
      .catch((error) => console.error("Alarm error:", error));
  };

  const muteAlarm = (uuid) => {
    if (audioRefs.current[uuid]) {
      audioRefs.current[uuid].volume = 0;
      setStartAlarm((prev) => ({ ...prev, [uuid]: false }));
      console.log(`alarm dimatikan untuk uuid : ${uuid}`);
    } else {
      console.log(`no audio for : ${uuid}`);
    }
  };

  const waste = (endTime) => {
    const [endHour, endMinute, endSecon] = endTime.split(":").map(Number);
    const endDate = new Date();
    endDate.setHours(endHour, endMinute, endSecon, 0);

    const [currentHour, currentMinute, curretnSecond] = currentTime
      .split(":")
      .map(Number);
    const currentDate = new Date();
    currentDate.setHours(currentHour, currentMinute, curretnSecond, 0);

    return currentDate >= endDate;
  };

  const checkAlarm = (uuid, endShelflife) => {
    const now = new Date();
    const [endHour, endMinute, endSecond] = endShelflife.split(":").map(Number);
    const endTime = new Date();
    endTime.setHours(endHour, endMinute, endSecond, 0);

    if (now >= endTime) {
      playAlarm(uuid);
    }
  };

  useEffect(() => {
    if (user && user.role === "user") {
      wips.forEach((wip) => {
        checkAlarm(wip.uuid, wip.endShelflife);
      });
    }
  }, [wips, currentTime]);

  return (
    <div>
      <div className="has-text-centered">
        <h1 className="title">Shelflifes</h1>
      </div>
      <div>
        {user && user.role === "user" && (
          <div className="grid">
            <div className="card is-shadowless">
              <div className="card-content">
                <div className="content">
                  <form onSubmit={createShelflife}>
                    <p className="has-text-centered">{msg}</p>
                    <div className="field">
                      <label className="label">Product Name</label>
                      <div className="control">
                        <div className="select is-fullwidth">
                          <select
                            value={selectedWip}
                            onChange={handleSelectChange}
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
        {user && user.role === "user" && (
          <div>
            {!isAlarmActive && (
              <button
                onClick={() => setIsAlarmActive(true)}
                className="button is-primary is-medium is-fullwidth"
              >
                START THE APP <IoPlay />
              </button>
            )}
          </div>
        )}

        {user && user.role === "user" && (
          <div className="grid">
            <table className="table is-striped is-fullwidth">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Product Name</th>
                  <th>Date</th>
                  <th>Start of Shelflife</th>
                  <th>End of Shelflife</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {wips.map((wip, index) => (
                  <tr
                    key={wip.uuid}
                    style={{
                      fontWeight: "bolder",
                      backgroundColor: waste(wip.endShelflife)
                        ? "red"
                        : "transparent",
                    }}
                  >
                    <td
                      style={{
                        color: waste(wip.endShelflife) ? "white" : "black",
                      }}
                    >
                      {index + 1}
                    </td>
                    <td
                      style={{
                        color: waste(wip.endShelflife) ? "white" : "black",
                      }}
                    >
                      {wip.name}
                    </td>
                    <td
                      style={{
                        color: waste(wip.endShelflife) ? "white" : "black",
                      }}
                    >
                      {wip.date}
                    </td>
                    <td
                      style={{
                        color: waste(wip.endShelflife) ? "white" : "black",
                      }}
                    >
                      {wip.startShelflife}
                    </td>
                    <td
                      style={{
                        color: waste(wip.endShelflife) ? "white" : "black",
                      }}
                    >
                      {wip.endShelflife}
                    </td>
                    <td>
                      {waste(wip.endShelflife) && (
                        <button
                          className="button is-light is-inverted"
                          onClick={() => muteAlarm(wip.uuid)}
                        >
                          Waste
                          <IoWarning
                            className="ml-2"
                            style={{ fontSize: "20px" }}
                          />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {user && user.role === "admin" && (
        <div style={{ fontSize: "25px", fontFamily: "sans-serif" }}>
          <strong>Welcome... {user && user.name}</strong>
        </div>
      )}
    </div>
  );
};

export default Welcome;
