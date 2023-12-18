const criptodados = require('../database/nodem')
const jwt = require('jsonwebtoken');


exports.validation =(request,response,next)=> {
        try{
            const token = request.headers.authorization
            const decode = jwt.verify(token,criptodados.getJwtkey());
            next();
            
        }catch(error){
            return response.status(401).json({"response":"Falha na autenticação."});
        }  
}
