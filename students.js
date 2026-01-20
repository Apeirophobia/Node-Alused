// students.js

const opilased = ["Mari", "Jüri", "Kati", "Peeter", "Liis"];
const vanused = [19, 21, 20, 22, 18];

/*
opilased.forEach(nimi => {
    console.log(nimi);
});
*/

// forEach, tekitab tavalise for-tsükli,
// muutuja nimi võtab järjest iga liige väärtust
// ning seega käivitub ka lambda funktsioon
// console.log(nimi);

// require kasutamisel laeb terve fail sisse ning käivitub automaatselt,
// see ei ole hea.
// seega, kasutame module.exports käsu.

module.exports = {opilased, vanused} // need on andmed, mida saab teine fail kasutada