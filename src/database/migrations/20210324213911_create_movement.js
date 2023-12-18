exports.up = function(knex) {
    return knex.schema.createTable('movement',function(table){
          table.increments('cod_mov').primary();
          table.date('data').notNullable();
          table.string('status').notNullable();
          table.int('cod_inq').notNullable();//FOREIGN
          table.int('type_mov').notNullable();
          table.int('reason_mov').notNullable();
          table.string('prosecusion_mov').notNullable();
          table.string('observation_mov').notNullable();

          //quer saber quem fez a movimentação ?
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('movement');
  };