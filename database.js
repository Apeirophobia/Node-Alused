const mysql = require('mysql2/promise');
require('dotenv').config();

console.log(process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_NAME);


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


// Testi ühendust andmebaasiga
async function testYhendus() {
    await pool.query('SELECT * from news');
    console.log('Ühendus olemas');
}

async function getNews(){
    const [rows] = await pool.query("SELECT * FROM news");
    //console.log(rows);
    return rows;
}

async function getNewsById(id){
    const [rows] = await pool.query("SELECT * FROM news WHERE ID = ?", [id]);
    return rows[0];
}

async function deleteNews(id){
    const [result] = await pool.query("DELETE FROM news WHERE id = ?", [id]);
    return result.affectedRows > 0;
}

async function createNews(pealkiri, sisu){
    await pool.query("INSERT INTO news (pealkiri, sisu) VALUES(?, ?)", [pealkiri, sisu]);
}

async function updateNews(id, pealkiri, sisu){
    const sql = "UPDATE news SET pealkiri = ?, sisu = ? WHERE id = ?"
    await pool.execute(sql, [pealkiri, sisu, id]);
}

async function createUser(username, password, role){
    await pool.query("INSERT INTO users(username, password, role) VALUES(?, ?, ?)", [username, password, role]);
    console.log('DATABASE.js has received: ', username, password, role);
    // await pool.execute(sql, [username, password, role]);
}

async function getUserByUsername(username) {
    const [rows] = await pool.execute(
        'SELECT * FROM users WHERE username = ?',
        [username]
    )
    return rows[0];
}
async function getUserById(id) {
    console.log('database.js: ', id);
    const [rows] = await pool.execute(
        'SELECT * FROM users WHERE id = ?',
        [id]
    )
    return rows[0];
}

testYhendus();

module.exports = {getNews, getNewsById, deleteNews, createNews, updateNews, createUser, getUserByUsername, getUserById};
