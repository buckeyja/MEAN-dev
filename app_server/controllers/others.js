/* GET home page */
// module.exports.index = function(req, res){
// 	res.render('index', {title: 'Express' });
// };

/* Get 'about' page */
module.exports.about = function(req, res){
	res.render('index', {title: 'About' });
};