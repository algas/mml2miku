module MML2Miku {
    export class MMLParser {
        scale: { [solfa: string]: number; } = {
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
            "b": 11, "c-": 11,
        };

        voice: Array<string> = [
            "A","I","U","E","O",
            "KA","KI","KU","KE","KO",
            "GA","GI","GU","GE","GO",
            "KYA","KYU","KYO",
            "GYA","GYU","GYO",
            "SA","SI","SU","SE","SO",
            "ZA","ZI","ZU","ZE","ZO",
            "SHA","SHI","SHU","SHE","SHO",
            "JA","JI","JU","JE","JO",
            "TA","TI","TU","TE","TO",
            "DA","DI","DU","DE","DO",
            "TYU","DYU",
            "CHA","CHI","CHU","CHE","CHO",
            "TSA","TSI","TSU","TSE","TSO",
            "NA","NI","NU","NE","NO",
            "NYA","NYU","NYO",
            "HA","HI","HU","HE","HO",
            "BA","BI","BU","BE","BO",
            "PA","PI","PU","PE","PO",
            "HYA","HYU","HYO",
            "BYA","BYU","BYO",
            "PYA","PYU","PYO",
            "FA","FI","FU","FE","FO",
            "MA","MI","MU","ME","MO",
            "MYA","MYU","MYO",
            "YA","YU","YO",
            "RA","RI","RU","RE","RO",
            "RYA","RYU","RYO",
            "WA","WI","WE","WO",
            "NN","M","NG","J","N"
        ];

        prefixFunction: { [key: string]: Function; } = {
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
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ": this.parseVoice,
        };

        getVoice (text: string): number {
            return this.voice.indexOf(text);
        }

        getScale (text: string): number {
            return this.scale[text];
        }

        getFloat (dotNum: string) : number {
            var dotIndex: number = dotNum.indexOf(".");
            if (dotIndex < 0){
                return parseFloat(dotNum);
            } else {
                return parseFloat(dotNum.slice(0, dotIndex)) * 1.5;
            }
        }

        parseNumber (prefix: string, text: string): number {
            var re: RegExp = new RegExp("^"+prefix+"([0-9]+)$");
            return parseInt(re.exec(text)[1]);
        }

        parseNumDot (prefix: string, text: string): number {
            var re: RegExp = new RegExp("^"+prefix+"([1-9][0-9]*\.*)$");
            return this.getFloat(re.exec(text)[1]);
        }

        parseNoteValue (prefix: string, text: string): number {
            var re: RegExp = new RegExp("^"+prefix+"([0-9\\.]**)$");
            if (re == null) {
                return null;
            }
            return this.getFloat(re.exec(text)[1]);
        }

        parseLength (text: string): MIDI.Length {
            return new MIDI.Length(this.parseNumDot("l", text));
        }

        parseTempo (text: string): MIDI.Tempo {
            return new MIDI.Tempo(this.parseNumber("t", text));
        }

        parseOctave (text: string): MIDI.Octave {
            return new MIDI.Octave(this.parseNumber("o", text));
        }

        parseOctaveUp (text: string): MIDI.Octave {
            if (text == ">") {
                return new MIDI.Octave(null, 1);
            }
        }

        parseOctaveDown (text: string): MIDI.Octave {
            if (text == "<") {
                return new MIDI.Octave(null, -1);
            }
        }

        parseVolume (text: string): MIDI.Volume {
            return new MIDI.Volume(this.parseNumber("v", text));
        }

        parseVelocity (text: string): MIDI.Velocity {
            return new MIDI.Velocity(this.parseNumber("k", text));
        }

        parseVelocityUp (text: string): MIDI.Velocity {
            return new MIDI.Velocity(null, this.parseNumber("\\)", text));
        }

        parseVelocityDown (text: string): MIDI.Velocity {
            return new MIDI.Velocity(null, -this.parseNumber("\\(", text));
        }

        parseProgram (text: string): MIDI.Program {
            return new MIDI.Program(this.parseNumber("@", text));
        }

        parseRest (text: string): MIDI.Rest {
            var re: RegExp = new RegExp("^r([0-9\\.]*)$");
            return new MIDI.Rest(this.getFloat(re.exec(text)[1]));
        }

        parseNote (text: string): MIDI.Note {
            var re: RegExp = new RegExp("^([a-g][+\\-]*)([0-9\\.]*)$");
            var match: RegExpExecArray = re.exec(text);
            return new MIDI.Note(this.getFloat(match[2]), null, this.getScale(match[1]));
        }

        parseVoice (text: string): MIDI.Voice {
            var re: RegExp = new RegExp("^([A-Z]+)$");
            return new MIDI.Voice(this.getVoice(re.exec(text)[1]));
        }

        parseToCommands (text: string): Array<MIDI.MIDICommand> {
            var cs: Array<string> = text.split(" ");
            var c: string;
            var command: MIDI.MIDICommand;
            var commands: Array<MIDI.MIDICommand> = [];
            for (var i: number = 0; i < cs.length; i++) {
                c = cs[i];
                command = this.selectParser(c.charAt(0)).bind(this)(c);
                commands.push(command);
            }
            return commands;
        }

        selectParser (c: string): Function {
            for (var key in this.prefixFunction) {
                if (key.indexOf(c) >= 0) {
                    return this.prefixFunction[key];
                }
            }
            return null;
        }

        parseMML (text: string): Array<Array<MIDI.MIDIMessage>> {
            var commands: Array<MIDI.MIDICommand> = this.parseToCommands(text);
            var data: MIDI.MIDIData = new MIDI.MIDIData();
            return data.toMessages(commands);
        }
    }

}


