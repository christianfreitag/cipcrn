const connection = require("../database/connection");


module.exports ={

    async delete(request,response){
        const id  = request.query.id;
        const {id:idinq} = request.params;
        try{
            await connection('typefics_inqs').where('cod_typefics_inqs',id).delete();
            return response.json({
               response: "Tipificação deletada com sucesso",
             });
       }catch(e){
           return response.json({
               response: "Ocorreu um problema e as alterações não foram feitas!",
               erro:e
             });
       }
    }

}