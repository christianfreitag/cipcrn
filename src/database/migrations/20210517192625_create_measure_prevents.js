
exports.up = function(knex) {
    return knex.schema.createTable('measure_prevents',function(table){
        table.increments('cod_measure_prevent').primary();
        table.string('process_num').notNullable();
        table.string('avara').notNullable();
        table.int('cod_inq').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('measure_prevents');
};
