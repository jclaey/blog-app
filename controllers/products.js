const config = require('config');
const mongoose = require('mongoose');
const express = require('express');
const Product = require('../models/Product');
const User = require('../models/User');
const keyPublishable = config.get('STRIPE_PUBLISHABLE_KEY');
const keySecret = config.get('STRIPE_SECRET_KEY');
const stripe = require('stripe')(keySecret);

module.exports = {
    async productIndex(req, res, next) {
        let products = await Product.find({});
        res.render('products', { products });
    },
    productNew(req, res, next) {
        res.render('products/new');
    },
    productCreate(req, res, next) {
        const newProduct = {
            title: req.body.title,
            image: req.body.image,
            price: req.body.price,
            description: req.body.description
        }

        new Product(newProduct)
            .save()
            .then(product => {
                res.redirect('/products');
            });
    },
    productShow(req, res, next) {
        Product.findById(req.params.id, (err, product) => {
            if(err) throw err;
            res.render('products/show', { product });
        });
    },
    async addToCart(req, res, next) {
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

                res.render('my-cart', { user });

            });
        });
    }
}

    // stripeCheckout(req, res, next) {
    //     let amount = 500;

    //     stripe.customers.create({
    //         email: req.body.stripeEmail,
    //         source: req.body.stripeToken
    //     })
    //     .then(customer => 
    //         stripe.charges.create({
    //             amount,
    //             description: 'Sample Charge',
    //             currency: 'usd',
    //             customer: customer.id
    //         }))
    //         .then(charge => res.render('products/charge'));
    // }