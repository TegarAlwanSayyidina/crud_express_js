const mysql = require('mysql2')
const dbConfig = require('../config/database')
const {
    responseNotFound,
    responseSuccess
} = require('../traits/ApiResponse')
const { connect } = require('../routes/book')
const pool = mysql.createPool(dbConfig)

const getBooks = (req, res) => {
    const query = "SELECT * FROM books"

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(query, (err, results) => {
            if(err) throw err
            
            responseSuccess(res, results, 'Books succesfully fetched')
        })

        connection.release()
    })
}

const getBook=(req, res) =>{
    const id = req.params.id

    const query = `SELECT * FROM books WHERE id=${id}`

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(query, (err, results) => {
            if(err) throw err
            
            if(results.length == 0) {
                responseNotFound(res)
                return
            }

            responseSuccess(res, results, 'Book Succesfully fetched')
        })

        connection.release()
    })
}

const addbook = (req, res) =>{
    const data ={
        nama: req.body.nama,
        author: req.body.author,
        publisher: req.body.publisher,
        year: req.body.year,
        page_count: req.body.page_count
    }

    const query = 'INSERT INTO books SET ?'

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(query, [data], (err, results) => {
        if(err) throw err

        responseSuccess(res, results, 'Book Succesfully Added')
        })

        connection.release()
    })
}

const updateBook = (req, res) => {
    const id = req.params.id

    const data = {
        nama: req.body.nama,
        author: req.body.author,
        publisher: req.body.publisher,
        year: req.body.year,
        page_count: req.body.page_count
    }

    const query = `UPDATE books SET ? WHERE id=${id}`
    
    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(query, [data], (err, results) => {
            if(err) throw err

            if(results.affectedRows == 0) {
                responseNotFound(res)
                return
            }
            responseSuccess(res, results, 'Book Succesfully Updated')
        })

        connection.release()
    })
}

const deleteBook =(req, res) => {
    const id = req.params.id

    const query = `DELETE FROM books WHERE id=${id}`

    pool.getConnection((err, connection) => {
        if(err) throw err

        connection.query(query, (err, results) => {
            if(err) throw err

            if(results.responseNotFound == 0){
                responseNotFound(res)
                return
            }

            responseSuccess(res, results, 'Book succesfully deleted')
        })

        connection.release()
    })
}

module.exports = {
    getBook,
    getBooks,
    addbook,
    updateBook,
    deleteBook
}