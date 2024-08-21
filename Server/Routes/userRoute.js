const {Router} = require('express')
const AuthMiddleware = require('../middleware/Authmiddleware')

const {registerUser, loginUser , getUser, getAuthors, changeAvatar, editUser} = require('../Controllers/userControllers')

const router= Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/:id', getUser)
router.get('/', getAuthors)
router.post('/changeAvatar', AuthMiddleware,changeAvatar)
router.patch('/editUser',AuthMiddleware, editUser)



module.exports = router;