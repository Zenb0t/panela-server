import { Router, RequestHandler } from "express";
import { Recipe } from "./model"

const recipeRouter = Router({ mergeParams: true });

/** Creates a new recipe */
const create: RequestHandler = async (req, res) => {
  try {
    const recipe = new Recipe(req.body);
    if (!req.query.userId)
      return res
        .status(400)
        .send({ message: "Query parameter userId is required" });
    recipe.ownerId = req.query.userId as string;
    //TODO: Add validation
    // recipe.validate()

    const data = await recipe.save();
    res.header("Access-Control-Allow-Origin", "*");
    res.send(data).status(201);
    console.log(`Recipe created: 201 OK ${data.title}`);
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .send({ message: err.message || "Error when creating recipe" });
  }
};

/**Return all recipes from the db */
const findAll: RequestHandler = (req, res) => {
  Recipe.find()
    .then((recipes) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.status(200).send(recipes);
      console.log(`Recipes found: 200 OK`);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: err.message || "Error finding all recipes" });
    });
};

/**Return all recipes from the userId in the db */
const findAllRecipesByUserId: RequestHandler = (req, res) => {
  if (!req.query.userId)
    return res
      .status(400)
      .send({ message: "Query parameter userId is required" });
  Recipe.find({ ownerId: req.query.userId })
    .then((recipes) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.status(200).send({ recipes: recipes, userId: req.params.userId });
      console.log(`All Recipes found: 200 OK`);
    })
    .catch((err) => {
      res
        .status(500)
        .send({
          message:
            err.message ||
            `Error finding all recipes for user ${req.params.userId}`,
        });
    });
};

/**Return a recipe by id */
const findOne: RequestHandler = (req, res) => {
  Recipe.findById(req.params.id)
    .then((recipe) => {
      if (!recipe) {
        return res.status(404).send({
          message: "recipe not found with id " + req.params.id,
        });
      }
      res.header("Access-Control-Allow-Origin", "*");
      res.status(200).send(recipe);
      console.log(`Recipe found: 200 OK ${recipe.title}`);
    })
    .catch((err) => {
      return res.status(500).send({
        message:
          "Error retrieving recipe with id" + req.params.id + " " + err.message,
      });
    });
};

/**Update an recipe by id   */
const updateRecipe: RequestHandler = (req, res) => {
  Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((recipe) => {
      if (!recipe) return res.status(404).send({ message: "recipe not found" });
      res.header("Access-Control-Allow-Origin", "*");
      res.status(200).send(recipe);
      console.group(`Recipe updated: 200 OK ${recipe.id}`);
      console.groupEnd();
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(404)
        .send({ message: "Error updating recipe" + " " + err.message });
    });
};

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
      return res
        .status(500)
        .send({ message: "Could not delete recipe" + " " + err.message });
    });
};

/** Remove all recipes from the db */
const removeAll: RequestHandler = (req, res) => {
  Recipe.deleteMany({})
    .then((recipe) => {
      if (!recipe)
        return res.status(404).send({ message: "recipe could not be deleted" });
      res.header("Access-Control-Allow-Origin", "*");
      res.send({ message: "recipes deleted successfully" });
      console.group(`Recipes deleted: 200 OK`);
      // console.log(recipe);
      console.groupEnd();
    })
    .catch((err) => {
      return res
        .status(500)
        .send({ message: "Could not delete recipe" + " " + err.message });
    });
};
