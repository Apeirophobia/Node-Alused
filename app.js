const express = require('express');
const app = express();
const { getNews, getNewsById, deleteNews, createNews, updateNews } = require("./database");
const {body, validationResult} = require('express-validator');

app.set('view engine', 'ejs');

app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.urlencoded({ extended: false }));
app.get('/', async (req, res) => {
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
    const news = await getNews();
    res.render('index', {title: "Avaleht", uudised: news, msg: req.query.msg});
});

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
