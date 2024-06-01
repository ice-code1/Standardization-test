function authoriseAdmin(req,res,next){
    if (req.user && req.user.role === 'admin'){
            next()
    }
    else{
            return res.status(403).json({
                message:'ACCESS DENIED,admin previledge needed'
            })
    }   
}

module.exports = authoriseAdmin
