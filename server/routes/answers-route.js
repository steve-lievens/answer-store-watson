// import dependencies and initialize the express router
const express = require('express');
const { body, validationResult } = require('express-validator');
const AnswerStoreController = require('../controllers/answerstore-controller');

const router = express.Router();

// standardized validation error response
const validate = (validations) => {
  return async(req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  };
};

// define routes

// Defined delete | remove | destroy route
router.post('/delete/', AnswerStoreController.removeAnswer);
router.get('', AnswerStoreController.getAnswers);
router.post(
  '',
  validate([
    body('id')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Answer ID empty.')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    body('language')
      .trim()
      .isLength({ min: 1 })
      .withMessage('language empty.')
      .not()
      .isEmpty()
      .trim()
      .escape(),
    body('answerText')
      .trim()
      .isLength({ min: 1 })
      .withMessage('answerText empty.')
      .not()
      .isEmpty()
      .trim()
      .escape(),

    body('timestamp').isISO8601(),
  ]),
  AnswerStoreController.addAnswer,
);

module.exports = router;
