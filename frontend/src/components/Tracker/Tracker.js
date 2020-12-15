import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core/";
import SearchIcon from "@material-ui/icons/Search";
import axios from "axios";
import moment from "moment";
const Tracker = () => {
  const [trackvalue, setTrackValue] = useState("");
  const [data, setData] = useState({ message: "", data: [] });
  console.log(trackvalue);
  const handleChange = (e) => {
    setTrackValue(e.target.value);
  };
  const trackOrder = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:4000/api/products/trackorder", {
        trackingNumber: trackvalue,
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
        setTrackValue("");
      })
      .catch((err) =>
        setData({
          message: err.response.request.response,
          data: [],
        })
      );
  };
  console.log(typeof data.data[0]);
  console.log(Boolean(data.data));
  return (
    <div>
      <form
        onSubmit={trackOrder}
        style={{
          margin: "25px auto",
          width: "600px",
          border: "1px solid grey",
          borderRadius: "10px",
          display: "flex",
          flexDirection: "row",
          alignContent: "center",
          justifyContent: "center",
          padding: "15px",
        }}
      >
        <TextField
          value={trackvalue}
          onChange={handleChange}
          id="outlined-basic"
          label="Order ID"
          variant="outlined"
          style={{ margin: "5px", padding: "5px", width: "300px" }}
        />
        <Button
          style={{ height: "50px", marginTop: "12px", padding: "10px" }}
          endIcon={<SearchIcon />}
          variant="contained"
          color="primary"
          type="submit"
        >
          Track Order
        </Button>
      </form>
      <div
        style={{
          display: "flex",
          margin: "0 auto",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {data.message && <p>{data.message}</p>}
      </div>
      <div
        style={{
          display: "flex",
          margin: "0 auto",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {data.data[0] !== undefined ? (
          <div>
            <p>
              <b>Client name:</b> {data.data[0].clientname}
            </p>
            <p>
              <b>Current order Location:</b> {data.data[0].orderLocation}
            </p>
            <p>
              <b>Order Status:</b>
              {data.data[0].orderMessage}
            </p>
            <p>
              <b> Ordered Date:</b>
              {moment(data.data[0].date).format("MMMM Do YYYY, h:mm:ss a")}
            </p>
            <p>
              <b> Adress of Delivery:</b>
              {data.data[0].adress &&
                `${data.data[0].adress.city}, ${data.data[0].adress.postcode}, ${data.data[0].adress.street}`}
            </p>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Tracker;
