const connection = require("../database/connection");
const criptodados = require('../database/nodem')
const jwt = require('jsonwebtoken');

module.exports ={

     index(request,response){
        try{
            
            const token = request.headers.authorization
            const decode = jwt.verify(token,criptodados.getJwtkey());
            return response.status(200).json({"response":decode});
            
            
        }catch(error){
            return response.status(403).json({"response":"Falha na autenticação."});
        } 
    }

}