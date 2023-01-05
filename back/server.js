const express = require("express");
const app = express();
var path = require('path');
const port = 3000;

function init(res, query) {
  res.send(query.userid);
}
//console.log(__dirname)


app.use('/static', express.static(path.join(__dirname + '/front')));

app.get("/", (req, res) => {
  res.send("Hello World!");
  console.log("Usta gönderiyorum");
});


app.get("/game", (req, res) => {
  switch (req.query.request) {
    case 'init':
      init(res, {
        userid: req.query.userid,
        size: req.query.size,
        mines: req.query.mines,
      });
      break;

      default:
          res.send("ZORT");
      break;
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
