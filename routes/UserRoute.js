const router = require('express').Router()

const{userRegistration,
      userLogin
} = require("../controllers/UserControllers")

router.post("/register",userRegistration)
router.post("/login",userLogin)
module.exports = router
