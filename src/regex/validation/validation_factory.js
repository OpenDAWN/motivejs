// this makes a validation function for a string type defined by 'name'
module.exports = function(name, regex, parsing_function) {
  return function(input) {
    if (typeof input !== 'string') {
      throw new TypeError('Cannot validate ' + name + '. Input must be a string.');
    }
    var validate = function() {
      return input.match(regex) ? true : false;
    };
    return {
      valid: validate(),
      parse: function(){
        if (!validate()) {
          return false;
        }
        var captures = regex.exec(input);
        return parsing_function(captures);
      }
    };
  };
};
