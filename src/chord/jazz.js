var validate                = require('../regex/validation/chord_name'),
    note                    = require('../note/note'),
    transpose               = require('../utilities/transpose'),
    getSpeciesIntervals     = require('./get_species_intervals'),
    applyAlterations        = require('../palette/apply_alterations');

function getNotes(intervals, root) {
  var output = [];
  output.push(root);
  for (var i = 1; i < intervals.length; i++) {
    output.push(root.up(intervals[i]));
  }
  return output;
}

function JazzChord(chord_name) {
  var parsed = validate(chord_name).parse();
  if (!parsed) {
    throw new Error('Invalid chord name.');
  }
  var speciesIntervals = getSpeciesIntervals(parsed.species);

  var memberIntervals = applyAlterations(speciesIntervals, parsed.alterations);

  this.name = chord_name;
  this.type = 'chord';
  this.root = note(parsed.root);
  this.formula = parsed.species + parsed.alterations;
  this.isSlash = parsed.slash === '/' ? true : false;
  this.bass = this.isSlash ? note(parsed.bass) : this.root;
  this.intervals = memberIntervals;
  this.notes = getNotes(this.intervals, this.root);
}

JazzChord.prototype.transpose = function(direction, interval) {
  return new JazzChord(transpose(this.root, direction, interval).name + this.formula);
};
JazzChord.prototype.toString = function() {
  return '[chord ' + this.name + ']';
};

module.exports = function(chord_name) {
  return new JazzChord(chord_name);
};
