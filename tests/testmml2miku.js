/// <reference path="mocha.d.ts" />
/// <reference path="chai.d.ts" />
/// <reference path="../src/mml2miku.ts" />
// import chai = require('chai');
var expect = chai.expect;

describe("MMLParser", function () {
    var parser;
    beforeEach(function () {
        parser = new MML2Miku.MMLParser();
    });

    describe("parseLength", function () {
        it("should return 4", function () {
            expect(parser.parseLength("l4").val).to.equal(4);
        });
        it("should return 3", function () {
            expect(parser.parseLength("l4.").val).to.equal(3);
        });
        it("should return 1.5", function () {
            expect(parser.parseLength("l2.").val).to.equal(1.5);
        });
    });

    describe("parseTempo", function () {
        it("should return 120", function () {
            expect(parser.parseTempo("t120").val).to.equal(120);
        });
        it("should return 1024", function () {
            expect(parser.parseTempo("t1024").val).to.equal(1024);
        });
    });

    describe("parseOctave", function () {
        it("should return 5", function () {
            expect(parser.parseOctave("o5").val).to.equal(5);
        });
        it("should return 10", function () {
            expect(parser.parseOctave("o10").val).to.equal(10);
        });
    });

    describe("parseOctaveDown", function () {
        it("should return -1", function () {
            expect(parser.parseOctaveDown("<").diff).to.equal(-1);
        });
    });

    describe("parseOctaveUp", function () {
        it("should return 1", function () {
            expect(parser.parseOctaveUp(">").diff).to.equal(1);
        });
    });

    describe("parseVolume", function () {
        it("should return 128", function () {
            expect(parser.parseVolume("v128").val).to.equal(128);
        });
    });

    describe("parseVelocity", function () {
        it("should return 5", function () {
            expect(parser.parseVelocity("k64").val).to.equal(64);
        });
    });

    describe("parseVelocityUp", function () {
        it("should return 2", function () {
            expect(parser.parseVelocityUp(")2").diff).to.equal(2);
        });
    });

    describe("parseVelocityDown", function () {
        it("should return -12", function () {
            expect(parser.parseVelocityDown("(12").diff).to.equal(-12);
        });
    });

    describe("parseProgram", function () {
        it("should return 1", function () {
            expect(parser.parseProgram("@1").val).to.equal(1);
        });
    });

    describe("parseRest", function () {
        it("should return 4", function () {
            expect(parser.parseRest("r4").val).to.equal(4);
        });
    });

    describe("parseNote", function () {
        it("should return 4", function () {
            expect(parser.parseNote("d4").val).to.equal(4);
        });
        it("should return 2", function () {
            expect(parser.parseNote("d4").extra).to.equal(2);
        });

        it("should return 6", function () {
            expect(parser.parseNote("g+8.").val).to.equal(6);
        });
        it("should return 8", function () {
            expect(parser.parseNote("g+8.").extra).to.equal(8);
        });
    });

    describe("parseVoice", function () {
        it("should return 0x4", function () {
            expect(parser.parseVoice("O").val).to.equal(0x4);
        });
        it("should return 0x7f", function () {
            expect(parser.parseVoice("N").val).to.equal(0x7f);
        });
        it("should return 0x5f", function () {
            expect(parser.parseVoice("FA").val).to.equal(0x5f);
        });
    });

    describe("parseNoCommand", function () {
        it("should return null", function () {
            expect(parser.parseNoCommand("  ").val).to.equal(undefined);
        });
    });

    describe("selectParser", function () {
        it("should return parseLength", function () {
            expect(parser.selectParser("l")).to.equal(parser.parseLength);
        });
        it("should return parseTempo", function () {
            expect(parser.selectParser("t")).to.equal(parser.parseTempo);
        });
        it("should return parseOctave", function () {
            expect(parser.selectParser("o")).to.equal(parser.parseOctave);
        });
        it("should return parseOctaveUp", function () {
            expect(parser.selectParser(">")).to.equal(parser.parseOctaveUp);
        });
        it("should return parseOctaveDown", function () {
            expect(parser.selectParser("<")).to.equal(parser.parseOctaveDown);
        });
        it("should return parseVolume", function () {
            expect(parser.selectParser("v")).to.equal(parser.parseVolume);
        });
        it("should return parseVelocity", function () {
            expect(parser.selectParser("k")).to.equal(parser.parseVelocity);
        });
        it("should return parseVelocityUp", function () {
            expect(parser.selectParser(")")).to.equal(parser.parseVelocityUp);
        });
        it("should return parseVelocityDown", function () {
            expect(parser.selectParser("(")).to.equal(parser.parseVelocityDown);
        });
        it("should return parseProgram", function () {
            expect(parser.selectParser("@")).to.equal(parser.parseProgram);
        });
        it("should return parseRest", function () {
            expect(parser.selectParser("r")).to.equal(parser.parseRest);
        });
        it("should return parseVoice", function () {
            expect(parser.selectParser("B")).to.equal(parser.parseVoice);
        });
        it("should return parseNote", function () {
            expect(parser.selectParser("b")).to.equal(parser.parseNote);
        });
    });

    describe("parseToCommands", function () {
        it("should return 4", function () {
            expect(parser.parseToCommands("o4 KA b2")[0].val).to.equal(4);
        });
        it("should return 5", function () {
            expect(parser.parseToCommands("o4 KA b2")[1].val).to.equal(5);
        });
        it("should return 2", function () {
            expect(parser.parseToCommands("o4 KA b2")[2].val).to.equal(2);
        });
        it("should return 11", function () {
            expect(parser.parseToCommands("o4 KA b2 |")[2].extra).to.equal(11);
        });
        it("should return undefined", function () {
            expect(parser.parseToCommands(" |  | ")[0].val).to.equal(undefined);
            expect(parser.parseToCommands(" |  | ")[1].val).to.equal(undefined);
        });
    });
});

