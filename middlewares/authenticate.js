
function authenticateUser(req,res,next){
    const token = req.headers.authorization

    if(!token){
        return res.status(401).json({
            message: "ACCESS DENIED, INVALID TOKEN"
        })
    }
    try{
        const decoded = jwt.verify(token, 'secret')
        req.user = decoded
        next()
    }catch(error){
        res.status(401).json({
            message:"INVALID TOKEN"
        })
    }
            
}

module.exports = authenticateUser