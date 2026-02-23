const { db } = require("./../config/database");
const path = require('path');
const dotenv = require('dotenv');

const https = require('https');
const http = require('http');
const { URL } = require('url');

exports.getEvents = (req, res) => {
  const query = new URLSearchParams(req.query).toString();

  const options = {
    hostname: "falconeyesolutions.com",
    port: 80,
    path: `/api/get_events?${query}`,
    method: "GET",
  };

  const proxyReq = http.request(options, (proxyRes) => {
    let data = "";

    proxyRes.on("data", (chunk) => {
      data += chunk;
    });

    proxyRes.on("end", () => {
      try {
        res.json(JSON.parse(data));
      } catch (e) {
        console.error("Erreur parsing JSON:", e.message);
        res.status(500).send(data);
      }
    });
  });

  proxyReq.on("error", (err) => {
    console.error("Erreur proxy falcon:", err.message);
    res.status(500).send("Erreur proxy falcon: " + err.message);
  });

  proxyReq.end();
}

exports.getFalcon = (req, res) => {
  const options = {
    hostname: "31.207.34.171",
    port: 80,
    path: `/api/get_devices?&lang=fr&user_api_hash=${process.env.api_hash}`,
    method: "GET",
  };

  const proxyReq = http.request(options, (proxyRes) => {
    let data = "";

    proxyRes.on("data", (chunk) => {
      data += chunk;
    });

    proxyRes.on("end", () => {
      console.log("Falcon API response:");
      try {
        res.json(JSON.parse(data));
      } catch (e) {
        console.error("Erreur parsing JSON:", e.message);
        res.status(500).send(data);
      }
    });
  });

  proxyReq.on("error", (err) => {
    console.error("Erreur proxy falcon:", err.message);
    res.status(500).send("Erreur proxy falcon: " + err.message);
  });

  proxyReq.end();
}