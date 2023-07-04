const express = require("express");
const multer = require('multer');
const cors = require('cors');
const port = 3000;
const path = require("path")

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
    // Sets saved filename(s) to be original filename(s)
  })
  
// Set saved storage options:
const upload = multer({ storage: storage })

app.post("/api", upload.array("files"), (req, res) => {
// Sets multer to intercept files named "files" on uploaded form data
    console.log("Files uploaded successfully")
    console.log(req.body); // Logs form body values
    console.log(req.files); // Logs any files
    res.json({ message: "File(s) uploaded successfully" });

});

app.get("/", function(req, res){
	res.render("index");
    console.log("*** Sent home ***")
})

app.listen(port, function() {
    console.log("Server running on PORT " + port);
});