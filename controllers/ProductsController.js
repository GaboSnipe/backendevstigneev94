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
    try{
        const doc = new ProductModel({
            name: req.body.name,
            description: req.body.description,
            isInStock: req.body.isInStock,
            category: req.body.category,
            availableSizes: req.availableSizes,
            reviews: req.reviews,
            produtionDate: req.produtionDate,
            brandName: req.brandName,
            productCode: req.productCode,
            imageUrl: req.imageUrl,
            price: req.price,
            additionalImageUrls: req.additionalImageUrls,
        })

        const product = await doc.save();

        res.json(product);
    }catch (err){
        console.log(err);
        res.status(500).json({
            message: 'ne udalos sozdat tovar'
        });
    }
}

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
        // Проверка существования продукта с указанным productId
        const existingProduct = await ProductModel.findOne(productId);
        if (!existingProduct) {
            return res.status(404).json({
                success: false,
                message: 'Продукт с указанным ID не найден',
            });
        }

        // Создание нового отзыва и добавление его к существующим отзывам продукта
        await ProductModel.findOneAndUpdate(productId, { $push: { reviews : req.body } });

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
}
