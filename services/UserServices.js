const UserModels = require("../models/UserModels")

class UserServices{
    async create(userData){
        return await UserModels.create(userData) 
    }

    async fetchOne(filter){
        return await UserModels.findOne(filter)
    }

    

}

module.exports = new UserServices()
