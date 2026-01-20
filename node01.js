

console.log("Tere maailm!"); // Konsooli väljastamise funktsioon
let nimi = "lehm"; // Muutjate defineerimine
const tervitus = nimi => "Tere, " + nimi + "!"; // Lambda funktsioon nimega tervitus,
//  mis võtab parameetriks nimi ning tagastab "Tere, (parameeter)!"
console.log(tervitus(nimi)); // Kutsutakse funktsioon tervitus, parameetrina antakse 
// muutuja nimi väärtuse (lehm) ning tagastatakse väärtuse, mida siis väljastatakse konsooli.

// Dünaamilised tekstid
nimi = "Mari";

console.log(`Tere, ${nimi}!`); // vormindatud string

// Objekti ja massiivi destrukteerimine

// objektid
const config = { // Objekti koostamine
    host: "localhost", // Objekti parameeter host
    user: "root", // Objekti parameeter user
    password: "secret" // Objekti parameeter password
};

const {host, user} = config; // Destrukteerimine:
// kood leiab parameetri nimega host objektist ning seab seda globaalseks muutuja väärtuseks.

console.log(host, user);

// massivid

const [esimene, teine] = ["a", "b", "c"]; // Destrukteerimine:
// kood määrab muutujate väärtuseid vastavalt massivi järjestusele.

console.log(esimene, teine);


// Vaikimisi väärtused (default values)
// Loon funktsiooni, mis võtab parameetriks nimi
// ning seab sellele vaikimisi väärtuse "külaline"
// kui funktsiooni kutsumisel andakse üle argumenti,
// siis parameeter võtab selle väärtuse
// seejärel, kasutades console.log()
// kood väljastab vormindatud sõnet konsooli
// Väljund (ilma antud argumendi): "Tere, külaline!"
// Väljund: "Tere, Hobune!"
const automaat_tervitus = (nimi = "külaline") => {
    console.log(`Tere, ${nimi}!`);
};

automaat_tervitus();
automaat_tervitus("Hobune");

// Asünkroonne süntaks (async ja await)

// Loon muutujad loeFail, mis hoiab endas asünkroonse funktsiooni
// mis omakorda täidab koodijuppi:
const loeFail = async () =>
{
    const fs = require('fs'); // analoogne "using" (C#), impordib FileSystem mooduli
    const sisu = await fs.promises.readFile("test.txt", "utf8"); 
    // loeb asünkroonselt faili test.txt sisu utf8 formaadis.
    console.log(sisu); // väljastab..
};

// loeFail(); // kutsub välja funktsiooni

const kustutaFail = async () =>
{
    const fs = require('fs');
    
    fs.unlink(`${__dirname}/test.txt`, (err) =>
    {
       if (err) throw err;
       console.log("Successfully deleted /Node-Alused/test.txt");
    });


};

//kustutaFail();


const trykustutaFail = async () =>
    {
        const fs = require('fs');
        try
        {
            fs.unlinkSync(`${__dirname}/test.txt`);
            console.log("Successfully deleted /Node-Alused/test.txt");

        }
        catch (err)
        {
            console.log("There was an error :C");
            throw err;
        }
    
    };

// trykustutaFail();

console.log("Eile oli hea õhtu"); // tavaline logi
console.warn("kuid me olime üleval päris kaua"); // hoiatus-taseme logi
console.error("Tänane hommik on rets"); // viga-taseme logi

console.log(__filename); // käivitatud faili nimi
console.log(__dirname); // käivitatud kaustiku nimi

const path = require("path"); // path moodul, failiteede vormindamiseks

const fail = path.join(__dirname, "test.txt"); // paneme kokku praeguse kaustikku ja test.txt
console.log(fail); // lõpp failitee.