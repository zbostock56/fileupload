const express = require("express");
const multer = require('multer');
const cors = require('cors');
const path = require("path");
const https = require("https");
const fs = require("fs");
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const port = 3000;
const proxy_port = 8000;

const app = express();
app.use(cors()); // Allows incoming requests from any IP
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")

// Start by creating some disk storage options:
const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + '/uploads');
    },
    // Sets file(s) to be saved in uploads folder in same directory
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
  })

const upload = multer({ storage: storage })

// --- SERVER ---

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.post("/", upload.array("files"), (req, res, err) => {
  if (!err) {
    console.log("Files uploaded successfully");
    console.log(req.body); // Logs form body values
    console.log(req.files); // Logs any files
    res.json({ message: "File(s) uploaded successfully" });
  } else {
    console.log(err);
  }
});

app.get("/", function(req, res) {
  res.render("index");
  var date = new Date();
  console.log("*** Sent home at " + date + " ***");
})


app.listen(port, () => {
    var date = new Date();
    console.log(`Server listening on port ${port} at ` + date);
});

// ----------------

// --- PROXY ---

const proxy = express();

proxy.use('/', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  onProxyReq: fixRequestBody,
  logLevel: "debug"
}));

proxy.listen(proxy_port, () => {
  var date = new Date();
  console.log(`Proxy listening on port ${proxy_port} at ` + date);
});

// ----------------



/*
const options = {
  key: fs.readFileSync(path.join(__dirname,'./cert/key.pem')),
  cert: fs.readFileSync(path.join(__dirname,'./cert/cert.pem'))
};

const sslserver = https.createServer(options, app)

sslserver.listen(port, () => {
  console.log(`Secure Server is listening on port ${port}`)
});
*/
