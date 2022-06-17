import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import jwt from "jsonwebtoken";

const Quote = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState("");
  const [tempQuote, setTempQuote] = useState("");

  async function populateQuote() {
    const req = await fetch("http://localhost:5000/api/quote", {
      method: "GET",
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    });

    //await is added so we can wait  till we get data from backend
    const data = await req.json();
    if (data.status === "OK") {
      setQuote(data.quote);
    } else {
      console.log(data.error);
    }
  }

  useEffect(() => {
    // perfom the check here

    const token = localStorage.getItem("token");

    if (token) {
      const user = jwt.decode(token);
      if (!user) {
        localStorage.removeItem("token");
        // eslint-disable-next-line
        navigate("/login");
      } else {
        populateQuote();
      }
    }
  }, []);

  // updateQuote will be callled on form submit -- this will send data to backend

  async function updateQuote(event) {
    event.preventDefault();
    const req = await fetch("http://localhost:5000/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },

      body: JSON.stringify({
        quote: tempQuote,
      }),
    });

    const data = await req.json();
    if (data.status === "OK") {
      setQuote(tempQuote);
      setTempQuote("");
    } else {
      console.log(data.error);
    }
  }

  return (
    <>
      <h1>hello user</h1>
      <h2>Your Quote:{quote || "sorry no quote found"}</h2>{" "}
      <div>
        <form onSubmit={updateQuote}>
          <input
            type="text"
            placeholder="Quote here"
            value={tempQuote}
            onChange={(e) => setTempQuote(e.target.value)}
          />
          <input type="submit" value="Update Quote" />
        </form>
      </div>
    </>
  );
};

export default Quote;
