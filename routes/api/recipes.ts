import { Router, RequestHandler } from "express";
import { Recipe } from "../../models/recipe";

const recipeRouter = Router();

const create: RequestHandler = (req, res) => {
    const recipe = new Recipe(req.body);
    recipe
        .save()
        .then((data) => res.send(data).status(200))
        .catch((err) => {
            res.status(500).send({ message: err.message || "Error when creating recipe" })
        })
}


/**Return all recipes from the db */
const findAll: RequestHandler = (req, res) => {
    Recipe.find()
        .then((recipes) => {
            res.status(200).send(recipes);
            console.log(recipes);
        })
        .catch((err) => {
            res.status(500).send({ message: err.message || "Error finding all recipes" })
        })
}

/**Return a recipe by id */
const findOne: RequestHandler = (req, res) => {
    Recipe.findById(req.params.id)
        .then((recipe) => {
            if (!recipe) {
                return res.status(404).send({
                    message: "recipe not found with id " + req.params.id 
                });
            }
            res.status(200).send(recipe);
            console.log(recipe);
        })
        .catch((err) => {
            return res.status(500).send({
                message: "Error retrieving recipe with id" + req.params.id + " " + err.message,
            });
        });
}

/**Remove recipe from the db */
const remove: RequestHandler = (req, res) => {
    Recipe.findByIdAndDelete(req.params.id)
        .then((recipe) => {
            if (!recipe) return res.status(404).send({ message: "recipe not found"  });
            res.send({ message: "recipe deleted successfully" });
        })
        .catch((err) => {
            return res.status(500).send({ message: "Could not delete recipe" + " " + err.message,  })
        })
}

/**Update an recipe by id   */
const updateRecipe: RequestHandler = (req, res) => {
    //todo Add validation of req.body
    Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((recipe) => {
            if (!recipe) return res.status(404).send({ message: "recipe not found" });
            res.status(200).send(recipe);
        })
        .catch((err) => {
            return res.status(404).send({ message: "Error updating recipe" + " " + err.message, })
        })
}



//All routes for the recipes API

recipeRouter.post('/recipes', create);
recipeRouter.get("/recipes", findAll);
recipeRouter.get('/recipes/:id', findOne)
recipeRouter.delete('/recipes/:id', remove);
recipeRouter.put('/recipes/:id', updateRecipe);
recipeRouter.get('/test', (req, res) => {
    res.send("I am working");
    });

export default recipeRouter;