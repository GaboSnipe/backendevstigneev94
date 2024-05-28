import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import fs from 'fs';
import UserModel from '../models/User.js';

const DATA_DIR = './data';

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR);
}

const saveData = async (filename, data) => {
  const filePath = `${DATA_DIR}/${filename}.json`;
  await fs.promises.writeFile(filePath, JSON.stringify(data));
};

const getData = async (filename) => {
  const filePath = `${DATA_DIR}/${filename}.json`;
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
};

const deleteData = async (filename) => {
  const filePath = `${DATA_DIR}/${filename}.json`;
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

function generateSixDigitRandomNumber() {
  return Math.floor(100000 + Math.random() * 900000);
}

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
      avatarUrl: "/uploads/novator.png", 
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
export const wishupd = async (req, res) => {
  try {
    const userId = req.params.id;
    const newItemId = req.body.item; // Получаем только идентификатор элемента
    await UserModel.findByIdAndUpdate(userId, { $push: { userWishlist: newItemId } });

    res.status(200).send('Элемент добавлен в список желаний');
  } catch (error) {
    console.log(error);
    res.status(500).send('Произошла ошибка при обновлении списка желаний');
  }
}
export const wishdl = async (req, res) => {
  try {
    const userId = req.params.id;
    const itemIdToRemove = req.body.item; // Получаем только идентификатор элемента

    await UserModel.findByIdAndUpdate(
      userId,
      { $pull: { userWishlist: itemIdToRemove } }
    );

    res.status(200).send('Элемент удален из списка желаний');
  } catch (error) {
    console.error('Ошибка при удалении элемента из списка желаний:', error);
    res.status(500).send('Произошла ошибка при обновлении списка желаний');
  }
}
export const cartdl = async (req, res) => {
  try {
    const userId = req.params.id;
    const itemIdToRemove = req.body.item; // Получаем идентификатор элемента

    if (!userId || !itemIdToRemove) {
      return res.status(400).send('Идентификатор пользователя и элемента обязательны');
    }

    // Найдем пользователя по его идентификатору
    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).send('Пользователь не найден');
    }

    // Проверим, существует ли элемент в корзине пользователя
    const itemIndex = user.cartitems.findIndex(item => item.id === itemIdToRemove);

    if (itemIndex === -1) {
      return res.status(404).send('Элемент не найден в корзине');
    }

    // Удалим элемент из корзины пользователя
    user.cartitems.splice(itemIndex, 1);
    await user.save();

    res.status(200).send('Элемент удален из корзины');
  } catch (error) {
    console.error('Ошибка при удалении элемента из корзины:', error);
    res.status(500).send('Произошла ошибка при удалении элемента из корзины');
  }
};
export const cartclr = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!userId) {
      return res.status(400).send('Идентификатор пользователя обязателен');
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      return res.status(404).send('Пользователь не найден');
    }

    user.cartitems = []; 
    await user.save();

    return res.status(200).json({ message: 'Корзина пользователя успешно очищена' });
  } catch (error) {
    console.error('Ошибка при очистке корзины пользователя:', error);
    return res.status(500).json({ message: 'Произошла ошибка при очистке корзины пользователя' });
  }
};

export const cartupd = async (req, res) => {
  try {
    const userId = req.params.id;
    const newItemId = req.body.item; // Получаем только идентификатор элемента
    await UserModel.findByIdAndUpdate(userId, { $push: { cartitems: newItemId } });
    res.status(200).send('Элемент добавлен в список желаний');
  } catch (error) {
    console.log(error);
    res.status(500).send('Произошла ошибка при обновлении списка желаний');
  }
}
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
const emailVerificationData = {};

export const checkmailstart = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mail.ru",
      port: 465,
      secure: true,
      auth: {
        user: "sania.shop@internet.ru",
        pass: "kYkGERxDXLLPUGR1r19k",
      }
    });

    const randomNumber = generateSixDigitRandomNumber();
    const { email } = req.body;
    
    await saveData(email, { code: randomNumber, timestamp: Date.now() });

    await transporter.sendMail({
      from: "sania.shop@internet.ru",
      to: email,
      subject: "Подтверждения регистрации",
      text: `Ваш код подтверждения: ${randomNumber}`
    });

    return res.status(200).send({
      status: 200,
      message: 'Отправлено'
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Недействительная почта',
    });
  }
};

export const checkmailend = async (req, res) => {
  try {
    const { code, email } = req.body;
    const savedData = await getData(email);

    // Преобразование строки в число
    const savedCode = parseInt(savedData.code);
    const incomingCode = parseInt(code);

    if (!savedData || savedCode !== incomingCode) {
      return res.status(400).json({ message: 'Неверный код' });
    }

    const timestamp = savedData.timestamp;
    const currentTime = Date.now();
    if (currentTime - timestamp > 15 * 60 * 1000) { // Проверка на время жизни кода (15 минут)
      await deleteData(email);
      return res.status(400).json({ message: 'Код устарел. Пожалуйста, запросите новый код.' });
    }

    await deleteData(email);
    return res.status(200).json({ message: 'Код подтвержден' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Внутренняя ошибка сервера' });
  }
};
