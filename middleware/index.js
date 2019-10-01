const Product = require('../models/Product');
const User = require('../models/Product');

const middleware = {
    addItemToCart: async (req, res, next) => {
        let addBtn = document.querySelector('#addToCartBtn');

        addBtn.addEventListener('click', () => {
            await User.findById(req.user.id, (err, user) => {
                if(err) throw err;
    
                Product.findById(req.params.id, (err, product) => {
                    if(err) throw err;
    
                    let dupCheckArray = [];
    
                    user.cart.forEach(function(item) {
                        dupCheckArray.push(item.title);
                    });
    
                    if(dupCheckArray.includes(product.title)) {
                        req.session.error = `${product.title} already exists in your cart`;
                    } else {
                        user.cart.push({
                            title: product.title,
                            image: product.image,
                            description: product.description,
                            price: product.price
                        });
                        user.save();
                        req.session.success = `${product.title} was successfully added to your cart`;
                    }
                });
            });
        });
    }
}