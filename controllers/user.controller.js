const UserModel = require("../models/users.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")
const { mailSender } = require("../middleware/mailer");
const otpgen = require("otp-generator");
const OTPModel = require("../models/otp.model");

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  }
});
const createUser = async (req, res) => {
    const { lastName, email, password, firstName } = req.body

    try {
        const saltround = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, saltround)
        const newUser = await UserModel.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,  // Save hashed password

        });
         const renderMail = await mailSender("welcomeMail.ejs", {firstName})

        console.log("✅ User saved to database:", newUser._id)
        const token = jwt.sign(
            { id: newUser._id }, 
            process.env.SECRET_KEY, 
            { expiresIn: "5h" }
        )
        res.status(201).send({
            message: "User created successfully",
            data: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                roles: newUser.roles
            },
            token: token
        })
        let mailOptions = {
  from: process.env.NODE_MAIL,
  to: process.env.APP_MAIL,
  bcc:{email:'adefokunprecious92@gmail.com, sandrajeffrey2211@gmail.com'},
  subject: `welcome, ${firstName}`,
  html: renderMail,
};
transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


    } catch (error) {
        console.log("Create user error:", error)

        if (error.code === 11000) {
            return res.status(400).send({
                message: "Email already exists"
            })
        }
        
        res.status(400).send({
            message: "User creation failed",
            error: error.message
        })
    }
}
const login = async (req, res) => {
    const { email, password } = req.body

    try {
        // Find user by email
        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(404).send({
                message: "User not found"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(400).send({
                message: "Invalid credentials"
            })
        }
        const token = jwt.sign(
            { id: user._id}, 
            process.env.SECRET_KEY, 
            { expiresIn: "5h" }
        )
        res.status(200).send({
            message: "Login successful",
            data: {
                id: user._id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles
            },
            token: token
        })

    } catch (error) {
        console.log("Login error:", error)
        res.status(400).send({
            message: "Login failed",
            error: error.message
        })
    }
}
const editUser = async (req, res) => {
    const { id } = req.params
    const { firstName, lastName, email } = req.body
    try {
        const user = await UserModel.findByIdAndUpdate(
            id, 
            { firstName, lastName, email }, 
            { new: true, runValidators: true }
        )
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            })
        }
        res.status(200).send({
            message: "User updated successfully",
            data: user
        })

    } catch (error) {
        console.log("Edit error:", error)
        
        if (error.code === 11000) {
            return res.status(400).send({
                message: "Email already exists"
            })
        }

        res.status(400).send({
            message: "User update failed",
            error: error.message
        })
    }
}
const getAllUsers = async (req, res) => {
    try {
     if(!req.user.roles || 
         (Array.isArray(req.user.roles) && !req.user.roles.includes('admin')) ||
         (typeof req.user.roles === 'string' && req.user.roles !== 'admin')) {
        return res.status(403).send({
            message: "Access denied"
        })
      }
        const users = await UserModel.find().select('-roles -password')
        res.status(200).send({
            message: "Users retrieved successfully",
            data: users
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            message: "Failed to retrieve users",
            error: error.message
        })
    }
}
const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await UserModel.findByIdAndDelete(id)
        if (!user) {
            return res.status(404).send({
                message: "User not found"
            })
        }
        res.status(200).send({
            message: "User deleted successfully",
            data: {
                id: user._id,
                email: user.email
            }
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            message: "Failed to delete user",
            error: error.message
        })
    }
};
const verifyUser = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1]
  ? req.headers["authorization"].split(" ")[1]
  : req.headers["authorization"].split(" ")[0];

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "User unauthorized",
      });
      return
    }
    console.log(decoded);
    req.user = decoded;
    next()
  });
};

const getMe = async(req, res) =>{

  console.log(req.user.id);
  try{
    const user = await UserModel.findById(req.user.id).select("-password ")
        res.status(200).send({
            message:"User retrieved successfully",
            data: user
        })
  }catch(error){
    res.status(400).send({
      message: "user not found",
      error: error.message
    })
  }
} 


const requestOTP= async(req, res)=>{
  const {email, otp}= req.body
  try {

    const sendOTP= otpgen.generate(4, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets:false, digits:SVGComponentTransferFunctionElement })
    //save their otp and mail in the db
    //send them a mail with their otp
    const user = OTPModel.create({email, otp:sendOTP})

    const otpMailContent = await mailSender('otpMail.ejs', {otp:sendOTP})

    let mailOption = {
        from: process.env.NODE_MAIL,
        bcc:[email, ""],
        subject: `OTP CODE`,
        html: otpMailContent
    }

     transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });
    res.status(200).send({
      message:"Otp sent successfully",
    })
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message:"Otp request failed",
    })
    
  }
}

const forgotPassword = async(req, res)=>{
    const {OTP,email, newPassword}= req.body
    try {
        const isUser=await OTPModel.findOne({email})
        if(!isUser){
            return res.status(404).send({
                message:"Invalid OTP"
            });

            return 
        }
    } catch (error) {     console.log(error);
     res.status(400).send({
        message:"Failed to reset password"
     })
}
}
module.exports = { createUser, editUser, getAllUsers, login, deleteUser, verifyUser, getMe, requestOTP}