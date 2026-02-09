// OIGE SERVER

const express = require('express');
const app = express();
const { getNews, getNewsById, deleteNews, createNews, updateNews, getUserByUsername, createUser, getUserById } = require("./database");
const {body, validationResult} = require('express-validator');

// SESSIOONI LOOMINE:
const session = require('express-session');
const bcrypt = require('bcrypt');
const {requireLogin, bypassLogin} = require('./middleware.js')

app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60}, // 1 minut
    httpOnly: true,
    sameSite: 'lax'
}));


app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.urlencoded({ extended: false }));
app.get('/', 
    body('username').trim().notEmpty(),
    async (req, res) => {
    /*const uudised = [
        {
            pealkiri: "Lehma muruplatsid on avalikuks kasutamiseks",
            sisu: "Lehma muruplatsid on nüüd avatud avalikuks kasutamiseks."
        },{
            pealkiri: "Avati teenuste muruplats",
            sisu: "Nüüd saab uurida teenuste muruplatsi ka, seal on kirjas teenused mida lehm pakub."
        },{
            pealkiri: "Hakati kasutama EJS mallimootor",
            sisu: "Lehma muruplatside jaoks hakati kasutama EJS mallimootorit, need uudised on serveri poolt väljastatud"
        }
    ];*/

    const sessionUser = req.session.user;

    let user = null;
    let username;
    if (!sessionUser){
        user = null;
        username = null;
        console.log('app.js 47:', username);
    } else {
        user = await getUserById(sessionUser.id);
        console.log('app.js 50:', user.username);
        username = user.username;
        console.log('app.js 52:', username);
    }


    // console.log(user.name);
    const news = await getNews();
    res.render('index', {title: "Avaleht", uudised: news, msg: req.query.msg, user: user});
});

app.get('/logout', requireLogin, (req, res) => {
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.redirect('/login');
});

app.get('/admin', requireLogin, async (req, res) =>{
    const news = await getNews();

    res.render('admin', {title: "Avaleht/Admin", msg: req.query.msg === 'login_success' ? 'Olete edukalt sisse logitud' : null, uudised: news});
});

app.get('/login', bypassLogin, (req, res) =>{
    res.render('login', {title: "Logi sisse", msg: req.query.msg === 'login_failed' ? 'Vale kasutajanimi või parool' : null});
});

// andmete valideerimine

app.get('/register', bypassLogin, (req, res) => {
   res.render('register', {title: 'Registreeri', msg: req.query.msg === 'register_failed' ? 'Vale kasutajanimi või parool' : null}); 
});


app.post('/register', 
    body('username').trim().notEmpty().withMessage('Kastuajanimi on kohustuslik'),
    body('password').trim().notEmpty().withMessage('Parool on kohustuslik'),

    async (req, res) =>
    {
        const errors = validationResult(req);
        if (!errors.isEmpty())
        {
            return res.render('register', {
            title: 'Registreeru', 
            msg: 'Väljad on kohustuslikud', 
            errors: errors.array()
            });
        }

        const {username, password} = req.body;
        let user;

        user = await getUserByUsername(username);

        if (user) {
            console.log('username already in use');
            return res.render('login', {title: 'Logi sisse', msg: 'Kasutajanimi hõivatud'});

        }

        const hash = await bcrypt.hash(password, 10);
        const role = 'user'
        await createUser(username, hash, role);
        console.log('app.js: ', username, hash, role);
        res.redirect('/?msg=register_success');
        

    }
) 
app.post('/login', 
    body('username').trim().notEmpty().withMessage('Kasutajanimi on kohustuslik'),
    body('password').trim().notEmpty().withMessage('Parool on kohustuslik'),

    async (req, res) => {
        // console.log(req.body);
        // kontrollime  valideerimise tulemusi
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('login', {
                title: "Logi sisse",
                msg: "Väljad on kohustuslikud",
                errors: errors.array()
            });
        }

        const {username, password} = req.body; // loeme vormi andmeid
        let user;

        try {
            user = await getUserByUsername(username);
        } catch (error) {
            console.error('Admebaasi viga:', error);
            return res.render('login', {title: 'Logi sisse', msg: 'Sisselogimine ebaõnnestus'});
        }

        if (!user) {
            return res.render('login', {title: "Logi sisse", msg: 'Vale kasutajanimi või parool'});
        }

        // võrdeleme paroole
        const match = await bcrypt.compare(password, user.password);

        // kui paroolid ei ühti
        if (!match) {
            return res.render('login', {title: 'Logi sisse', msg: 'Vale kasutajanimi või parool'});
        }

        // kui kõik korras salvestame kasutaja andmeid sessiooni

        req.session.user = {
            id: user.id,
            role: user.role
        };
    
        if (user.role === 'admin') {
            res.redirect('/admin?msg=login_success');
            res.end();
            return;
        }

        res.redirect(`/?msg=login_success&username=${username}`);
        /*
        if (username === 'admin' && password === 'admin') {
            // salvestame kasutaja andmeid sessiooni
            req.session.user = {id: 1, username: 'admin', role: 'admin'};
            res.redirect('/admin?msg=login_success');
        } else {
            res.render('login', {title: "Logi sisse", msg: 'Vale kasutajanimi või parool'});
        }*/

    }
)

