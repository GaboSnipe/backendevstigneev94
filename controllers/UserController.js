import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import UserModel from '../models/User.js';

export const register = async (req, res) => {
  try {
    const existingEmailUser = await UserModel.findOne({ email: req.body.email });
    if (existingEmailUser) {
      return res.status(400).json({ message: 'Этот адрес электронной почты уже используется' });
    }
    const existingPhoneUser = await UserModel.findOne({ phone: req.body.phone });
    if (existingPhoneUser) {
      return res.status(400).json({ message: 'Этот номер телефона уже используется' });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      name: req.body.name, 
      lastname: req.body.lastname, 
      email: req.body.email, 
      passwordHash: hash, 
      phone: req.body.phone, 
      address: req.body.address, 
      avatarUrl: req.body.avatarUrl, 
      roles: [],
      userWishlist: [],
      cartitems: []

      
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось зарегистрироваться',
    });
  }
};
export const update = async (req, res) => {
  try {
    const existingEmailUser = await UserModel.findOne({ email: req.body.email });
    if (existingEmailUser && existingEmailUser._id.toString() !== req.params.id) {
      return res.status(400).json({ message: 'Этот адрес электронной почты уже используется' });
    }
    const existingPhoneUser = await UserModel.findOne({ phone: req.body.phone });
    if (existingPhoneUser && existingPhoneUser._id.toString() !== req.params.id) {
      return res.status(400).json({ message: 'Этот номер телефона уже используется' });
    }
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, {
      name: req.body.name, 
      lastname: req.body.lastname, 
      email: req.body.email, 
      passwordHash: hash, 
      phone: req.body.phone, 
      address: req.body.address, 
      avatarUrl: req.body.avatarUrl, 
      roles: [],
      userWishlist: [],
      cartitems: []
    }, { new: true }); 
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    const token = jwt.sign(
      {
        _id: updatedUser._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = updatedUser._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось обновить пользователя',
    });
  }
};




export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if (!isValidPass) {
      return res.status(400).json({
        message: 'Неверный логин или пароль',
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      'secret123',
      {
        expiresIn: '30d',
      },
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Не удалось авторизоваться',
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден',
      });
    }

    const { passwordHash, ...userData } = user._doc;

    res.json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Нет доступа',
    });
  }
};