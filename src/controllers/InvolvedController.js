const connection = require("../database/connection");


/* CRIAR SITUAÇÂO NA QUAL O NUMERO JA EXISTE E NAO DEIXA CRIAR NOVAMENTE */

module.exports = {
    

    async delete(request,response){
        const id  = request.query.id;
        const {id:idinq} = request.params;


        try{
             await connection('involved').where('cod_involv',id).delete();
             return response.status(200).json({
                response: "Parte deletada com sucesso.",
              });
        }catch(e){
            return response.status(401).json({
                response: "Ocorreu um problema e as alterações não foram feitas!",
                erro:e
              });
        }
       
        
        
    }
}
