import { Router, RequestHandler } from "express";
import { Recipe } from "../../models/recipe";


const recipeRouter = Router();

/** Create a new recipe */

const create: RequestHandler = (req, res) => {
    const recipe = new Recipe(req.body);
    recipe.id = recipe._id;
    recipe
        .save()
        .then((data) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.send(data).status(200);
            console.log(`Recipe created: 200 OK ${data.title}`);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: err.message || "Error when creating recipe" })
        })
}


/**Return all recipes from the db */
const findAll: RequestHandler = (req, res) => {
    Recipe.find()
        .then((recipes) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.status(200).send(recipes);
            console.log(`Recipes found: 200 OK`);
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
            res.header("Access-Control-Allow-Origin", "*");
            res.status(200).send(recipe);
            console.log(`Recipe found: 200 OK ${recipe.title}`);
        })
        .catch((err) => {
            return res.status(500).send({
                message: "Error retrieving recipe with id" + req.params.id + " " + err.message,
            });
        });
}

/**Update an recipe by id   */
const updateRecipe: RequestHandler = (req, res) => {
    //TODO Add validation of req.body
    Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((recipe) => {
            if (!recipe) return res.status(404).send({ message: "recipe not found" });
            res.header("Access-Control-Allow-Origin", "*");
            res.status(200).send(recipe);
            console.group(`Recipe updated: 200 OK ${recipe.id}`);
            // console.log(recipe);
            console.groupEnd();
        })
        .catch((err) => {
            console.error(err);
            return res.status(404).send({ message: "Error updating recipe" + " " + err.message, })
        })
}

/**Remove recipe from the db */
const remove: RequestHandler = (req, res) => {
    Recipe.findByIdAndDelete(req.params.id)
        .then((recipe) => {
            if (!recipe) return res.status(404).send({ message: "recipe not found" });
            res.header("Access-Control-Allow-Origin", "*");
            res.send({ message: "recipe deleted successfully" });
            console.group(`Recipe deleted: 200 OK ${recipe.id}`);
            // console.log(recipe);
            console.groupEnd();
        })
        .catch((err) => {
            return res.status(500).send({ message: "Could not delete recipe" + " " + err.message, })
        })
}

/** Remove all recipes from the db */
const removeAll: RequestHandler = (req, res) => {
    Recipe.deleteMany({})
        .then((recipe) => {
            if (!recipe) return res.status(404).send({ message: "recipe could not be deleted" });
            res.header("Access-Control-Allow-Origin", "*");
            res.send({ message: "recipes deleted successfully" });
            console.group(`Recipes deleted: 200 OK`);
            // console.log(recipe);
            console.groupEnd();
        })
        .catch((err) => {
            return res.status(500).send({ message: "Could not delete recipe" + " " + err.message, })
        })
}



//All routes for the recipes API

recipeRouter.post('/recipes', create);
recipeRouter.get("/recipes", findAll);
recipeRouter.get('/recipes/:id', findOne)
recipeRouter.delete('/recipes/:id', remove);
recipeRouter.put('/recipes/:id', updateRecipe);
recipeRouter.delete('/recipes', removeAll); //TODO: For testing only, remove later

export default recipeRouter;