/* SIMPLE POST:
app.post('/login', (req, res) =>{

    const {username, password} = req.body;
    console.log(`kasutajanimi: ${username}\nparool: ${password}`);
    if (username === 'admin' && password === 'admin') {
        res.redirect('/admin?msg=login_success');
    } else {
        res.render('login', {title: 'Logi sisse', msg: 'Vale kasutajanimi või parool'});
    }

    //res.redirect('/')
    //res.render('index', {title: "Avaleht", msg: req.query.msg});
})
*/
app.get('/show_data', (req, res) => {


    andmedJSONFILE = require("./assets/andmed.json")
    res.render('show_data', {title: "Registreerunute anmded", andmed: andmedJSONFILE})
})

app.get('/news/create', (req, res) =>{
    res.render('news_create', {title: "Lisa uudis", errors: [], valies: {}});
})

app.post('/news/create', 
    
    // andmete valideerimine 
    body('pealkiri').trim().notEmpty().withMessage('Pealkiri on kohustuslik'),
    body('sisu').trim().notEmpty().withMessage('Sisu on kohustuslik'),
    
    async (req, res) => {
        //kontrollime valideerimise tulemusi
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log(errors.array());
            return res.render('news_create', 
                {title: "Lisa uudis", 
                errors: errors.array(), 
                values: req.body});
        }

    console.log("Post meetod kaivitatud")
    const {pealkiri, sisu} = req.body;
    await createNews(pealkiri, sisu);
    res.redirect('/');
})

app.post('/news/delete', async (req, res) => {
    const {id} = req.body;
    const deleted = await deleteNews(id);
    
    if (deleted) {
        res.redirect('/?msg=deleted');
    } else {
        res.redirect('/?msg=delete_failed')
    }
    /*res.redirect('/');*/
})

app.get('/news/:id/edit', async (req, res) => {
    const id = req.params.id;
    const uudis = await getNewsById(id);
    res.render('edit', {title: "Muuda", uudis});
})

app.post('/news/:id/edit', async (req, res) => {
    const id = req.params.id;
    const { pealkiri, sisu} = req.body;
    await updateNews(id, pealkiri, sisu);
    res.redirect(`/news/${id}`);
});
app.get('/news/:id', async (req, res) => {
    const id = req.params.id;
    const uudised = await getNewsById(id);

    res.render('news', {title: uudised.pealkiri, uudis: uudised});
});

/*
app.get('/news/delete/:id', async (req, res) => {
    const id = req.params.id;
    await deleteNews(id);
    res.redirect('/');
});
*/


app.get('/teenused', (req, res) => {
    res.render('teenused', {title: "Teenused"});
});

app.use((req, res) => {
    res.render('404', {title: ":C"});
});

app.listen(3000);
