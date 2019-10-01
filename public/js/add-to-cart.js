const Product = require('../../models/Product');
const User = require('../../models/User');

let checkout = document.querySelector('#checkoutBtn');

checkout.addEventListener('click', (e) => {
    e.preventDefault();

    let totalPrice = 0;

    User.findById(req.user.id, (err, user) => {
        user.cart.forEach(function(cartItem) {
           return totalPrice += cartItem.price;
        });
    });

    $('.ui.modal')
    .modal('show');
});