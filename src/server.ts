import express from 'express';
import { auth } from 'express-openid-connect';
import { requiresAuth } from 'express-openid-connect'; //add when required to protect routes
import sanitizedConfig from './config';
import recipeRouter from './routes/api/recipes';
import initDB from './database';
import cors from 'cors';
import ingredientRouter from './routes/api/ingredients';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(sanitizedConfig.PORT, () => {
  console.log(`⚡️[server]: Server is running at ${sanitizedConfig.BASE_URL}`);
});

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: sanitizedConfig.SESSION_SECRET,
  baseURL: sanitizedConfig.BASE_URL,
  clientID: sanitizedConfig.AUTH0_CLIENT_ID,
  issuerBaseURL: sanitizedConfig.AUTH0_DOMAIN,
};

//initialize database
initDB(sanitizedConfig.URI_MONGODB);

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

// allow pre-flight cors requests
app.use(cors());

// require api routes
app.use('/api',recipeRouter);
app.use('/api',ingredientRouter);

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

// example of a protected route
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});