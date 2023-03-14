const User = require('../models/User')
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt')

const register = async (req, res) => {
    console.log('hha')
    try {
        const isEmpty = Object.values(req.body).some((v) => !v)
        if(isEmpty){
            throw new Error("Fill all fields!")
        }

        const isExisting = await User.findOne({username: req.body.username})
        if(isExisting){
            throw new Error("Account is already registered")
        }

        console.log(req.body)
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        const user = new User({...req.body, password: hashedPassword})
        await user.save()

        const payload = {id: user._id, username: user.username}
        const {password, ...others} = user._doc

        const token = jwt.sign(payload, process.env.JWT_SECRET)

        return res.status(201).json({token, others})
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


const login = async (req, res) => {
    try {
        const isEmpty = Object.values(req.body).some((v) => !v)
        if(isEmpty){
            throw new Error("Fill all fields!")
        }

        const user = await User.findOne({email: req.body.email})
        if(!user){
            throw new Error("Wrong credentials")
        }

        const comparePass = await bcrypt.compare(req.body.password, user.password)
        if(!comparePass){
            throw new Error("Wrong credentials")
        }

        const payload = {id: user._id, username: user.username}
        const {password, ...others} = user._doc

        const token = jwt.sign(payload, process.env.JWT_SECRET)

        return res.status(200).json({token, others})
    } catch (error) {
        return res.status(500).json(error.message)
    }
}


module.exports = {
    register,
    login
}