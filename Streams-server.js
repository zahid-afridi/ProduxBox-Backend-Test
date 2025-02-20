import express from "express";
import http from "http";
import https from "https";
import { load } from "cheerio";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Function to validate URLs before requesting
const isValidURL = (url) => {
  return /^(https?:\/\/)?([\w.-]+)(\.[a-z]{2,6})(\/.*)?$/.test(url);
};

// Function to fetch website title using Streams
const fetchTitle = (address) => {
  return new Promise((resolve) => {
    if (!isValidURL(address)) {
      return resolve({ address, title: "NO RESPONSE" });
    }

    const formattedAddress = address.startsWith("http") ? address : `http://${address}`;
    const client = formattedAddress.startsWith("https") ? https : http;

    const options = {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    };

    client.get(formattedAddress, options, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk; 
      });

      res.on("end", () => {
        const $ = load(data);
        const title = $("title").text().trim() || "NO TITLE";
        resolve({ address, title });
      });
    }).on("error", () => {
      resolve({ address, title: "NO RESPONSE" });
    });
  });
};

// Default Route
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Stream-based Server!</h1>
    <p>Try <a href='/I/want/title?address=https://example.com'>this link</a> to fetch a title.</p>
  `);
});

// Route to fetch page titles using Streams
app.get("/I/want/title", async (req, res) => {
  let addresses = req.query.address;

  if (!addresses) {
    return res.status(400).send("<h1>Bad Request: No address provided</h1>");
  }

  // Convert to array and remove empty values
  const addressList = (Array.isArray(addresses) ? addresses : [addresses])
    .map(addr => addr.trim())
    .filter(addr => addr !== "");

  if (addressList.length === 0) {
    return res.status(400).send("<h1>Bad Request: No valid address provided</h1>");
  }

  // Stream response header
  res.setHeader("Content-Type", "text/html");
  res.write(`
    <html>
    <head></head>
    <body>
        <h1>Following are the titles of given websites:</h1>
        <ul>
  `);

  // Stream results
  for (const address of addressList) {
    const result = await fetchTitle(address);
    res.write(`<li>${result.address} - "${result.title}"</li>\n`);
  }

  // Close the HTML response
  res.write(`
        </ul>
    </body>
    </html>
  `);
  res.end();
});


app.listen(PORT, () => {
  console.log(`✅ Stream-based Server is running on http://localhost:${PORT}`);
});

export default app;
