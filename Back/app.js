const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const https = require("https");
const http = require("http");
const fs = require("fs");

dotenv.config();
const app = express();

const productionPort = 3000;
const devPort = 3001;

const devServer = http.createServer(app);
const productionServer = https.createServer(
  {
    key: fs.readFileSync(process.env.SSL_PRIVKEY, "utf-8"),
    cert: fs.readFileSync(process.env.SSL_CERTKEY, "utf-8"),
  },
  app
);

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(cors({ origin: true, credentials: true }));

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

app.use("/user", userRoute);
app.use("/blog", blogRoute);

devServer.listen(devPort, () => console.log(`DEV listening ${devPort}`));
productionServer.listen(productionPort, () => console.log(`PROD listening ${productionPort}`));
