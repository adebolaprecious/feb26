const productModel = require("../models/product.model")
const ProductModel = require("../models/product.model")
const cloudinary = require("cloudinary").v2


cloudinary.config({
    api_key:process.env.CLOUD_KEY,
    cloud_name:process.env.CLOUD_NAME,
    api_secret:process.env.CLOUD_SECRET
})


const listProduct=async(req, res)=>{
    const{productName, productPrice, productQuantity, createdBy, productImage}= req.body

    try {
        let image = await cloudinary.uploader.upload(productImage, (err)=>{
         console.log(err);
        }).then((result)=>{


         let image = {
                public_id:result.public_id,
                secure_url:result.secure_url
            }

            return image
        })

        const product = await ProductModel.create({
            productName,
            productPrice,
            productQuantity,
            productImage:image,
            createdBy:req.user.id
        })

        res.status(201).send({
            message:"Product added successfully",
            data:product
        })
    } catch (error) {
        console.log(error);

        res.status(400).send({
            message:"Error adding product"
        })
        
    }
}
const getproduct= async(req, res)=>{
    try {
        const products = await ProductModel.find().populate("createdBy", "firstName lastName email")

        res.status(200).send({
            message:"Products fetched successfully",
            data:products
        })
    } catch (error) {
        console.log(error);

        res.status(400).send({
            message:"Error fetching products"
        })
    }
}

const getproductsBy=async(req, res)=>{
   const { productName, productPrice, createdBy }= req.query
     
      try {
        const filter ={}
        if(productName)
            filter.productName={$regex:productName , $option:"i"}
        if(productPrice)
            filter.productPrice= productPrice

        const product =await productModel.find(filter)

        res.status(200).send({
            message:"products fetched succesfully",
            data:product
        })
      } catch (error) {
        res.status(404).send({
            message:"failed to fetch products"
        })
      }
}

module.exports= { listProduct, getproduct, getproductsBy }
