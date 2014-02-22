var validation      = require('./regex/note_name'),
    fifths          = require('./primitives/fifths'),
    pitch_names     = require('./primitives/pitch_names'),
    mtof            = require('./convert/mtof'),
    transpose       = require('./utilities/transpose');

var note = (function() {

    // this function will ensure that input to a note method is another note object
    //   in case a string is given instead
    var toNote = function(input) {
        if (typeof input === 'string') {
            input = note(input);
        }
        if (typeof input !== 'object') {
            throw new TypeError('Input must be a note object or note name.');
        }
        return input;
    };

    // checks if a note object has an octave defined on it
    var octaveOn = function(obj) {
        if (typeof obj.octave === 'undefined' || obj.octave === null) {
            return false;
        }
        return true;
    }
    
    var note_prototype = {
        name : 'C',
        pitch_class : 0,
        isEquivalent: function(other) {
            other = toNote(other);
            if (this.name !== other.name) {
                return false;
            }
            if (octaveOn(this) && octaveOn(other) && (this.octave !== other.octave)) {
                return false;
            }
            return true;
        },
        isEnharmonic: function(other) {
            other = toNote(other);
            if (this.pitchClass !== other.pitchClass) {
                return false;
            }
            if (octaveOn(this) && octaveOn(other) && (Math.abs(this.midi - other.midi) > 11)) {
                return false;
            }
            return true;
        },
        setOctave: function(octave) {
            if (typeof octave !== 'number') {
                throw new TypeError('Octave must be a number.');
            }
            this.octave = octave;
            this.scientific = this.name + octave.toString(10);
            this.midi = pitch_names.indexOf(this.scientific);
            this.frequency = mtof(this.midi);
        },
        transpose : function(direction, interval) {
            return note(transpose(this.scientific ? this.scientific : this.name, direction, interval));
        },
        up: function(interval) {
            return this.transpose('up', interval);
        },
        down: function(interval) {
            return this.transpose('down', interval);
        }
    };

    return function note(noteInput) {
        var name;
        if (typeof noteInput ==='string') {
            name = noteInput;
        } else if (typeof noteInput === 'number') {
            name = pitch_names.atIndex(noteInput);
        } else {
            throw new TypeError('Note name must be a string or number.');
        }

        if (!validation.validate(name)) {
            throw new Error('Invalid note name.');
        }

        var parsed = validation.parse(name);
        
        var noteObj = Object.create(note_prototype);
        
        noteObj.name = name;
        noteObj.pitchClass = pitch_names.indexOf(parsed.step + parsed.accidental);

        noteObj.parts = {
            step: parsed.step,
            accidental: parsed.accidental
        };

        if (parsed.octave !== null) {
            noteObj.name = parsed.step + parsed.accidental;
            noteObj.octave = parsed.octave;
            noteObj.scientific = name;
            noteObj.midi = pitch_names.indexOf(noteObj.scientific);
            noteObj.frequency = mtof(noteObj.midi);
        }
        
        return noteObj;
    };

})();

module.exports = note;
