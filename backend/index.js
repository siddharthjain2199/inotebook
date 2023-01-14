const connectToMongo = require('./db')
const path = require("path")
const express = require('express')
var cors = require('cors');

connectToMongo();
const app = express()
const port = process.env.port || 5000 //3000
 
app.use(cors())
app.use(express.json())
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
//Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.use(express.static(path.join(__dirname, "./build")));
app.get("*", function (_, res) {
  res.sendFile(
    path.join(__dirname, "./build/index.html"),
    function (err) {
      res.status(500).send(err);
    }
  );
});

app.listen(port, () => {
  // try {
  //   connectToMongo();
    console.log(`iNotebook backend listening on port http://localhost:${port}`)    
  // } catch (e) {
  //   console.log(e.message)
  // }
})