module MIDI {
    // commands
    export class MIDICommand {
        val: number;
        diff: number;
        extra: number;
        constructor(val?: number, diff?: number, extra?: number) {
            this.val = val;
            this.diff = diff;
            this.extra = extra;
        }
    }

    export class Length extends MIDICommand {};
    export class Tempo extends MIDICommand {};
    export class Octave extends MIDICommand {};
    export class Volume extends MIDICommand {};
    export class Velocity extends MIDICommand {};
    export class Program extends MIDICommand {};
    export class Note extends MIDICommand {};
    export class Rest extends MIDICommand {};
    export class Voice extends MIDICommand {};

    // data
    export class MIDIData {
        len: number;
        tempo: number;
        octave: number;
        volume: number;
        velocity: number;
        program: number;
        voice: number;

        constructor() {
            this.len = 4;
            this.tempo = 60;
            this.octave = 4;
            this.volume = 127;
            this.velocity = 127;
            this.program = 0;
            this.voice = 0;
        }

        toMessages (commands: Array<MIDICommand>): Array<Array<MIDIMessage>> {
            var c: MIDICommand;
            var msgs: Array<MIDIMessage> = [];
            var result: Array<Array<MIDIMessage>> = [];
            for (var i: number = 0; i < commands.length; i++){
                c = commands[i];
                if (c instanceof Note) {
                    msgs = this.noteMsg(c, msgs);
                    result.push(msgs);
                    msgs = [];
                }
                else if (c instanceof Rest) {
                    msgs = this.restMsg(c, msgs);
                    result.push(msgs);
                    msgs = [];
                }
                else if (c instanceof Voice) {
                    msgs.push(this.voiceMsg(c.val));
                }
                else {
                    this.setParameter(c);
                }
            }
            return result;
        }

        noteMsg (c: Note, msgs: Array<MIDIMessage>): Array<MIDIMessage> {
            var n = this.calcNote(this.octave, c.extra);
            msgs.push(this.noteOn(n, this.velocity));
            var len = c.val > 0 ? c.val : this.len;
            msgs.push(this.noteOff(n, this.calcDelay(this.tempo, len)));
            return msgs;
        }

        restMsg (c: Rest, msgs: Array<MIDIMessage>): Array<MIDIMessage> {
            var len = c.val > 0 ? c.val : this.len;
            msgs.push(this.noteOff(this.calcNote(this.octave, 0), this.calcDelay(this.tempo, len)));
            return msgs;
        }

        setParameter (c: MIDICommand) {
            if (c instanceof Voice) {
                this.voice = c.val;
            } else if (c instanceof Length) {
                this.len = c.val;
            } else if (c instanceof Tempo) {
                this.tempo = c.val;
            } else if (c instanceof Octave) {
                if (c.val == null) {
                    this.octave += c.diff;
                }
                else {
                    this.octave = c.val;
                }
            } else if (c instanceof Volume) {
                this.volume = c.val;
            } else if (c instanceof Velocity) {
                if (c.val == null) {
                    this.velocity += c.diff;
                }
                else {
                    this.velocity = c.val;
                }
            } else if (c instanceof Program) {
                this.program = c.val;
            }
        }

        calcDelay (tempo: number, len: number): number {
            return 60.0 * 1000 * 4 / (tempo * len);
        }

        calcNote (octave: number, scale: number) {
            return octave * 12 + scale;
        }

        noteOn (note: number, velocity: number, delay?: number): MIDIMessage {
            return new MIDIMessage([0x90, note, velocity], delay);
        }

        noteOff (note: number, delay?: number): MIDIMessage {
            return new MIDIMessage([0x80, note, 0x00], delay);
        }

        voiceMsg (voice: number, memory: number = 0x00): MIDIMessage {
            return new MIDIMessage([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0a, memory, voice, 0xf7]);
        }
    }

    // message
    export class MIDIMessage {
        msg: Array<number>;
        delay: number;

        constructor(msg: Array<number>, delay?: number) {
            this.msg = msg;
            this.delay = delay;
        }
    }

}

var parser = new MML2Miku.MMLParser();