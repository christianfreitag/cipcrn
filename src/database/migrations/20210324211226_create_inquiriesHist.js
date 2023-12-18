
exports.up = function(knex) {
  return knex.schema.createTable('inquiriesHist',function(table){
    table.increments('cod_inqh').primary();
    table.string('date_inqh').notNullable();
    table.string('time_inqh').notNullable();
    table.string('action_inqh').notNullable();
    table.string('action_type_inqh').notNullable();
    table.int('cod_user').notNullable(); //FOREIGN
    table.int('cod_inq').notNullable(); //FOREIGN
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('inquiriesHist');
};
