const { check, validationResult } = require('express-validator')


exports.SignUpValidator = [ 
    check('name').notEmpty().withMessage(' Name is required'),
    check('email', "email must be between 3 to 32 characters").isEmail()
    .withMessage('valid email is required').isLength({min:4, max:32}),
    check('password').isLength({min:6}).withMessage('password must be at least 8 character long')

    
    

]
exports.SignInRequest = [
    check('email', "email must be between 3 to 32 characters").isEmail()
   .withMessage('valid email is required').isLength({min:3, max:32}),
   check('password').isLength({min:6}).withMessage('password must be at least 6 character long'),
];

// exports.createPostValidation = [
//     check('title', "title must be between 3 to 32 characters").notEmpty()
//    .withMessage('all fields is required').isLength({min:3, max:32}),
//    check('body').isLength({min:4}).withMessage('body must be at least 4 character long'),
// ];

exports.createPostValidation = (req, res, next) => {
    // title
    check('title', 'Write a title').notEmpty();
    check('title', 'Title must be between 4 to 150 characters').isLength({
        min: 4,
        max: 150
    });
    // body
    check('body', 'Write a body').notEmpty();
    check('body', 'Body must be between 4 to 2000 characters').isLength({
        min: 4,
        max: 2000
    });
    // check for errors
    const errors = validationResult(req);
    // if error show the first one as they happen
    if (errors > 0) {
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    // proceed to next middleware
    next();
};

exports.isRequestValidated = async = (req,res,next) =>{
    const errors = validationResult(req)
    if(errors.array().length > 0){
        return res.status(400).json({
            error:errors.array()[0].msg
        })
    }
    next()
    }


    exports.passwordResetValidator = (req, res, next) => {
        // check for password
        req.check('newPassword', 'Password is required').notEmpty();
        req.check('newPassword')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 chars long')
            .matches(
                /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/
            )
            .withMessage('must contain a number')
            .withMessage('Password must contain a number');
    
        // check for errors
        const errors = req.validationErrors();
        // if error show the first one as they happen
        if (errors) {
            const firstError = errors.map(error => error.msg)[0];
            return res.status(400).json({ error: firstError });
        }
        // proceed to next middleware or ...
        next();
    };