describe("MIDIData", function () {
    var midi;
    beforeEach(function () {
        midi = new MIDI.MIDIData();
    });

    describe("calcDelay", function () {
        it("should return 1000", function () {
            expect(midi.calcDelay(60, 4)).to.equal(1000);
        });
        it("should return 500", function () {
            expect(midi.calcDelay(120, 4)).to.equal(500);
        });
    });

    describe("calcNote", function () {
        it("should return 42", function () {
            expect(midi.calcNote(4, 4)).to.equal(52);
        });
        it("should return 63", function () {
            expect(midi.calcNote(5, 3)).to.equal(63);
        });
    });

    describe("noteOn", function () {
        it("should return [0x90,12,64]", function () {
            expect(midi.noteOn(12, 64, 500).msg).to.eql([0x90, 12, 64]);
        });
        it("should return 500", function () {
            expect(midi.noteOn(12, 64, 500).delay).to.equal(500);
        });
    });

    describe("noteOff", function () {
        it("should return [0x80,12,0]", function () {
            expect(midi.noteOff(12, 1000).msg).to.eql([0x80, 12, 0]);
        });
        it("should return 1000", function () {
            expect(midi.noteOff(12, 1000).delay).to.equal(1000);
        });
    });

    describe("setVoice", function () {
        it("should return [0xf0,0x43,0x79,0x09,0x11,0x0a,0,2,0xf7]", function () {
            expect(midi.setVoice([2], 0).msg).to.eql([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0a, 0, 2, 0xf7]);
        });
        it("should return [0xf0,0x43,0x79,0x09,0x11,0x0a,0,3,40,0xf7]", function () {
            expect(midi.setVoice([3, 40], 0).msg).to.eql([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0a, 0, 3, 40, 0xf7]);
        });
    });

    describe("voiceMsg", function () {
        it("should return [0xf0,0x43,0x79,0x09,0x11,0x0a,0,3,40,0xf7]", function () {
            expect(midi.voiceMsg([new MIDI.Voice(3), new MIDI.Voice(40)], 0).msg).to.eql([0xf0, 0x43, 0x79, 0x09, 0x11, 0x0a, 0, 3, 40, 0xf7]);
        });
    });

    describe("toMessages", function () {
        it("len should return 2", function () {
            expect(midi.len).to.equal(4);
            midi.toMessages([new MIDI.Length(2)]);
            expect(midi.len).to.equal(2);
        });
        it("tempo should return 120", function () {
            expect(midi.tempo).to.equal(60);
            midi.toMessages([new MIDI.Tempo(120)]);
            expect(midi.tempo).to.equal(120);
        });
        it("octave should return 5", function () {
            expect(midi.octave).to.equal(4);
            midi.toMessages([new MIDI.Octave(5)]);
            expect(midi.octave).to.equal(5);
            midi.toMessages([new MIDI.Octave(null, 1)]);
            expect(midi.octave).to.equal(6);
            midi.toMessages([new MIDI.Octave(null, -1)]);
            expect(midi.octave).to.equal(5);
        });
        it("volume should return 64", function () {
            expect(midi.volume).to.equal(127);
            midi.toMessages([new MIDI.Volume(64)]);
            expect(midi.volume).to.equal(64);
        });
        it("velocity should return 10", function () {
            expect(midi.velocity).to.equal(127);
            midi.toMessages([new MIDI.Velocity(10)]);
            expect(midi.velocity).to.equal(10);
            midi.toMessages([new MIDI.Velocity(null, 10)]);
            expect(midi.velocity).to.equal(20);
            midi.toMessages([new MIDI.Velocity(null, -10)]);
            expect(midi.velocity).to.equal(10);
        });
        it("program should return 64", function () {
            expect(midi.program).to.equal(0);
            midi.toMessages([new MIDI.Program(5)]);
            expect(midi.program).to.equal(5);
        });
    });

    describe("setParameter", function () {
        it("len should return 8", function () {
            midi.setParameter(new MIDI.Length(8));
            expect(midi.len).to.equal(8);
        });
        it("tempo should return 111", function () {
            midi.setParameter(new MIDI.Tempo(111));
            expect(midi.tempo).to.equal(111);
        });
        it("octave should return 5", function () {
            midi.setParameter(new MIDI.Octave(5));
            expect(midi.octave).to.equal(5);
            midi.setParameter(new MIDI.Octave(null, -1));
            expect(midi.octave).to.equal(4);
            midi.setParameter(new MIDI.Octave(null, 1));
            expect(midi.octave).to.equal(5);
        });
        it("volume should return 55", function () {
            midi.setParameter(new MIDI.Volume(55));
            expect(midi.volume).to.equal(55);
        });
        it("velocity should return 5", function () {
            midi.setParameter(new MIDI.Velocity(5));
            expect(midi.velocity).to.equal(5);
            midi.setParameter(new MIDI.Velocity(null, -1));
            expect(midi.velocity).to.equal(4);
            midi.setParameter(new MIDI.Velocity(null, 1));
            expect(midi.velocity).to.equal(5);
        });
        it("program should return 55", function () {
            midi.setParameter(new MIDI.Program(42));
            expect(midi.program).to.equal(42);
        });
    });
});
