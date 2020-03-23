/*
    Jacky Tea
    Gridlock Pathfinder
    app.js
*/ 

//required modules
const express = require("express");
const path = require("path");

//create application
const app = express();

//static files
app.use(express.static(path.join(__dirname, "public")));

//home route
app.get('/', (req,res) => {
    res.sendFile(path.join(__dirname, "public/index.html"));
});

//404 route
app.use((req, res) => {
    res.status(404).send("Error 404: " + req.hostname + req.url + " could not be found!");
});

//run application on PORT X
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { 
    console.log(`App is now running on port: ${PORT}`); 
});
