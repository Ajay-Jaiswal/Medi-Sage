const express = require("express")
const router = express.Router()


const userController = require('../controller/userController')
const auth = require("../middleware/auth")

router.post("/student", userController.createUser)
router.post("/login", userController.loginUser)
router.get("/get",auth.loginCheck, userController.getStudent)


module.exports = router