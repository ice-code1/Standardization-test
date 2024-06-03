const ImageModels = require("../models/ImageModels")

class ImageServices{
    async create(userData){
        return await ImageModels.create(userData) 
    }

    async fetchOne(filter){
        return await ImageModels.findOne(filter)
    }

    async findAll(filter){
        return await ImageModels.find(filter)
    }

    

}

module.exports = new UserServices()
