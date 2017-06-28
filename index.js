const express = require('express');
const app = express();

app.use(express.static(__dirname + '/client'));
app.use(function (req, res, next) {
    next({status: 404});
});
app.use(function (err, req, res, next) {
    if (err) {
        let message = 'something went wrong';
        let code = err.status;
        if (err.status === 404) {
            message = 'Seite nicht gefunden';
            code = 404;
        }
        res.status(code).send(message);
    }
    else {
        next(err);
    }
});
app.get("/", function (req, res) {
    res.sendFile("/index.html", { root: __dirname + "/client/" });

});

const hostname = '127.0.0.1';
const port = 1985;
app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
