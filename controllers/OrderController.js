import OrdersModel from '../models/Orders.js'

export const getLastcategories = async (req, res) => {
    try {
        const products = await OrdersModel.find().exec();

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
      const maxPriceProduct = await OrdersModel.findOne().sort({ price: -1 }).exec();
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
        const products = await OrdersModel.find().exec();

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

        const doc = await OrdersModel.findOneAndDelete({ _id: productId });

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
        const doc = await OrdersModel.findOneAndUpdate(
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
      const orders = await OrdersModel.find();
      res.json(orders);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };
  



export const getForTags = async (req, res) => {
    try {
        const { tag } = req.params;
        const products = await OrdersModel.find({ tags: tag });
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
        const doc = new OrdersModel({
            userId: req.body.userId,
            orderStatus: req.body.orderStatus,
            cartItems: req.body.cartItems,
            formData: req.body.formData,
            selectedItem: req.body.selectedItem,
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
        await OrdersModel.updateOne({
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