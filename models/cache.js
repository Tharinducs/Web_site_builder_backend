var sql = require("../config/db_cache");

module.exports.get_users_cache_data = (key, callback) => {
    sql.query("SELECT Title,Address,Phone,Latitude,Longitude,Photo,description FROM search_cache WHERE Phone='" + key + "'", callback);
};
  