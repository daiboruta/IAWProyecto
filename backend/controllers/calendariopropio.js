import User from '../models/User';

module.exports.calendarioRead = function(req, res) {

  if (!req.payload._id) {
    
    res.status(401).json({ "message" : "Calendario privado" });
  }
  else {
    
    User.findById(req.payload._id).exec(function(err, user) {
        
        res.status(200).json(user);
    });
  }
};