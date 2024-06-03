const UserModels = require("../models/UserModels")

class UserServices{
    async create(userData){
        return await UserModels.create(userData) 
    }

    async fetchOne(filter){
        return await UserModels.findOne(filter)
    }

    async findAll(filter){
        return await UserModels.find(filter)
    }

    async findId(filter){
        return await UserModels.findById(filter)
    }
    
    
}

module.exports = new UserServices()
