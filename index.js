import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import { registerValidation, loginValidation, ProductsCreateValidation } from './validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, ProductsController } from './controllers/index.js';
mongoose    
     .connect('mongodb+srv://Gaboben_Veliki:2I3b6WceGwO9W3SP@cluster0.hj3cri7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
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

app.get('/tags', ProductsController.getLastTags);
app.get('/tags/:tag', ProductsController.getForTags);
app.get('/products', ProductsController.getAll);
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