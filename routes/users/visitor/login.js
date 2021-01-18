const express = require(`express`)
const mongoose = require(`mongoose`)
const bcrypt = require(`bcrypt`)
const jwt = require(`jsonwebtoken`)
const { body, validationResult } = require('express-validator')

const router = express.Router()

const user = require(`../../../schemas/user/userSchema`)

router.post(`/oishi/api/v1/login`, async (req, res) => {

    const {email, password} = req.body

    if (!email || !password) {
        res.status(400).send({
            message: `Please fill all the inputs`
        })
    }

    try {

        const visitor = await user.findOne({email}, (err, foundUser) => {
            if (err) {
                console.log(err)
            } else {
                if (foundUser) {
                    bcrypt.compare(password, foundUser.password, (err, result) => {
                        if (result) {

                            const token = jwt.sign({id: foundUser._id}, process.env.JWT_SECRET_KEY,{ expiresIn: process.env.JWT_EXPIRES_IN})

                            res.status(200).send({
                                message: `Successfully Logged In!`,
                                token,
                                data: foundUser
                            })
                        } else {
                            res.status(400).send({
                                message: `Invalid email or password`
                            })
                        }
                    })
                }
            }
        })
        
    } catch (err) {
        res.status(400).send({
            message: `Something went wrong`
        })
    }

})

module.exports = router

