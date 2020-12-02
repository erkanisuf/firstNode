const router = require("express").Router();
const Users = require("../models/UserModel");

const jwt = require("jsonwebtoken");
const verify = require("./privateRoute");
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(new Error("Only jpeg and png files!"), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });
// import Models
const Products = require("../models/ProductModel");

router.post(
  "/addproduct",
  verify,
  upload.array("productImage", 12),
  async (req, res, next) => {
    const user = await Users.findById({ _id: req.user._id });
    const userAdmin = user.isAdmin;

    if (userAdmin !== "Admin") {
      return res.status(400).send("Only admin premission");
    } else {
      console.log(req.file, "fileee");
      const product = new Products({
        name: req.body.name,
        price: parseInt(req.body.price),
        user: user,
        image: req.files,
        // name: "Adidas Fit Shirt",
        // category: "Shirts",
        // image: "/images/p2.jpg",
        // price: 100,
        // countInStock: 20,
        // brand: "Adidas",
        // rating: 4.0,
        // numReviews: 10,
        // description: "high quality product",
      });
      console.log(product);

      const savedNote = await product.save();
      console.log(savedNote);
      user.products = user.products.concat(savedNote._id);
      await user.save();
      res.send(savedNote);
    }
  }
);
///reviews
///////////Add Review To Product
const Reviews = require("../models/ReviewsModel");

router.post("/addreview", verify, async (req, res) => {
  //First check if user has already posted
  const user = await Users.findById({ _id: req.user._id });

  const product = await Products.findById({ _id: req.body.products })
    .populate("user", {
      name: 1,
      email: 1,
    })
    .populate({ path: "reviews", populate: { path: "user", select: "name" } })

    .then((result) => {
      return result;
    })
    .catch((err) => console.log(err));
  const reviews = product.reviews;

  const checkForUser = reviews.find(
    (el) => el.user._id.toString() == user._id.toString()
  );

  if (checkForUser)
    return res.status(400).send("This user has already reviewed it!!");

  const review = new Reviews({
    review: req.body.review,
    products: req.body.products,
    user: user,
  });

  try {
    const savedNote = await review.save();
    user.reviews = user.reviews.concat(savedNote._id);
    product.reviews = product.reviews.concat(savedNote._id);
    await user.save();
    await product.save();
    res.send(savedNote);
  } catch (err) {
    res.status(400).status(err);
  }
});

///Adds to Database

router.get("/showproducts", (req, res) => {
  Products.find({})
    .select("name price _id image")
    .exec()
    .then((result) => res.send(result))
    .catch((err) => console.log(err));
});
///SHOWS The DataBase
router.get("/singleproducts", async (req, res) => {
  const find = await Products.findById({ _id: "5fc0054d778b1f2ad42998b1" })
    .populate("user", {
      name: 1,
      email: 1,
    })
    .populate({ path: "reviews", populate: { path: "user", select: "name" } })

    .then((result) => {
      return result;
    })
    .catch((err) => console.log(err));
  const reviews = find.reviews;
  const checkForUser = reviews.find(
    (el) => el.user.id === "5fb4f31c18e2fd166083b9342"
  );
  if (checkForUser) {
    console.log(checkForUser);
  } else {
    console.log("nope");
  }
});

///////////Gets All products with comments!!!!!!!!
router.get("/productuser", async (req, res) => {
  const products = await Products.find({})

    .populate("user", {
      name: 1,
      email: 1,
    })
    .populate({ path: "reviews", populate: { path: "user", select: "name" } })
    .exec(); //stringa tuka e v mongoDB variable koito si go imam (primerno user e tozi na products v mongoto)
  res.send(products);
});
///////////Gets All products with comments!!!!!!!!
router.delete("/delete/:id", verify, async (request, response, next) => {
  const user = await Users.findById({ _id: request.user._id });
  const product = await Products.findById({ _id: request.params.id });
  console.log(product.user[0], "product");
  console.log(user._id, "user");
  if (user._id.toString() === product.user[0].toString()) {
    Products.findByIdAndRemove(request.params.id)
      .then((result) => {
        response.status(204).end();
      })
      .catch((error) => next(error));
  } else {
    response.send("Premission denied!");
  }
});
module.exports = router;
