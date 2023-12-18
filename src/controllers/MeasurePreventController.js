const connection = require("../database/connection");


module.exports ={

    async delete(request,response){
        const id  = request.query.id;
        const {id:idinq} = request.params;
        try{
            await connection('measure_prevents').where('cod_measure_prevent',id).delete();
            return response.status(200).json({
               response: "Medida cautelar deletada com sucesso.",
             });
       }catch(e){
           return response.status(403).json({
               response: "Ocorreu um problema e as alterações não foram feitas!",
               erro:e
             });
       }
    }

}