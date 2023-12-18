// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/database/db.sqlite',
    },
    useNullAsDefault: true,
    migrations:{
      directory: './src/database/migrations'
    }
    
    
  },


};

