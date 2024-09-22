//get imps
const express = require("express");
const Gun = require("gun");

const app = express();
const port = 3000;  //feel free to change, but remember to change it in app.js too
app.use(Gun.serve)  //use gun middleware

//boot server
const server = app.listen(port, () => {
    console.log(`Gun server running at http://localhost:${port}`)
    console.log('To interact with the gun server, open your browser and navigate to http://localhost:3000/gun')
})

//init gun
Gun({ web: server });