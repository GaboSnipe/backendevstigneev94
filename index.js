import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import { registerValidation, loginValidation, ProductsCreateValidation } from './validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, ProductsController } from './controllers/index.js';
mongoose    
     .connect(process.env.MONGODB_URI)
     .then(() => console.log('DB ok'))
     .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.put('/user/:id',  registerValidation, handleValidationErrors, UserController.update);




app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/products', async (req, res) => {
  const { _page = 1, _limit = 4 } = req.query;
  const skip = (parseInt(_page) - 1) * parseInt(_limit);
  const products = await Product.find().skip(skip).limit(parseInt(_limit));
  res.json(products);
});
app.get('/tags', ProductsController.getLastTags);
app.get('/tags/:tag', ProductsController.getForTags);
app.get('/products/tags', ProductsController.getLastTags);
app.get('/products/:id', ProductsController.getOne);
app.post('/products', checkAuth, ProductsCreateValidation, handleValidationErrors, ProductsController.create);
app.delete('/products/:id', checkAuth, ProductsController.remove);
app.patch('/products/:id',checkAuth,ProductsCreateValidation,handleValidationErrors,ProductsController.update,);

app.listen(process.env.PORT || 8080, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});