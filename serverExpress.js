const express = require("express"); // kasutame package (teenust) express
const app = express(); // määrame muutuja app väärtuseks express-olemi
const fs = require("fs");
//app.listen(3000, () => {console.log("Server töötab pordil 3000"); }); // käivitame meetodit listen
// võtab vastu pordi, hostname: anname pordi 3000, ning meetodi käivitamisel väljastame logi kasutades lamda funktsiooni

// lühiversioon
// app.listen(3000)

/* PÄRINGUTE SUUNAMINE */

// html failide teenindamine
app.use("/assets", express.static(__dirname + "/assets"));

app.get('/', (req, res) => {

    /*
    fs.readFile('./views/index.html', (err, data) => {
        if (err){
            res.end();
            return;
        }

        res.write(data);
        res.end();
    });*/
    res.sendFile("./views/index.html", {root: __dirname}); // lühidam versioon eelmisest:
    // võtab vastu "teekonna" ning juurkaustiku kust peab seda otsima
});

app.get('/teenused', (req, res) => {
    /*
    fs.readFile('./views/teenused.html', (err, data) => {
        if (err) {
            res.end();
            return;
        }

        res.write(data);
        res.end();
    });*/
    res.sendFile("./views/teenused.html", {root: __dirname}); // lühidam versioon eelmisest:
    // võtab vastu "teekonna" ning juurkaustiku kust peab seda otsima
});

/* ÜMBERSUUNAMISED */
app.get('/vana-leht', (req, res) => {

    res.status(301);
    res.redirect('/');}); // kui kasutaja saadab päringu /vana-leht, 
// siis server suunab teda ümber avalehele

/* 404 LEHE TEENINDAMINE */
app.use((req, res) => {

    res.status(404).sendFile('./views/404.html', {root: __dirname});
});

app.listen(3000)

