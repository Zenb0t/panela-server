

/** Create a new ingredient */

const createIngredient: RequestHandler = (req, res) => {
    const ingredient = new IngredientModel(req.body);
    ingredient
        .save()
        .then((data) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.send(data).status(200);
            console.log(`Ingredient created: 200 OK ${data.name}`);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: err.message || "Error when creating ingredient" })
        })
}

/** Get all ingredients */

const getAll: RequestHandler = (req, res) => {
    IngredientModel.find()
        .then((data) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.send(data).status(200);
            console.log(`Ingredients fetched: 200 OK`);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: err.message || "Error when fetching ingredients" })
        })
}

/** Get one ingredient by id */

const getOne: RequestHandler = (req, res) => {
    IngredientModel.findOne({ id: req.params.id })
        .then((data) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.send(data).status(200);
            console.log(`Ingredient fetched: 200 OK`);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: err.message || "Error when fetching ingredient" })
        })
}

/** Update an ingredient by id */

const update: RequestHandler = (req, res) => {
    IngredientModel.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })
        .then((data) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.send(data).status(200);
            console.log(`Ingredient updated: 200 OK`);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: err.message || "Error when updating ingredient" })
        })
}

/** Delete an ingredient by id */

const deleteOne: RequestHandler = (req, res) => {
    IngredientModel.findOneAndDelete({ id: req.params.id })
        .then((data) => {
            res.header("Access-Control-Allow-Origin", "*");
            res.send(data).status(200);
            console.log(`Ingredient deleted: 200 OK`);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: err.message || "Error when deleting ingredient" })
        })
}