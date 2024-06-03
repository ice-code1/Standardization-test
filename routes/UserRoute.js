const router = require('express').Router()
const multer = require("multer")


const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Set the destination directory for uploads
      },
      filename: function (req, file, cb) {
        cb(null, file.originalname); // Use the original name of the file
      }
    })
    
    const upload = multer({ storage: storage })

const{userRegistration,
      VerifyUser,
      UserLogin,
      userUpload,
      fetchImage,
      fetchAllImage
} = require("../controllers/UserControllers")

router.post("/register",userRegistration)
router.post("/verify",VerifyUser)
router.post("/login",UserLogin)
router.post("/upload",upload.single('file'), userUpload)
router.get('/userImage',fetchImage)
router.get('/allImages',fetchAllImage)
module.exports = router
  