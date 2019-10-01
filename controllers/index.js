const passport = require('passport');
const mongoose = require('mongoose');
const express = require('express');
const Product = require('../models/Product');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const User = require('../models/User');

module.exports = {
    landingPage(req, res, next) {
        res.render('index', {title: 'Surf Shop - Home'});
    },
    getRegister(req, res, next) {
        res.render('register', { title: 'Register' });
    },
    postRegister(req, res, next) {
       let errors = [];
       if(req.body.password != req.body.password2) {
            errors.push({text: 'Passwords must match'});
       }
       if(req.body.password.length < 8 || req.body.password.length > 16) {
            errors.push({text: 'Password must be 8 to 16 characters long'});
        }
       if(errors.length > 0) {
           errors.forEach(function(error) {
                req.session.error = error.text;
           });
           res.render('register', {
               errors: errors,
               name: req.body.name,
               email: req.body.email,
               password: req.body.password,
               password2: req.body.password2
           });
       } else {
           User.findOne({ email: req.body.email })
                .then(user => {
                    if(user) {
                        req.session.error = 'A user with that email already exists';
                        res.redirect('/register');
                    } else {
                        const newUser = new User({
                            name: req.body.name,
                            email: req.body.email,
                            password: req.body.password
                       });
            
                       bcrypt.genSalt(16, (err, salt) => {
                            bcrypt.hash(newUser.password, salt, (err, hash) => {
                                if(err) throw err;
                                newUser.password = hash;
                                newUser.save()
                                    .then(user => {
                                        req.session.success = 'Registration successful! You may now login';
                                        res.redirect('login');
                                    })
                                    .catch(err => {
                                        console.log(err);
                                        return;
                                    });
                            });
            
                       });
                    }
                })
       }
    },
    getLogin(req, res, next) {
        res.render('login', { title: 'Login' });
    },
    postLogin(req, res, next) {
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: 'Password or username is incorrect'
        })(req, res, next);
    },
    getLogout(req, res, next) {
        req.logout();
        res.redirect('/');
    },
    cartIndex(req, res, next) {
        User.findById(req.user.id, (err, user) => {
            if(err) throw err;
            res.render('my-cart', { user });
        });
    }
}