
exports.up = function(knex) {
    return knex.schema.createTable('typefics_inqs',function(table){
        table.increments('cod_typefics_inqs').primary();
        table.int('cod_inq').notNullable();
        table.int('cod_typefic').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('typefics_inqs');
};
