import User from '../models/User';
import passport from 'passport';

module.exports.register = function(req, res) {
    
    User.findOne({name: req.body.name}, function(err, user){
        
        if(user) {

            res.status(401).json({ "message" : "El usuario ya existe" });
        
            return;
        }
    });  
    
    var user = new User();
  
    user.name = req.body.name;
  
    user.setPassword(req.body.password);
  
    user.save(function(err) {

        if (err) {
        
            res.status(404).json(err);
        
            return;
        }
      
        var token = user.generateJwt();
        res.status(200);
        res.json({ "token" : token });
    });
};

module.exports.login = function(req, res) {

    passport.authenticate('local', function(err, user, info){
        
        var token;
        
        if (err) {
        
            res.status(404).json(err);
        
            return;
        }
  
        if(user){
        
            token = user.generateJwt();
            res.status(200);
            res.json({ "token" : token });
        }
        else {
        
            res.status(401).json(info);
        }
    })(req, res);
};