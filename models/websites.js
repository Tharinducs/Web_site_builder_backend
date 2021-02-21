var sql = require("../config/db");

//create website
module.exports.save_websites = (website, callback) => {
    sql.query("INSERT INTO  websites SET ?", website, callback);
};

//create draft
module.exports.save_drafts = (website, callback) =>{
    sql.query("INSERT INTO drafts SET ?", website, callback);
}

//get drfts by user is
module.exports.get_drft_by_user_id = (userId, callback) =>{
    sql.query("SELECT * FROM drafts WHERE userId='" + userId + "'",callback)
}

//delete drft opon website creation
module.exports.delete_drft_by_user_id = (userId)=>{
    sql.query("DELETE FROM drafts WHERE userId='"+userId+"'")
}


//update draft
module.exports.update_draft = (draft,id,callback) =>{
    sql.query("UPDATE drafts SET ? WHERE id='"+id+"'",draft,callback)
}

//get websites using user is
module.exports.get_websites_by_user_id = (userId,callback) =>{
    sql.query("SELECT * FROM websites WHERE userId='"+userId+"'",callback)
}

//get website by website id
module.exports.get_website_by_id = (id,callback) =>{
    sql.query("SELECT * FROM websites WHERE id='"+id+"'",callback)
}

//update website
module.exports.update_website = (website,callback) =>{
    sql.query("UPDATE websites SET ? WHERE id='"+ website.id+"'",website,callback);
}


//get website by id
module.exports.get_website_by_id = (id,callback) =>{
    sql.query("SELECT * FROM websites WHERE id='"+id+"'",callback)
}