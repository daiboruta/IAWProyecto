import User from '../models/User';
import passport from 'passport';

var LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    
    usernameField: 'name'
  },
  
  function(username, password, done) {
    
    User.findOne({ name: username }, function (err, user) {
        
        if (err) { return done(err); }
      
        if (!user) {
            
            return done(null, false, { message: 'Credenciales invalidas' });
        }
        
        if (!user.validPassword(password)) {
        
            return done(null, false, { message: 'Credenciales invalidas' });
        }
    
        return done(null, user);
    });
  }
));
