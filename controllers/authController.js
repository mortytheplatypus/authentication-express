const User = require('../models/User');
const jwt = require('jsonwebtoken');

const maxAge = 3 * 24 * 60 * 60;

const handleErrors = (err) => {
    // console.log(err.message, err.code);
    /*
        err.message = 'user validation failed: email: Please enter an email, password: Please enter a password'
        err.code = 11000 

        check err.message and err.code in the console for more details
    */

    let errors = { email: '', password: '' };

    if (err.code === 11000) {
        errors.email = 'Email is already registered';
    } else if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    } else if (err.message === 'Incorrect password') {
        errors.password = 'Incorrect password';
    } else if (err.message === 'Email not registered') {
        errors.email = 'Email not registered';
    }

    return errors;
}

const createToken = (id) => {
    return jwt.sign({ id }, 'theblueduck', {
        expiresIn: maxAge
    });
}

module.exports.signin_get = (req, res) => {
    res.render('signin');
}

module.exports.signup_get = (req, res) => {
    res.render('signup');
}

module.exports.signin_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.signin(email, password);

        // create a jwt token
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }

    // console.log(email, password);
    // res.send('User signin');
}

module.exports.signup_post = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.create({ email, password });

        // create a jwt token
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });

        res.status(201).json({ user: user._id });
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
    }
}

module.exports.signout_get = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
}
