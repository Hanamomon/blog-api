import { body, param, validationResult } from "express-validator";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import {
  findUserByUsername,
  findUserByEmail,
} from "../repository/userRepository.js";
import {
  findSinglePost,
  findSingleUserPost,
} from "../repository/postRepository.js";
import {
  findPostComments,
  findSinglePostComment,
  findUserComment,
} from "../repository/commentRepository.js";

const window = new JSDOM("").window;
const purify = DOMPurify(window);

async function validatorMiddleware(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.mapped() });
  }

  next();
}

const validateSignUp = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .bail()
    .isAlphanumeric()
    .isLength({ max: 30 })
    .withMessage("Username cannot exceed 30 characters.")
    .custom(async (value) => {
      const user = await findUserByUsername(value);
      if (user) throw new Error("Username is taken.");
    }),
  body("email")
    .isEmail()
    .withMessage("Valid email is required.")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Email cannot exceed 100 characters.")
    .bail()
    .normalizeEmail()
    .custom(async (value) => {
      const user = await findUserByEmail(value);
      if (user) throw new Error("An account is associated with this email.");
    }),
  body("password")
    .isStrongPassword()
    .withMessage(
      "Valid password contains a minimum of 8 characters and at least one lowercase letter, one uppercase letter, one number, and one symbol.",
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match.");
    }
    return true;
  }),
];

const validateLogin = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required.")
    .bail()
    .isAlphanumeric()
    .custom(async (value) => {
      const user = await findUserByUsername(value);
      if (!user) throw new Error("No user with this username exists.");
    }),
  body("password").notEmpty().withMessage("Password is required."),
];

const validateRole = [
  body("role").isIn(["USER", "AUTHOR"]).withMessage("Invalid role provided."),
];

const validatePostId = [
  param("postId").custom(async (value) => {
    const post = await findSinglePost(value);
    if (!post) throw new Error("Provided post address is invalid.");
  }),
];

const validateAddPost = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Enter a title.")
    .bail()
    .isAlphanumeric("fr-FR", { ignore: " " })
    .withMessage("Title should contain letters and numbers only."),
  body("content")
    .notEmpty()
    .withMessage("Post content cannot be empty.")
    .bail()
    .custom((postContent) => {
      const clean = purify.sanitize(postContent, {
        ALLOWED_TAGS: [
          "p",
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "ul",
          "li",
          "span",
          "div",
          "pre",
          "strong",
          "em",
          "sup",
          "sub",
          "code",
          "tbody",
          "tr",
          "td",
          "hr",
          "br",
          "img",
        ],
        ALLOWED_ATTR: ["style"],
      });

      return true;
    }),
];

const validateUserPost = [
  param("postId").custom(async (postId, { req }) => {
    const userPost = await findSingleUserPost(postId, req.user.id);
    if (!userPost) throw new Error("This post does not belong to the user.");
  }),
];

const validateEditPost = [validateUserPost, validateAddPost];

const validatePublishPost = [
  validateUserPost,
  body("published").isBoolean().withMessage("Invalid published state."),
];

const validatePostCommentId = [
  param("commentId").custom(async (commentId, { req }) => {
    const postComment = await findSinglePostComment(
      req.params.postId,
      Number(commentId),
    );
    if (!postComment)
      throw new Error("This comment does not belong to the specified post.");
  }),
];

const validateAddComment = [
  validatePostId,
  body("content")
    .notEmpty()
    .withMessage("Comment content cannot be empty.")
    .bail()
    .isObject()
    .custom((value) => {
      if (typeof value.text !== "string" || !value.text)
        throw new Error(
          "Comment content should include a valid non-empty text.",
        );
      return true;
    }),
];

const validateUserComment = [
  param("postId").custom(async (postId, { req }) => {
    const authorPost = await findSingleUserPost(postId, req.user.id);
    req._isAuthorPost = false;

    if (authorPost && req.user.role == "AUTHOR") {
      req._isAuthorPost = true;
      return true;
    }
  }),
  param("commentId")
    .if((value, { req }) => !req._isAuthorPost)
    .custom(async (commentId, { req }) => {
      const userComment = await findUserComment(req.user.id, Number(commentId));
      if (!userComment)
        throw new Error("This comment does not belong to the user.");
    }),
];

const validateEditComment = [validateUserComment, validateAddComment];

export {
  validatorMiddleware,
  validateSignUp,
  validateLogin,
  validateRole,
  validatePostId,
  validatePostCommentId,
  validateAddPost,
  validateAddComment,
  validateUserPost,
  validateUserComment,
  validateEditPost,
  validateEditComment,
  validatePublishPost,
};
