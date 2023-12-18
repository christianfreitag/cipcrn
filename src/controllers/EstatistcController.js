const connection = require("../database/connection");
module.exports = {

    async search(request,response){
        const {origin_inq,bail_inq,status,typefics,mat_learned_inq,type_mov,reason_mov,status_mov,date_from,date_to} = request.body.datapush;


        if(date_from=="" || date_to==""){
            return response.status(403).json({response:"É necessario um periodo."});
        }
        
        n_inq = await connection('inquiries').select("*").modify(async function(queryBuilder) {
            if (origin_inq!="") {
                queryBuilder.where("origin_inq","=",`${origin_inq}`);
            }
            if(bail_inq!=""){
                queryBuilder.where(`bail_inq`,"=", `${bail_inq}`);
            }
            if(status!=""){
                queryBuilder.where("status",status);
            }
            if(mat_learned_inq!=""){
                queryBuilder.where("mat_learned_inq",mat_learned_inq);
            }
            if(type_mov!=""){
                
                queryBuilder.where("last_mov_type",type_mov);
                if(reason_mov!=""){
                    queryBuilder.where("last_mov_reason",reason_mov);
                }
                if(status_mov!=""){
                    queryBuilder.where("last_mov_status",status_mov);
                }
                
            }
            queryBuilder.whereBetween('establis_date_inq',[date_from,date_to])
        }).orderBy('establis_date_inq','asc')

        const inquiries=[]
        if(typefics.length>0){
            iqs = await connection("typefics_inqs").select('cod_inq',
            connection.raw(`GROUP_CONCAT(cod_typefic,';') typefics`)).groupBy('cod_inq');
         
            n_inq.forEach(element => {
            
            if(a = iqs.find(e=>e.cod_inq==element.cod_inq)){
                var types = a.typefics.split(";").map(ele=>{return parseInt(ele)});
                if(typefics.map(t=>(types.includes(t))).every(e=>e==true)){
                    inquiries.push(element);
                }
            }

            });
        }else{
            
        }

        
        
            
        
        //VERIFICAR AS TIPIFICAÇÔES DEPOIS DE FILTRAR
        
        
        
        return response.status(200).json({response:typefics.length>0?inquiries:n_inq,
                              countInq:typefics.length>0?inquiries.length:n_inq.length});
    }
}