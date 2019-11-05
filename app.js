const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe')

const app = express();

mongoose.set('useCreateIndex', true);

const uri = "mongodb+srv://pearl:tryingatlas@cluster0-7b9rt.mongodb.net/test?retryWrites=true";
mongoose.connect(uri, { useNewUrlParser: true })
.then(() => {
    console.log('Successfully connected')
})
.catch((err) => {
    console.log(`Couldn't connect ${err}`)
})

// mongoose.connect("mongodb://localhost/recipe", { useNewUrlParser:true }, function(err){
//     if(err){
//         console.log("can't connet to database " + err)
//         return;
//     }
//     console.log("connection locally");
// }).catch()


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use((req, res, next) => {
    console.log('server started successfully')
    next()
})

//post route for recipes
app.post('/api/recipes', (req, res) => {
    const recipe = new Recipe({
        title: 'rice',
        ingredients: 'water, maggi, rice, pepper, onions',
        instructions: 'put water on fire first, then add rice, and start cooking',
        difficulty: 'not difficult',
        time: '20'
    });
    recipe.save().then( () => {
        res.status(201).json({
        message: 'Post saved successfully!'
        });
    }).catch((error) => {
        res.status(400).json({
        error: error
        });
    });
})

app.put('/api/recipes/:id', (req, res) => {
  const recipe = new Recipe({
    _id: req.params.id,
    title: req.body.title,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    difficulty: req.body.difficulty,
    time: req.body.time
  });
  Recipe.updateOne({_id: req.params.id}, recipe).then(
    () => {
      res.status(201).json({
        message: 'Recipe updated successfully!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
})
app.delete('api/recipes/:id', (req, res) => {
  const id = req.params.id;
  Recipe.deleteOne({_id: id}).then(
    () => {
      res.status(200).json({
        message: 'Deleted!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
})

app.use('/api/recipes/:id', (req, res) => {
  const id = req.params.id;
  Recipe.findOne({
    _id: id
  }).then((recipe) => {
      res.status(201).json(recipe);
    }
  ).catch((error) => {
      res.status(404).json({
        error: error
      });
    }
  );
})


//GET route for recipes
app.use('/api/recipes', (req, res) => {
    Recipe.find().then(
        (recipe) => {
          res.status(200).json(recipe);
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
})


module.exports = app;
