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

// Function to fetch website title using Async/Await
const fetchTitle = async (address) => {
  if (!isValidURL(address)) {
    return { address, title: "INVALID URL" };
  }

  const formattedAddress = address.startsWith("http") ? address : `http://${address}`;
  const requestFn = formattedAddress.startsWith("https") ? get : httpGet;

  return new Promise((resolve) => {
    requestFn(formattedAddress, (response) => {
      let data = "";

      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        const $ = load(data);
        const title = $("title").text().trim() || "NO TITLE";
        resolve({ address, title });
      });
    }).on("error", () => {
      resolve({ address, title: "NO RESPONSE" });
    });
  });
};

// 🏠 Default Route for Testing
app.get("/", (req, res) => {
  res.send(`
    <h1>Welcome to the Async/Await Server!</h1>
    <p>Try <a href='/I/want/title?address=https://example.com'>this link</a> to fetch a title.</p>
  `);
});

// Route to fetch page titles
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

  const results = await Promise.all(addressList.map(fetchTitle));
  res.send(renderHTML(results));
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
  console.log(`✅ Async/Await Server is running on http://localhost:${PORT}`);
});

export default app;
