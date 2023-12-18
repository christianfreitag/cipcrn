const connection = require("../database/connection");

/* CRIAR SITUAÇÂO NA QUAL O NUMERO JA EXISTE E NAO DEIXA CRIAR NOVAMENTE */

module.exports = {
  async index(request, response) {
    
    const {limit,searchdata,type,cod_user,page = 1 } = request.query;
    const [count] = await connection("inquiries").count();
    
    var inquiries;

    if(searchdata!="" && searchdata){
      const search = searchdata.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      inquiries = await connection("inquiries").where('inquiries.num_inq', 'like',`%${searchdata|| ''}%`).orWhere('involved.name_involv','like',`%${searchdata || ''}%`).orWhere('inquiries.num_pat','like',`%${searchdata || ''}%`)
      .limit(limit)
      .offset((page - 1) * limit).modify(async function(queryBuilder) {
        if(type==0){
          queryBuilder.orderBy('cod_inq','desc');
        }
        else if(type==1){
          queryBuilder.orderBy('cod_inq','asc');
        }
        else if(type==2){
          queryBuilder.where('cod_user_create_inq',cod_user);
        }
      })
      .leftJoin('involved','involved.cod_inq','inquiries.cod_inq').orWhere('involved.name_involv','like',`%${searchdata || ''}%`).limit(limit)
      .offset((page - 1) * limit).select('inquiries.*').groupBy('inquiries.cod_inq');
    }else{
      inquiries = await connection("inquiries")
      .limit(limit)
      .offset((page - 1) * limit)
      .select('*').modify(async function(queryBuilder) {
        if(type==0){
          queryBuilder.orderBy('cod_inq','desc');
        }
        else if(type==1){
          queryBuilder.orderBy('cod_inq','asc');
        }
        else if(type==2){
          queryBuilder.where('cod_user_create_inq',cod_user).orderBy('cod_inq','desc');;
        }
      });
    }
    

    for(i=0;i<inquiries.length;i++){
      const victm = await connection("involved").where('cod_inq',inquiries[i].cod_inq).andWhere('type_involv',1).select('*');
      inquiries[i].victms = victm;
      const investig = await connection("involved").where('cod_inq',inquiries[i].cod_inq).andWhere('type_involv',0).select('*');
      inquiries[i].investigs = investig;
      //tirei movements entao tem q arrumar frontend para pégar os dados "lasdt"

      
    }
    
    
    if (inquiries.length <= 0) {
      return response.status(201).json([]);
    }

   
    
    return response.status(201).json(inquiries);

    
  },

  async create(request, response) {
    //quando apertar cadastrar inquerito

    const {
      movements,

      num_pat,
      observation_data,
      done_intima,
      done_oitivas,
      quant_measure_prevents,

      typefics,
      measure_prevent,

      bail_inq,
      mat_learned_inq,

      origin_inq,
      prosecution_inq,


      cod_user_create_inq,
      cod_user_lastEdit_inq,

      last_mov_date,
      last_mov_reason,
      last_mov_type,
      last_mov_status,
      last_mov_avara,

      num_inq,
      num_in_justice_inq,
      status,
      location_inq,
      establis_date_inq,
      acess_level_required,
      victms,
      investigs,

    } = request.body.data;

    

    if (
      !num_inq ||
      typefics.length<0||
      !origin_inq ||
      !prosecution_inq||
      !bail_inq||
      !mat_learned_inq||
      !cod_user_create_inq||
      !cod_user_lastEdit_inq||
      !status ||
      !establis_date_inq

      
    ) {
      return response
        .status(403)
        .json({ response: "Preencha todos os campos" });
    }
    
    const inquiry = await connection("inquiries")
      .where("num_inq", num_inq)
      .orWhere("num_in_justice_inq", num_in_justice_inq).orWhere("num_pat", num_pat).andWhereNot("num_pat","").andWhereNot("num_in_justice_inq","")
      .select("cod_inq")
      .first();


    if (!inquiry) {
      const [id] = await connection("inquiries").insert({
        num_inq,
        num_in_justice_inq,
        status:parseInt(status),
        location_inq,
        establis_date_inq,
        acess_level_required:parseInt(acess_level_required),

        cod_user_create_inq:parseInt(cod_user_create_inq),
        cod_user_lastEdit_inq:parseInt(cod_user_lastEdit_inq),
        origin_inq:parseInt(origin_inq),
        prosecution_inq,
        bail_inq:parseInt(bail_inq),
        mat_learned_inq:parseInt(mat_learned_inq),

        last_mov_date,
        last_mov_reason,
        last_mov_type,
        last_mov_status,
        last_mov_avara,

        num_pat,
        observation_data,
        done_intima,
        done_oitivas,
        quant_measure_prevents,

      });


      if (movements.length > 0) {
        movements.forEach((element) => {
          element.cod_inq = id;
        }); //POSSO TIRAR ISSO SE EU PUDER ENVIAR OS ALORES DO HEADER NO FRONTEND
        await connection("movement").insert(movements);
      }


      if (victms.length > 0) {
        victms.forEach(async (vit) => {
          const vitname = vit.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          await connection("involved").insert({
            name_involv: vitname,
            cod_inq: id,
            type_involv: 1, //vítima
          });
        });
      }


      if (investigs.length > 0) {
        investigs.forEach(async (inv) => {
          const invname = inv.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          await connection("involved").insert({
            name_involv: invname,
            cod_inq: parseInt(id),
            type_involv: 0, //investigado
          });
        });
      }
      
      if(typefics.length>0){
        typefics.forEach(async (type)=>{
          await connection("typefics_inqs").insert({
            cod_inq:parseInt(id),
            cod_typefic:parseInt(type)
          });
        })
      }

      if(measure_prevent.length>0){
        measure_prevent.forEach(async (measure)=>{
          await connection("measure_prevents").insert({
            process_num:measure.process_num,
		        avara:measure.avara.toUpperCase(),
            cod_inq:parseInt(id),
          });
        })
      }

      return response
        .status(200)
        .json({ response: "Inquerito criado com sucesso!" });
    } else {
      return response
        .status(401)
        .json({ response: "Ja existe um inquerito com esse numero :/" });
    }
  },

  async update(request, response) {
    //quando apertar salvar no editar

    const { id } = request.params;
    
    const {
      movements,


      typefics,//novo
      measure_prevent,//nao tem mais

      bail_inq,
      mat_learned_inq,

      origin_inq,
      prosecution_inq,

      num_pat,
      observation_data,
      done_intima,
      done_oitivas,
      quant_measure_prevents,

      cod_user_create_inq,
      cod_user_lastEdit_inq,

      last_mov_date,
      last_mov_reason,
      last_mov_type,
      last_mov_status,
      last_mov_avara,

      num_inq,
      num_in_justice_inq,
      status,
      location_inq,
      establis_date_inq,
      acess_level_required,
      victms,
      investigs,
    } = request.body.data;
    
    if (
      !num_inq ||
      !origin_inq ||
      !prosecution_inq||
      !bail_inq||
      !mat_learned_inq||
      !cod_user_create_inq||
      !cod_user_lastEdit_inq||
      !status ||
      !establis_date_inq

      
      
    ) {
      return response
        .status(400)
        .json({ response: "Preencha todos os campos" });
    }

    
    const checkInquiryWithnumbers_numinq = await connection("inquiries")
      .where("num_inq", num_inq).orWhere("num_in_justice_inq", num_in_justice_inq).andWhereNot("num_in_justice_inq","").orWhere("num_pat",num_pat).andWhereNot("num_pat","")
      .select("cod_inq");
    
      
      
    var codi=false;
    checkInquiryWithnumbers_numinq.forEach((i)=>{
      if ((i && i.cod_inq!=id) ) {
        codi=true;
      }
    })
    if(codi){
      return response.status(401).json({
        response: "Não foi possivel alterar pois ja existe um inquérito com esses nuemros. :/",
      });
    }

    const inquiry = await connection("inquiries")
      .where("cod_inq", id)
      .select("cod_inq");
    if (!inquiry) {
      return response.status(401).json({
        response: "Inquerito não existe, portanto não pode ser alterado :/",
      });
    }

    
    await connection("inquiries").where("cod_inq", id).update({
      

        num_inq,
        num_in_justice_inq,
        status,
        location_inq,
        establis_date_inq,
        acess_level_required:parseInt(acess_level_required),

        cod_user_create_inq,
        cod_user_lastEdit_inq,
        origin_inq,
        prosecution_inq,
        bail_inq,
        mat_learned_inq,

        num_pat,
        observation_data,
        done_intima,
        done_oitivas,
        quant_measure_prevents,

        last_mov_date,
      last_mov_reason,
      last_mov_type,
      last_mov_status,
      last_mov_avara,
    });

    if (movements.length > 0) {
      movements.forEach((element) => {
        element.cod_inq = id;
      }); //POSSO TIRAR ISSO SE EU PUDER ENVIAR OS ALORES DO HEADER NO FRONTEND
      await connection("movement").insert(movements);
    }
    if (victms.length > 0) {
      victms.forEach(async (vit) => {
        const vitname = vit.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        await connection("involved").insert({
          name_involv: vitname,
          cod_inq: id,
          type_involv: 1, //vítima
        });
      });
    }
    if (investigs.length > 0) {
      investigs.forEach(async (inv) => {
        const invname = inv.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        await connection("involved").insert({
          name_involv: invname,
          cod_inq: id,
          type_involv: 0, //investigado
        });
      });
    }

    if(typefics.length>0){
      typefics.forEach(async (type)=>{
        await connection("typefics_inqs").insert({
          cod_inq:id,
          cod_typefic:type
        });
      })
    }

    if(measure_prevent.length>0){
        measure_prevent.forEach(async (measure)=>{
          await connection("measure_prevents").insert({
            process_num:measure.process_num,
		        avara:measure.avara.toUpperCase(),
            cod_inq:id,
          });
        })
      }
    return response.status(201).json({ response: "Inquérito alterado com sucesso!" });
  },

  async delete(request, response) {
    const { id } = request.params;
    const inquiry = await connection("inquiries")
      .where("cod_inq", id)
      .select("cod_inq")
      .first();
    if (!inquiry) {
      return response.json({
        response: "Inquerito não existe, portanto não pode ser apagado :/",
      });
    }
    await connection("inquiries").where("cod_inq", id).delete();
    await connection("movement").where("cod_inq", id).delete();
    await connection("involved").where("cod_inq", id).delete();
    await connection("measure_prevents").where("cod_inq", id).delete();
    await connection("typefics_inqs").where("cod_inq", id).delete();


    return response.json({ response: "Inquérito apagado com sucesso!" });
  },

  async indexonly(request, response) {
    //quando apertar editar em um inquerito

    const { id } = request.params;
    const inquiries = await connection("inquiries")
      .select("*")
      .where("cod_inq", id);
    if (inquiries.length <= 0) {
      return response.status(401).json({ response: "Nenhum inquérito encontrado!" });
    }

 
    const movements = await connection("movement")
      .select("*")
      .where("cod_inq", id);
    const victim = await connection("involved")
      .select("*")
      .where("cod_inq", id)
      .andWhere("type_involv", 1);
    const investig = await connection("involved")
      .select("*")
      .where("cod_inq", id)
      .andWhere("type_involv", 0);

    const measure_prevents = await connection("measure_prevents").select("*")
      .where("cod_inq",id);
    
    const typefics = await connection("typefics_inqs").select("*")
      .where("cod_inq",id);

    

    inquiries[0].victms = victim;
    inquiries[0].investigs = investig;
    inquiries[0].movements = movements;
    inquiries[0].measure_prevents = measure_prevents;
    inquiries[0].typefics = typefics;
   
    
    return response.status(201).json(inquiries[0]);
  },
};
