import ProductModel from '../models/Products.js'

export const getLastcategories = async (req, res) => {
    try {
        const products = await ProductModel.find().exec();

        let categorySet = new Set();
        products.forEach((product) => {
            categorySet.add(product.category);
        });

        const uniqueCategories = Array.from(categorySet);

        res.json(uniqueCategories);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить категории',
        });
    }
};
export const getMaxPrice = async (req, res) => {
    try {
      const maxPriceProduct = await ProductModel.findOne().sort({ price: -1 }).exec();
      if (!maxPriceProduct) {
        return res.status(404).json({ message: 'Продукты не найдены' });
      }
      res.json({ maxPrice: maxPriceProduct.price });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить максимальную цену',
      });
    }
  };
export const getLastbrands = async (req, res) => {
    try {
        const products = await ProductModel.find().exec();

        let brandSet = new Set();
        products.forEach((product) => {
            brandSet.add(product.brandName);
        });

        const uniqueBrands = Array.from(brandSet);

        res.json(uniqueBrands);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить бренды',
        });
    }
};



export const remove = async (req, res) => {
    try {
        const productId = req.params.id;

        const doc = await ProductModel.findOneAndDelete({ _id: productId });

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }

        res.json({
            message: 'Статья успешно удалена',
            success: true
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось удалить статью'
        });
    }
}

export const getOne = async (req, res) => {
    try {
        const productId = req.params.id;
        const doc = await ProductModel.findOneAndUpdate(
            { _id: productId },
            { $inc: { viewsCount: 1 } },
            { returnDocument: 'after' }
        );

        if (!doc) {
            return res.status(404).json({
                message: 'Статья не найдена'
            });
        }
        res.json(doc);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статью'
        });
    }
}

export const getAll = async (req, res) => {
    try {
      const { q, category, brandName, price, isInStock, _start = 0, _limit = 10 } = req.query;
  
      let query = {};
  
      // Фильтр по названию
      if (q) {
        query.name = new RegExp(q, 'i');
      }
  
      // Фильтр по категории
      if (category && category !== 'все') {
        query.category = category;
      }
  
      // Фильтр по бренду
      if (brandName && brandName !== 'все') {
        query.brandName = brandName;
      }
  
      // Фильтр по цене (только максимальная цена)
      if (price) {
        const maxPrice = Number(price);
        if (!isNaN(maxPrice)) {
          query.price = { $lte: maxPrice };
        }
      }
  
      // Фильтр по наличию на складе
      if (isInStock == '') {
        query.isInStock = true;
      }
  
      const skip = parseInt(_start);
      const limit = parseInt(_limit);
      const products = await ProductModel.find(query)
        .skip(skip)
        .limit(limit);
  
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };



export const getForTags = async (req, res) => {
    try {
        const { tag } = req.params;
        const products = await ProductModel.find({ tags: tag });
        res.json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Не удалось получить статьи'
        });
    }
}



export const create = async (req, res) => {
  try {
    const { productionDate, ...rest } = req.body;
    const formattedDate = productionDate ? new Date(productionDate).toISOString().split('T')[0] : null;
    const doc = new ProductModel({
      ...rest,
      productionDate: formattedDate,
    });

    const product = await doc.save();
    res.json(product);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: 'Не удалось создать товар',
    });
  }
};
export const update = async (req, res) => {
    try {
        const productId = req.params.id;
        await ProductModel.updateOne({
            _id: productId,
        },{
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        })

        res.json({
            success: true,
        });
    }catch(err) {
        console.log(err);
        res.status(500).json({
            massage: 'nu ibnovitca'
        });
    }
}


export const createReview = async (req, res) => {
    const { productId } = req.params;
    const { rating, reviewTitle, reviewText, userId, date } = req.body;
  
    // Проверка наличия всех обязательных полей в теле запроса
    if (!rating || !reviewTitle || !reviewText || !userId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Отсутствуют обязательные поля в запросе',
      });
    }
  
    try {
      // Обновление продукта с добавлением нового отзыва
      await ProductModel.findByIdAndUpdate(productId, {
        $push: { reviews: req.body },
      });
  
      res.json({
        success: true,
        message: 'Отзыв успешно создан',
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Произошла ошибка при создании отзыва',
        error: error.message,
      });
    }
  };
  export const deleteReview = async (req, res) => {
    try {
      const { productId, userId } = req.params;
  
      // Находим продукт по его идентификатору
      const product = await ProductModel.findById(productId);
  
      if (!product) {
        return res.status(404).json({ message: 'Продукт не найден' });
      }
  
      // Фильтруем отзывы, удаляя тот, у которого userId совпадает с переданным
      const initialReviewCount = product.reviews.length;
      product.reviews = product.reviews.filter(review => review.userId !== userId);
  
      if (initialReviewCount === product.reviews.length) {
        return res.status(404).json({ message: 'Отзыв не найден' });
      }
  
      // Сохраняем обновленный продукт
      await product.save();
  
      res.status(200).json({ message: 'Отзыв успешно удален' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Ошибка при удалении отзыва' });
    }
  };