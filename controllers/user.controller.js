const Usermodel = require("../models/user.model")

const register = async (req, res) => {
    const {firstName, lastName, email, password} = req.body
    try {
const user = await Usermodel.create(req.body)
res.status(201).json({
    message: "user created successfully",
    id: user._id,
    username: user.firstName + " " + user.lastName,
    email: user.email
})
    } catch (error) {
        console.log(error)
        if (error.code === 11000) {
            return res.status(400).json({
                message: "email already exists",
            })
        }
        res.status(400).json({
            message: "cannot create user",
            error
        })
    }
    //mongoose.com
    //assignment send a request body that will not send a password with it
    
}

getAllUsers = async (req, res) => {
    try {
        const users = await Usermodel.find()
        res.status(200).json({
            message: "users fetched successfully",
            data: users
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: "cannot fetch users",
            error
        })
    }
}
const updateUser = async (req, res) => {
    const {firstName, lastName} = req.body
    try{
        if (firstName) {
            req.user.firstName = firstName
        }
        if (lastName) {
            req.user.lastName = lastName
        }
        await req.user.save()
        res.status(200).json({
            message: "user updated successfully",
            data: req.user
        })
    }catch(error){
        console.log(error)
        res.status(400).json({
            message: "cannot update user",
            error
        })
    }
}
module.exports = {
    register,
    getAllUsers,
    updateUser,
}