import express from "express";
import { get } from "https";
import { get as httpGet } from "http";
import dotenv from "dotenv";
import { load } from "cheerio";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Function to validate URLs before requesting
const isValidURL = (url) => {
  return /^(https?:\/\/)?([\w.-]+)(\.[a-z]{2,6})(\/.*)?$/.test(url);
};

// Function to fetch website title
const fetchTitle = (address, callback) => {
  if (!isValidURL(address)) {
    return callback(null, { address, title: "NO RESPONSE" });
  }

  const formattedAddress = address.startsWith("http") ? address : `http://${address}`;
  const requestFn = formattedAddress.startsWith("https") ? get : httpGet;

  requestFn(formattedAddress, (response) => {
    let data = "";

    response.on("data", (chunk) => {
      data += chunk;
    });

    response.on("end", () => {
      const $ = load(data);
      const title = $("title").text().trim() || "NO TITLE";
      callback(null, { address, title });
    });
  }).on("error", () => {
    callback(null, { address, title: "NO RESPONSE" });
  });
};

//  Default Route for Testing
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Callback-based Server!</h1>
    <p>Try <a href='/I/want/title?address=https://example.com'>this link</a> to fetch a title.</p>
  `);
});

// Route to fetch page titles
app.get("/I/want/title", (req, res) => {
  let addresses = req.query.address;

  if (!addresses) {
    return res.status(400).send("<h1>Bad Request: No address provided</h1>");
  }

  // Convert to array if single address is passed
  const addressList = Array.isArray(addresses) ? addresses : [addresses];

  // Remove empty addresses
  const filteredAddresses = addressList.filter(addr => addr.trim() !== "");

  if (filteredAddresses.length === 0) {
    return res.status(400).send("<h1>Bad Request: No valid address provided</h1>");
  }

  const results = [];
  let count = 0;

  filteredAddresses.forEach((address) => {
    fetchTitle(address, (error, result) => {
      results.push(result);
      count++;

      if (count === filteredAddresses.length) {
        res.send(renderHTML(results));
      }
    });
  });
});

// Function to generate HTML response
const renderHTML = (titles) => {
  return `
    <html>
    <head></head>
    <body>
        <h1>Following are the titles of given websites:</h1>
        <ul>
          ${titles.map((t) => `<li>${t.address} - "${t.title}"</li>`).join("\n")}
        </ul>
    </body>
    </html>
  `;
};

// Start Express Server
app.listen(PORT, () => {
  console.log(` Callback-based Server is running on http://localhost:${PORT}`);
});

export default app;
