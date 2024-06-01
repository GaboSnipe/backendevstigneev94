import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';

import mongoose from 'mongoose';

import { registerValidation, loginValidation, ProductsCreateValidation, OrderCreateValidation } from './validations.js';

import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, ProductsController, OrdersController } from './controllers/index.js';
mongoose    
     .connect(process.env.MONGODB_URI)
    //  process.env.MONGODB_URI
    //  mongodb+srv://Gaboben_Veliki:2I3b6WceGwO9W3SP@cluster0.hj3cri7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
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
app.use(cors({
  origin: '*'
}));

app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);
app.get('/user/:id', UserController.getWho);
app.put('/user/:id',  registerValidation, handleValidationErrors, UserController.update);
app.get('/users',  checkAuth, UserController.getAll);
app.post('/users/:id/wishlist', UserController.wishupd);
app.put('/users/:id/wishlist/remove', UserController.wishdl);
app.post('/users/:id/cart', UserController.cartupd);
app.post('/users/:id/admin', UserController.makeAdmin);
app.delete('/users/:id/admin', UserController.delAdmin);
app.put('/users/:id/cart/remove', UserController.cartdl);
app.delete('/clear-cart/:id', UserController.cartclr);
app.post('/user/checkmailstart', UserController.checkmailstart);
app.post('/user/checkmailend', UserController.checkmailend);





app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});





app.get('/categories', ProductsController.getLastcategories);
app.get('/brands', ProductsController.getLastbrands);
app.get('/max-price', ProductsController.getMaxPrice);
app.get('/products', ProductsController.getAll);
app.get('/orders', OrdersController.getAll);
app.get('/orders/:id', OrdersController.getuserorder);
app.get('/products/:id', ProductsController.getOne);
app.post('/products/:productId',checkAuth, ProductsController.createReview);
app.post('/products', checkAuth, ProductsCreateValidation, handleValidationErrors, ProductsController.create);
app.post('/orders', checkAuth, OrderCreateValidation, handleValidationErrors, OrdersController.create);
app.delete('/products/:id', checkAuth, ProductsController.remove);
app.patch('/products/:id',checkAuth,ProductsCreateValidation,handleValidationErrors,ProductsController.update,);
app.put('/orders/:orderId', OrdersController.orderStatus);


app.listen(process.env.PORT || 8080, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});