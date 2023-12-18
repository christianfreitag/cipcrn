
exports.up = function(knex) {
    return knex.schema.createTable('involved',function(table){
        table.increments('cod_involv').primary();
        table.int('cod_inq').notNullable();
        table.int('type_involv').notNullable();
        table.string('name_involv').notNullable();

    });
};

exports.down = function(knex) {
   return knex.schema.dropTable('involved');
};
