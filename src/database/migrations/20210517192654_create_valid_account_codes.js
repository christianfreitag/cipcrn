
exports.up = function(knex) {
    return knex.schema.createTable('valid_account_codes',function(table){
        table.increments('cod_valid_account_codes').primary();
        table.string('valid_cpf_accont').notNullable();
        table.string('status').notNullable();
        table.int('cod_user').notNullable();
        table.int('acess_level_user').notNullable();
        table.int('station').notNullable();
    })
};

exports.down = function(knex) {
    return knex.schema.dropTable('valid_account_codes');
};
