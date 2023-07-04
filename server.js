const express = require("express")
const path = require("path")
const multer = require("multer")
const app = express()
const port = 3000;
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")
	
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		// 'uploads' is the Upload_folder_name
		cb(null, "uploads")
	},
	filename: function (req, file, cb) {
	    cb(null, file.fieldname)
	}
})
	
const upload = multer({ storage: storage }).single("folder");	

app.get("/", function(req,res){
	res.render("signup");
})
	
app.post("/upload", function (req, res, next) {		
	upload (req,res,function(err) {
		if(err instanceof multer.MulterError) {
			res.send(err)
            console.log("*** Multer Error ***")
            console.log(err)
		} else if (err) { 
            res.send(err)
            console.log("*** Unknown Error ***")
            console.log(err)
        } else {
			res.send("Success, Image uploaded!")
            res.render("success")
		}
	})
})
	
app.listen(port, function(error) {
	if(error) throw error
		console.log("Server created Successfully on PORT " + port)
})