const express = require("express")
const { listProduct, getproduct, getproductsBy} = require("../controllers/product.controller")
const { verifyUser } = require("../controllers/user.controller")

const router = express.Router()

router.post("/addproduct", verifyUser, listProduct)
router.get("/getproducts",verifyUser, getproduct)
router.get("/productsBy/", verifyUser, getproductsBy)
module.exports = router