const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const mongoose = require("mongoose");
const EmployeeModel = mongoose.model("EmployeesModel");
const keys = require("../config/keys");

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
  passport.use(
    new JwtStrategy(opts, (jwt_payload, done) => {
      EmployeeModel.findById(jwt_payload._id )
        .then(employee => {
          if (employee) {
            return done(null, employee);
          }
          return done(null, false);
        })
        .catch(err => console.log(err));
    })
  );
};
