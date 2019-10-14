const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
const port = process.env.PORT || 1234

const db = mysql.createConnection({
  host: 'localhost',
  user: 'Antonius',
  password: 'AntoniusF@97',
  database: 'moviepurwadhika',
  port: 3306,
  // multipleStatements: true
  // timezone: 'UTC'
})

app.use(bodyParser.json())
app.use(cors())
app.use(express.static('public'))

app.get('/', (req,res) => {
  res.status(200).send('<h1>Welcome To our API</h1>')
})


// ===============================================================================
// manage movies
// read - get movies
app.get('/getmovies', (req,res) => {
  var nama = req.query.nama ? req.query.nama : '';
  
  var sql =`SELECT * FROM movies WHERE nama LIKE '%${nama}%';`;
  db.query(sql, (err,results) => {
      if(err) {
          // console.log(err)
          return res.status(500).send(err)
      }

      res.status(200).send(results)
  })
})

// add-post movies 
app.post('/addmovies', (req,res) => {
  var movies = req.body;   
      if(movies) {
        var sql = `INSERT INTO movies SET ? `
       
        db.query(sql, movies, (err, results) => {
            if(err) {
                return res.status(500).send(err)
            }

            res.status(200).send(results)
        })
    }
    else {
        res.status(500).send('Tolong kasih Body')
    }
})

// put-update movies
app.put('/editmovies/:id', (req,res) => {
  var sql = `UPDATE movies SET ? WHERE idmovies = ${req.params.id};`;
  db.query(sql, req.body, (err,results) => {
      if(err) {
          return res.status(500).send(err)
      }
      res.status(200).send(results)
  })
})

// delete movies
app.delete('/deletemovies/:id', (req,res) => {
  var sql = `DELETE FROM movies WHERE idmovies = ${db.escape(req.params.id)}`     
  db.query(sql, (err, results) => {
      if(err) {
          return res.status(500).send(err)
      }
      var sql = `DELETE FROM movcat WHERE idmovie = ${db.escape(req.params.id)}`
      db.query(sql,(err,results)=>{
        if(err){
          return res.status(500).send(err)
        }
        // res.status(200).send(results)
      })
      res.status(200).send(results)
  })
})


// =================================================================================
// manage categories
// read-get categories
app.get('/getcategories', (req,res) => {
  var sql =`SELECT * FROM categories;`;
  db.query(sql, (err,results) => {
      if(err) {
          // console.log(err)
          return res.status(500).send(err)
      }
      res.status(200).send(results)
  })
})

// post-add categories
app.post('/addcategories', (req,res) => {
  var categories = req.body;   
      if(categories) {
        var sql = `INSERT INTO categories SET ? `
       
        db.query(sql, categories, (err, results) => {
            if(err) {
                return res.status(500).send(err)
            }

            res.status(200).send(results)
        })
    }
    else {
        res.status(500).send('Tolong kasih Body')
    }
})

// put-update categories
app.put('/editcategories/:id', (req,res) => {
  var sql = `UPDATE categories SET ? WHERE idcategories = ${req.params.id};`;
  db.query(sql, req.body, (err,results) => {
      if(err) {
          return res.status(500).send(err)
      }
      res.status(200).send(results)
  })
})

// delete categories
app.delete('/deletecategories/:id', (req,res) => {
  var sql = `DELETE FROM categories WHERE idcategories = ${db.escape(req.params.id)}`     
  db.query(sql, (err, results) => {
      if(err) {
          return res.status(500).send(err)
      }
      var sql = `DELETE FROM movcat WHERE idcategory = ${db.escape(req.params.id)}`
      db.query(sql,(err,results)=>{
        if(err){
          return res.status(500).send(err)
        }
        // res.status(200).send(results)
      })
      res.status(200).send(results)
  })
})


// ==================================================================================
// manage movcat
// get - render sqljoin 3 table
app.get('/getmovcat', (req,res) => {  
  var sql =`select nama, namacategories from movcat 
  join movies on movcat.idmovie = movies.idmovies
  join categories on movcat.idcategory = categories.idcategories;`;
  db.query(sql, (err,results) => {
      if(err) {
          // console.log(err)
          return res.status(500).send(err)
      }
      res.status(200).send(results)
  })
})

// post ke table movcat, input idmovies dan id categories / dari dropdown list
app.post('/addmovcat', (req,res) => {
  var movcat = req.body;   
      if(movcat) {
        var sql = `INSERT INTO movcat SET ? `
       
        db.query(sql, movcat, (err, results) => {
            if(err) {
                return res.status(500).send(err)
            }

            res.status(200).send(results)
        })
    }
    else {
        res.status(500).send('Tolong kasih Body')
    }
})

// delete movcat by idmovcat
app.delete('/deletemovcat/:id', (req,res) => {
  var sql = `DELETE FROM movcat WHERE idmovcat = ${db.escape(req.params.id)}`     
  db.query(sql, (err, results) => {
      if(err) {
          return res.status(500).send(err)
      }
      res.status(200).send(results)
  })
})


app.listen(port, () => console.log(`API aktif di port ${port}`))