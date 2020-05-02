const getImage = require('../services/getImage');
module.exports = function (res,params){
   
    //res.render('explore', params);
    res.send(params);
    console.log("hello");
}
