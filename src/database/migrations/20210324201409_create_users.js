
exports.up = function(knex) {
    return knex.schema.createTable('users',function(table){
        table.increments('cod_user').primary();
        table.int('station').notNullable();
        table.string('user_name').notNullable();
        table.string('cpf_user').notNullable();
        table.string('email_user').notNullable();
        table.string('pw_user').notNullable();
        table.string('ipw_userv').notNullable();
        table.int('acess_level_user').notNullable();
        table.int('invited_by').notNullable();
        table.int('account_status').notNullable();

    }); 
};

exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
