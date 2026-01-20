// const minu_ryhm = require("./students.js");
let {opilased, vanused} = require("./students.js");

//console.log(minu_ryhm); // väljastab kõik ülekantud andmed

// kuidas pääseda üksikväärtustele

console.log(opilased, vanused);
/*
console.log(minu_ryhm.opilased);
console.log(minu_ryhm.vanused);
*/

// destrukteerimine

// core moodulid
// fs - failide ja kaustade lugemine, kirjutamine kustutamine

const fs = require("fs");

// faili lugemine
fs.readFile("./assets/tekst.txt", "utf-8", (err, data) => { // loeb faili kasutades, failiteed, krüpteerimist
    if (err) { // kui tekkis viga
        console.log("Viga: " + err);
    }
    console.log(data); // väljastab rida andmeid
});

// faili sisu kirjutamine
// writeFile kirjutab sisu üle
fs.writeFile("./assets/uustekst.txt", "ma igatsen sind", (err) => {
    if (err) {
        console.log("Viga: " + err);
        return;
    }
    console.log("Fail kirjutatud");
});

// appendFile kirjutab juurde 
fs.appendFile("./assets/tekst.txt", "\nOleks tore näha sind veel üks kord", (err) => {
    if (err) {
        console.log("Viga: " + err);
        return;
    }
    console.log("Faili on lisatud tekst");
});

// faili kustutamine
// unlink kustutab faili
fs.unlink("./assets/uustekst.txt", (err) => {
    if (err) {
        console.log("Viga: " + err);
        return;
    }
    console.log("Fail on kustutatud");
});

// kausta loomine
fs.mkdir("./newFolder", (err) => {
    if (err) {
        console.log("Viga: " + err);
        return;
    }
    console.log("Kaust loodud");
});

// kausta kustutamine
fs.rmdir("./newFolder", (err) => {
    if (err) {
        console.log("Viga: " + err);
        return;
    }
    console.log("Kaust kustatud");
});


// path - failiteede koostamine ja töötlemine platvormiüleselt
// http - HTTP serveri loomine ja päringute käsitlemine
// os - operatsioonisüsteem info (kasutaja, mälu, platvorm)
// process - programmi käivitamise info, argumendid ja keskkond
// url - URL-ide parsimine ja töötlemine
// crypto - krüpteerimine, hashid, juhuslikud väärtused
// events - sündmuspõhine loogika
