
const connection = require('../database/connection');

const criptodados  = require("../database/nodem");




module.exports = {
    async create(request,response){
        
            const {user_name,cpf_user,email_user,pw_user,confirm_pw_user} = request.body;
            

            if(!user_name || !cpf_user || !email_user || !pw_user || !confirm_pw_user){
                return response.status(403).json({"response":"Preencha todos os campos!"});
            }

            const verify_code = await connection("valid_account_codes").where("valid_cpf_accont",cpf_user).whereNot('status',0).select("*");


            if(verify_code.length>0 && verify_code[0].status==1){
                
                if(pw_user != confirm_pw_user){
                    return response.status(401).json({"response":"A senha de confirmação é diferente."});
                }
                const user = await connection("users").where("cpf_user",cpf_user).orWhere("email_user",email_user).select("*");
                
                if(user.length>0){
                    return response.status(401).json({"response":"Ja existe um usuário com esse CPF ou e-mail!"});
                }
                //C R Y P TO GRAFANDO
                const {pwhash,ipw_userv} = criptodados.encrypt(pw_user); 
                
                const pw =criptodados.decrypt(pwhash,ipw_userv);
                
                

                await connection('users').insert({
                    user_name,
                    cpf_user,
                    email_user,
                    'pw_user':pwhash,
                    ipw_userv,
                    acess_level_user:verify_code[0].acess_level_user,
                    invited_by:verify_code[0].cod_user,
                    account_status:1,
                    station:verify_code[0].station,

                });
                
                await connection("valid_account_codes").where("cod_valid_account_codes",verify_code[0].cod_valid_account_codes).update({status:'2'});
                return response.status(201).json({"response":"Cadastro realizado com sucesso!"});
            }
            if(verify_code.length>0 && verify_code[0].status==2){
                return response.status(401).json({"response":"O convite para este CPF ja foi utilizado."});
            }
            return response.status(401).json({"response":"Este CPF não foi autorizado em nosso sistema. Entre em contato com seu superior para que ele autorize seu cadastro."});
            //validações para saber se esta dentro do padrão
            
        
        

    },
    async update(request,response){
        const coduser = request.query.coduser;

        const {account_status} = request.body;
        if(!account_status){
            return response.status(403).json({"response":"Um dado esta faltando."});
        }else{
            await connection("users").where("cod_user",coduser).update({
                account_status:account_status,
            })
            return response.status(200).json({"response":"Alteração feita com sucesso!"});
        }
    },
    async index(request,response){
        
        const users = await connection('users').select('*');
        return response.json(users);

    }
    

    
    

}

