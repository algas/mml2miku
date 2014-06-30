/*!
* mml2miku JavaScript (TypeScript) Library v0.0.3
* https://github.com/algas/mml2miku.git
*
* Copyright 2014 Masahiro Yamauchi
* Released under the MIT license
* https://github.com/algas/mml2miku/blob/master/LICENSE
*/
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var MML2Miku;
(function (MML2Miku) {
    var MMLParser = (function () {
        function MMLParser() {
            this.scale = {
                "c": 0, "b+": 0,
                "c+": 1, "d-": 1,
                "d": 2,
                "d+": 3, "e-": 3,
                "e": 4, "f-": 4,
                "f": 5, "e+": 5,
                "f+": 6, "g-": 6,
                "g": 7,
                "g+": 8, "a-": 8,
                "a": 9,
                "a+": 10, "b-": 10,
                "b": 11, "c-": 11
            };
            this.voice = [
                "A", "I", "U", "E", "O",
                "KA", "KI", "KU", "KE", "KO",
                "GA", "GI", "GU", "GE", "GO",
                "KYA", "KYU", "KYO",
                "GYA", "GYU", "GYO",
                "SA", "SI", "SU", "SE", "SO",
                "ZA", "ZI", "ZU", "ZE", "ZO",
                "SHA", "SHI", "SHU", "SHE", "SHO",
                "JA", "JI", "JU", "JE", "JO",
                "TA", "TI", "TU", "TE", "TO",
                "DA", "DI", "DU", "DE", "DO",
                "TYU", "DYU",
                "CHA", "CHI", "CHU", "CHE", "CHO",
                "TSA", "TSI", "TSU", "TSE", "TSO",
                "NA", "NI", "NU", "NE", "NO",
                "NYA", "NYU", "NYO",
                "HA", "HI", "HU", "HE", "HO",
                "BA", "BI", "BU", "BE", "BO",
                "PA", "PI", "PU", "PE", "PO",
                "HYA", "HYU", "HYO",
                "BYA", "BYU", "BYO",
                "PYA", "PYU", "PYO",
                "FA", "FI", "FU", "FE", "FO",
                "MA", "MI", "MU", "ME", "MO",
                "MYA", "MYU", "MYO",
                "YA", "YU", "YO",
                "RA", "RI", "RU", "RE", "RO",
                "RYA", "RYU", "RYO",
                "WA", "WI", "WE", "WO",
                "NN", "M", "NG", "J", "N"
            ];
            this.prefixFunction = {
                "l": this.parseLength,
                "t": this.parseTempo,
                "o": this.parseOctave,
                ">": this.parseOctaveUp,
                "<": this.parseOctaveDown,
                "v": this.parseVolume,
                "k": this.parseVelocity,
                ")": this.parseVelocityUp,
                "(": this.parseVelocityDown,
                "@": this.parseProgram,
                "r": this.parseRest,
                "abcdefg": this.parseNote,
                "ABCDEFGHIJKLMNOPQRSTUVWXYZ": this.parseVoice
            };
            this.textFilter = null;
            this.textFilter = new TextFilter();
        }
        MMLParser.prototype.getVoice = function (text) {
            return this.voice.indexOf(text);
        };

        MMLParser.prototype.getScale = function (text) {
            return this.scale[text];
        };

        MMLParser.prototype.getFloat = function (dotNum) {
            var dotIndex = dotNum.indexOf(".");
            if (dotIndex < 0) {
                return parseFloat(dotNum);
            } else {
                return parseFloat(dotNum.slice(0, dotIndex)) / 2.0 * 1.5;
            }
        };

        MMLParser.prototype.parseNumber = function (prefix, text) {
            var re = new RegExp("^" + prefix + "([0-9]+)$");
            return parseInt(re.exec(text)[1]);
        };

        MMLParser.prototype.parseNumDot = function (prefix, text) {
            var re = new RegExp("^" + prefix + "([1-9][0-9]*\.*)$");
            return this.getFloat(re.exec(text)[1]);
        };

        MMLParser.prototype.parseNoteValue = function (prefix, text) {
            var re = new RegExp("^" + prefix + "([0-9\\.]**)$");
            if (re == null) {
                return null;
            }
            return this.getFloat(re.exec(text)[1]);
        };

        MMLParser.prototype.parseLength = function (text) {
            return new MIDI.Length(this.parseNumDot("l", text));
        };

        MMLParser.prototype.parseTempo = function (text) {
            return new MIDI.Tempo(this.parseNumber("t", text));
        };

        MMLParser.prototype.parseOctave = function (text) {
            return new MIDI.Octave(this.parseNumber("o", text));
        };

        MMLParser.prototype.parseOctaveUp = function (text) {
            if (text == ">") {
                return new MIDI.Octave(null, 1);
            }
        };

        MMLParser.prototype.parseOctaveDown = function (text) {
            if (text == "<") {
                return new MIDI.Octave(null, -1);
            }
        };

        MMLParser.prototype.parseVolume = function (text) {
            return new MIDI.Volume(this.parseNumber("v", text));
        };

        MMLParser.prototype.parseVelocity = function (text) {
            return new MIDI.Velocity(this.parseNumber("k", text));
        };

        MMLParser.prototype.parseVelocityUp = function (text) {
            return new MIDI.Velocity(null, this.parseNumber("\\)", text));
        };

        MMLParser.prototype.parseVelocityDown = function (text) {
            return new MIDI.Velocity(null, -this.parseNumber("\\(", text));
        };

        MMLParser.prototype.parseProgram = function (text) {
            return new MIDI.Program(this.parseNumber("@", text));
        };

        MMLParser.prototype.parseRest = function (text) {
            var re = new RegExp("^r([0-9\\.]*)$");
            return new MIDI.Rest(this.getFloat(re.exec(text)[1]));
        };

        MMLParser.prototype.parseNote = function (text) {
            var re = new RegExp("^([a-g][+\\-]*)([0-9\\.]*)$");
            var match = re.exec(text);
            return new MIDI.Note(this.getFloat(match[2]), null, this.getScale(match[1]));
        };

        MMLParser.prototype.parseVoice = function (text) {
            var re = new RegExp("^([A-Z]+)$");
            return new MIDI.Voice(this.getVoice(re.exec(text)[1]));
        };

        MMLParser.prototype.parseNoCommand = function (text) {
            return new MIDI.NoCommand();
        };

        MMLParser.prototype.parseToCommands = function (text) {
            var cs = this.textFilter.run(text).split(" ");
            var c;
            var command;
            var commands = [];
            for (var i = 0; i < cs.length; i++) {
                c = cs[i];
                if (c.length > 0) {
                    command = this.selectParser(c.charAt(0)).bind(this)(c);
                    commands.push(command);
                }
            }
            return commands;
        };

        MMLParser.prototype.selectParser = function (c) {
            for (var key in this.prefixFunction) {
                if (key.indexOf(c) >= 0) {
                    return this.prefixFunction[key];
                }
            }
            return this.parseNoCommand;
        };

        MMLParser.prototype.parseMML = function (text) {
            var commands = this.parseToCommands(text);
            var data = new MIDI.MIDIData();
            return data.toMessages(commands);
        };
        return MMLParser;
    })();
    MML2Miku.MMLParser = MMLParser;

    var TextFilter = (function () {
        function TextFilter() {
        }
        TextFilter.prototype.commentOutBlock = function (text) {
            return text.replace(/\/\*(.*?)\*\//g, " ");
        };

        TextFilter.prototype.commentOutLine = function (text) {
            return text.replace(/;(.*?)(?:\r\n|\n|$)/g, " ");
        };

        TextFilter.prototype.strip = function (text) {
            return text.replace(/^\s*(.*?)\s*$/, "$1");
        };

        TextFilter.prototype.replaceSeparators = function (text) {
            return text.replace("|", " ");
        };

        TextFilter.prototype.removeDuplicates = function (text) {
            return text.replace(/\s+/g, " ");
        };

        TextFilter.prototype.run = function (text) {
            return this.strip(this.removeDuplicates(this.commentOutLine(this.replaceSeparators(this.strip(this.commentOutBlock(text))))));
        };
        return TextFilter;
    })();
    MML2Miku.TextFilter = TextFilter;
})(MML2Miku || (MML2Miku = {}));

var MIDI;
(function (MIDI) {
    // commands
    var MIDICommand = (function () {
        function MIDICommand(val, diff, extra) {
            this.val = val;
            this.diff = diff;
            this.extra = extra;
        }
        return MIDICommand;
    })();
    MIDI.MIDICommand = MIDICommand;

    var Length = (function (_super) {
        __extends(Length, _super);
        function Length() {
            _super.apply(this, arguments);
        }
        return Length;
    })(MIDICommand);
    MIDI.Length = Length;
    ;
    var Tempo = (function (_super) {
        __extends(Tempo, _super);
        function Tempo() {
            _super.apply(this, arguments);
        }
        return Tempo;
    })(MIDICommand);
    MIDI.Tempo = Tempo;
    ;
    var Octave = (function (_super) {
        __extends(Octave, _super);
        function Octave() {
            _super.apply(this, arguments);
        }
        return Octave;
    })(MIDICommand);
    MIDI.Octave = Octave;
    ;
    var Volume = (function (_super) {
        __extends(Volume, _super);
        function Volume() {
            _super.apply(this, arguments);
        }
        return Volume;
    })(MIDICommand);
    MIDI.Volume = Volume;
    ;
    var Velocity = (function (_super) {
        __extends(Velocity, _super);
        function Velocity() {
            _super.apply(this, arguments);
        }
        return Velocity;
    })(MIDICommand);
    MIDI.Velocity = Velocity;
    ;
    var Program = (function (_super) {
        __extends(Program, _super);
        function Program() {
            _super.apply(this, arguments);
        }
        return Program;
    })(MIDICommand);
    MIDI.Program = Program;
    ;
    var Note = (function (_super) {
        __extends(Note, _super);
        function Note() {
            _super.apply(this, arguments);
        }
        return Note;
    })(MIDICommand);
    MIDI.Note = Note;
    ;
    var Rest = (function (_super) {
        __extends(Rest, _super);
        function Rest() {
            _super.apply(this, arguments);
        }
        return Rest;
    })(MIDICommand);
    MIDI.Rest = Rest;
    ;
    var Voice = (function (_super) {
        __extends(Voice, _super);
        function Voice() {
            _super.apply(this, arguments);
        }
        return Voice;
    })(MIDICommand);
    MIDI.Voice = Voice;
    ;
    var NoCommand = (function (_super) {
        __extends(NoCommand, _super);
        function NoCommand() {
            _super.apply(this, arguments);
        }
        return NoCommand;
    })(MIDICommand);
    MIDI.NoCommand = NoCommand;
    ;

    // data
    var MIDIData = (function () {
        function MIDIData() {
            this.len = 4;
            this.tempo = 60;
            this.octave = 4;
            this.velocity = 127;
        }
        MIDIData.prototype.toMessages = function (commands) {
            var c = null;
            var msgs = [];
            var voiceList = [];
            var oldCommand = null;
            var noteList = [];
            var result = [];
            for (var i = 0; i < commands.length; i++) {
                c = commands[i];
                if (oldCommand instanceof Voice) {
                    if (!(c instanceof Voice)) {
                        msgs.push(this.voiceMsg(voiceList));
                        voiceList = [];
                    }
                }
                if (c instanceof Voice) {
                    voiceList.push(c);
                } else if (c instanceof Note) {
                    msgs = this.noteMsg(c, msgs);
                    if (c.val == 0) {
                        noteList.push(this.calcNote(this.octave, c.extra));
                    } else {
                        while (noteList.length > 0) {
                            msgs.push(this.noteOff(noteList.pop(), 0));
                        }
                    }
                    result.push(msgs);
                    msgs = [];
                } else if (c instanceof Rest) {
                    msgs = this.restMsg(c, msgs);
                    result.push(msgs);
                    msgs = [];
                } else if (c instanceof Volume) {
                    msgs = this.volumeMsg(c, msgs);
                } else if (c instanceof Program) {
                    msgs = this.programMsg(c, msgs);
                } else {
                    this.setParameter(c);
                }
                oldCommand = c;
            }
            return result;
        };

        MIDIData.prototype.noteMsg = function (c, msgs) {
            var n = this.calcNote(this.octave, c.extra);
            msgs.push(this.noteOn(n, this.velocity));
            var len = c.val >= 0 ? c.val : this.len;
            if (len > 0) {
                msgs.push(this.noteOff(n, this.calcDelay(this.tempo, len)));
            }
            return msgs;
        };

        MIDIData.prototype.restMsg = function (c, msgs) {
            var len = c.val >= 0 ? c.val : this.len;
            msgs.push(this.noteOff(0, this.calcDelay(this.tempo, len)));
            return msgs;
        };

        MIDIData.prototype.volumeMsg = function (c, msgs) {
            msgs.push(this.setVolume(c.val));
            return msgs;
        };

        MIDIData.prototype.programMsg = function (c, msgs) {
            msgs.push(this.changeProgram(c.val));
            return msgs;
        };

        MIDIData.prototype.voiceMsg = function (voice, memory) {
            if (typeof memory === "undefined") { memory = 0x00; }
            return this.setVoice(voice.map(function (x) {
                return x.val;
            }));
        };

        MIDIData.prototype.setParameter = function (c) {
            if (c instanceof Length) {
                this.len = c.val;
            } else if (c instanceof Tempo) {
                this.tempo = c.val;
            } else if (c instanceof Octave) {
                if (c.val == null) {
                    this.octave += c.diff;
                } else {
                    this.octave = c.val;
                }
            } else if (c instanceof Velocity) {
                if (c.val == null) {
                    this.velocity += c.diff;
                } else {
                    this.velocity = c.val;
                }
            }
        };

        MIDIData.prototype.calcDelay = function (tempo, len) {
            return 60.0 * 1000 * 4 / (tempo * len);
        };

        MIDIData.prototype.calcNote = function (octave, scale) {
            return octave * 12 + scale;
        };

        MIDIData.prototype.noteOn = function (note, velocity, delay) {
            return new MIDIMessage([0x90, note, velocity], delay);
        };

        MIDIData.prototype.noteOff = function (note, delay) {
            return new MIDIMessage([0x80, note, 0x00], delay);
        };

        MIDIData.prototype.setVolume = function (volume) {
            return new MIDIMessage([0xB0, 0x07, volume]);
        };

        MIDIData.prototype.changeProgram = function (program) {
            return new MIDIMessage([0xC0, program]);
        };

        MIDIData.prototype.setVoice = function (voice, memory) {
            if (typeof memory === "undefined") { memory = 0x00; }
            var msg = [0xf0, 0x43, 0x79, 0x09, 0x11, 0x0a, memory];
            for (var i = 0; i < voice.length; i++) {
                msg.push(voice[i]);
            }
            msg.push(0xf7);
            return new MIDIMessage(msg);
        };
        return MIDIData;
    })();
    MIDI.MIDIData = MIDIData;

    // message
    var MIDIMessage = (function () {
        function MIDIMessage(msg, delay) {
            if (typeof delay === "undefined") { delay = 0; }
            this.msg = msg;
            this.delay = delay;
        }
        return MIDIMessage;
    })();
    MIDI.MIDIMessage = MIDIMessage;
})(MIDI || (MIDI = {}));

var parser = new MML2Miku.MMLParser();
