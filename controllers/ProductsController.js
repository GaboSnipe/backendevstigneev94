import ProductModel from '../models/Products.js'

export const getLastTags = async (req, res) => {
    try {
      const products = await ProductModel.find().limit(40).exec();
  
      let tagsSet = new Set();
      products.forEach((product) => {
        product.tags.forEach((tag) => {
          tagsSet.add(tag);
        });
      });
  
      const uniqueTags = Array.from(tagsSet);
  
      res.json(uniqueTags);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не удалось получить тэги',
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
    // try {
    //     const { _page = 1, _limit = 8 } = req.query;
    //     const skip = (parseInt(_page) - 1) * parseInt(_limit);
    //     const products = await ProductModel.find().skip(skip).limit(parseInt(_limit));
    //     res.json(products);
    //   } catch (err) {
    //     console.log(err);
    //     res.status(500).json({
    //       message: 'Не удалось получить товары',
    //     });
    //   }
    try {
        const { q, _page = 1 } = req.query;
        const regex = new RegExp(q, 'i'); // Создаем регулярное выражение для поиска без учета регистра
        const products = await ProductModel.find({ name: regex })
          .skip((parseInt(_page) - 1) * 4)
          .limit(4);
        res.json(products);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}


export const getForTags = async (req, res) => {
    try {
        const { tag } = req.params;
        const products = await ProductModel.find({ tags: tag });
        console.log(products);
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