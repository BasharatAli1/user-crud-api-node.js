const express = require('express');
const app = express();
var morgan = require('morgan')
var mongoose = require("mongoose");
var bodyParser = require('body-parser')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'))
// app.use(express.static(__dirname + '/public'));

var dbConfig = require('./app/config/db.config');

const port = process.env.PORT || 3000;

mongoose.connect(dbConfig.url,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Database connected!"))
.catch(err => console.log("Cannot connect to the database", err));

require('./app/routes/user.routes')(app);

app.listen(port, () => console.log(`App listening on port ${port}`))

module.exports = {
  app
}
