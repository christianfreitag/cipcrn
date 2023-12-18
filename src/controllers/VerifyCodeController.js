const connection = require('../database/connection');


module.exports ={

    async index(request,response){
            const {limit,page=1,coduser} = request.query;


            const inv = await connection("valid_account_codes").select('*').where('cod_user',parseInt(coduser)).whereNot('status',0).limit(parseInt(limit))
            .offset((page - 1) * limit).orderBy('cod_valid_account_codes','DESC')

            if(inv.length>0){
                
                return response.status(200).json({response:inv})
            }else{
                return response.status(401).json({response:"Nenhum convite encontrado."})
            }
            
            
        

    },
    async create(request,response){
        const {valid_cpf_accont,cod_user,acess_level_user,station} = request.body;


        if(!valid_cpf_accont || !cod_user || !acess_level_user ||!station){
            return response.status(401).json({
                response: "Preencha todos os campos.",
              });
        }
        else{
            const inv = await connection("valid_account_codes").where('valid_cpf_accont',valid_cpf_accont).andWhereNot('status',0).select(connection.raw('COUNT(*) count'));

            if(inv[0].count<=0){
                const [id] = await connection('valid_account_codes').insert({
                    valid_cpf_accont,
                    cod_user:cod_user,
                    status:1,
                    acess_level_user,
                    station
    
    
                });
                return response.status(200).json({
                    response: "Convite foi gerado com sucesso!",
                  });
            }else{
                return response.status(401).json({
                    response: "Um convite ja foi gerado para esse CPF.",
                  });
            }
        }

    },
    async update(request,response){
        const status = request.query.status;
        const {id} = request.params;

        if(!id){
            return response.status(401).json({
                response: "Convite inexistente.",
              });
        
        }else{
            await connection('valid_account_codes').where("cod_valid_account_codes",id).update({
                status:status,
            });

            return response.status(200).json({
                response: "Convite alterado com sucesso.",
              });
        }

        
    }
};
