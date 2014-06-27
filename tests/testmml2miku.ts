/// <reference path="mocha.d.ts" />
/// <reference path="chai.d.ts" />
/// <reference path="../src/mml2miku.ts" />
// import chai = require('chai');
var expect = chai.expect;

describe("MMLParser", () => {
    var parser : MML2Miku.MMLParser;
    beforeEach(() => {
        parser = new MML2Miku.MMLParser();
    });

    describe("parseLength", () => {
        it("should return 4", () => {
            expect(parser.parseLength("l4").val).to.equal(4);
        });
        it("should return 3", () => {
            expect(parser.parseLength("l4.").val).to.equal(3);
        });
        it("should return 1.5", () => {
            expect(parser.parseLength("l2.").val).to.equal(1.5);
        });
    });

    describe("parseTempo", () => {
        it("should return 120", () => {
            expect(parser.parseTempo("t120").val).to.equal(120);
        });
        it("should return 1024", () => {
            expect(parser.parseTempo("t1024").val).to.equal(1024);
        });
    });

    describe("parseOctave", () => {
        it("should return 5", () => {
            expect(parser.parseOctave("o5").val).to.equal(5);
        });
        it("should return 10", () => {
            expect(parser.parseOctave("o10").val).to.equal(10);
        });
    });

    describe("parseOctaveDown", () => {
        it("should return -1", () => {
            expect(parser.parseOctaveDown("<").diff).to.equal(-1);
        });
    });

    describe("parseOctaveUp", () => {
        it("should return 1", () => {
            expect(parser.parseOctaveUp(">").diff).to.equal(1);
        });
    });

    describe("parseVolume", () => {
        it("should return 128", () => {
            expect(parser.parseVolume("v128").val).to.equal(128);
        });
    });

    describe("parseVelocity", () => {
        it("should return 5", () => {
            expect(parser.parseVelocity("k64").val).to.equal(64);
        });
    });

    describe("parseVelocityUp", () => {
        it("should return 2", () => {
            expect(parser.parseVelocityUp(")2").diff).to.equal(2);
        });
    });

    describe("parseVelocityDown", () => {
        it("should return -12", () => {
            expect(parser.parseVelocityDown("(12").diff).to.equal(-12);
        });
    });

    describe("parseProgram", () => {
        it("should return 1", () => {
            expect(parser.parseProgram("@1").val).to.equal(1);
        });
    });

    describe("parseRest", () => {
        it("should return 4", () => {
            expect(parser.parseRest("r4").val).to.equal(4);
        });
    });

    describe("parseNote", () => {
        it("should return 4", () => {
            expect(parser.parseNote("d4").val).to.equal(4);
        });
        it("should return 2", () => {
            expect(parser.parseNote("d4").extra).to.equal(2);
        });

        it("should return 6", () => {
            expect(parser.parseNote("g+8.").val).to.equal(6);
        });
        it("should return 8", () => {
            expect(parser.parseNote("g+8.").extra).to.equal(8);
        });
    });

    describe("parseVoice", () => {
        it("should return 0x4", () => {
            expect(parser.parseVoice("O").val).to.equal(0x4);
        });
        it("should return 0x7f", () => {
            expect(parser.parseVoice("N").val).to.equal(0x7f);
        });
        it("should return 0x5f", () => {
            expect(parser.parseVoice("FA").val).to.equal(0x5f);
        });
    });

    describe("parseNoCommand", () => {
        it("should return null", () => {
            expect(parser.parseNoCommand("  ").val).to.equal(undefined);
        });
    });

    describe("selectParser", () => {
        it("should return parseLength", () => {
            expect(parser.selectParser("l")).to.equal(parser.parseLength);
        });
        it("should return parseTempo", () => {
            expect(parser.selectParser("t")).to.equal(parser.parseTempo);
        });
        it("should return parseOctave", () => {
            expect(parser.selectParser("o")).to.equal(parser.parseOctave);
        });
        it("should return parseOctaveUp", () => {
            expect(parser.selectParser(">")).to.equal(parser.parseOctaveUp);
        });
        it("should return parseOctaveDown", () => {
            expect(parser.selectParser("<")).to.equal(parser.parseOctaveDown);
        });
        it("should return parseVolume", () => {
            expect(parser.selectParser("v")).to.equal(parser.parseVolume);
        });
        it("should return parseVelocity", () => {
            expect(parser.selectParser("k")).to.equal(parser.parseVelocity);
        });
        it("should return parseVelocityUp", () => {
            expect(parser.selectParser(")")).to.equal(parser.parseVelocityUp);
        });
        it("should return parseVelocityDown", () => {
            expect(parser.selectParser("(")).to.equal(parser.parseVelocityDown);
        });
        it("should return parseProgram", () => {
            expect(parser.selectParser("@")).to.equal(parser.parseProgram);
        });
        it("should return parseRest", () => {
            expect(parser.selectParser("r")).to.equal(parser.parseRest);
        });
        it("should return parseVoice", () => {
            expect(parser.selectParser("B")).to.equal(parser.parseVoice);
        });
        it("should return parseNote", () => {
            expect(parser.selectParser("b")).to.equal(parser.parseNote);
        });
    });

    describe("parseToCommands", () => {
        it("should return 4", () => {
            expect(parser.parseToCommands("o4 KA b2")[0].val).to.equal(4);
        });
        it("should return 5", () => {
            expect(parser.parseToCommands("o4 KA b2")[1].val).to.equal(5);
        });
        it("should return 2", () => {
            expect(parser.parseToCommands("o4 KA b2")[2].val).to.equal(2);
        });
        it("should return 11", () => {
            expect(parser.parseToCommands("o4 KA b2 |")[2].extra).to.equal(11);
        });
        it("should return undefined", () => {
            expect(parser.parseToCommands(" =  = ")[0].val).to.equal(undefined);
            expect(parser.parseToCommands(" =  = ")[1].val).to.equal(undefined);
        });
    });


});


describe("TextFilter", () => {
    var filter : MML2Miku.TextFilter;
    beforeEach(() => {
        filter = new MML2Miku.TextFilter();
    });

    describe("commentOutBlock", () => {
        it("should return foo bar", () => {
            expect(filter.commentOutBlock("foo/* buz */bar")).to.equal("foo bar");
        });
        it("should return a c d   f", () => {
            expect(filter.commentOutBlock("a/* b */c d /* e */ f")).to.equal("a c d   f");
        });
    });

    describe("commentOutLine", () => {
        it("should return foo", () => {
            expect(filter.commentOutLine("foo; bar")).to.equal("foo ");
        });
        it("should return hoge", () => {
            expect(filter.commentOutLine("hoge; fuga\r\n")).to.equal("hoge ");
            expect(filter.commentOutLine("hoge; fuga\n")).to.equal("hoge ");
        });
    });

    describe("strip", () => {
        it("should return foo bar", () => {
            expect(filter.strip(" foo bar ")).to.equal("foo bar");
        });
    });

    describe("replaceSeparators", () => {
        it("should return foo bar", () => {
            expect(filter.replaceSeparators("foo|bar")).to.equal("foo bar");
        });
    });

    describe("removeDuplicates", () => {
        it("should return foo bar", () => {
            expect(filter.removeDuplicates("foo   bar")).to.equal("foo bar");
        });
    });

    describe("run", () => {
        it("should return foo bar", () => {
            expect(filter.run(" foo /* buz*/ ; hoge \n bar |  ")).to.equal("foo bar");
        });
    });

});


describe("MIDIData", () => {
    var midi : MIDI.MIDIData;
    beforeEach(() => {
        midi = new MIDI.MIDIData();
    });

    describe("calcDelay", () => {
        it("should return 1000", () => {
            expect(midi.calcDelay(60, 4)).to.equal(1000);
        });
        it("should return 500", () => {
            expect(midi.calcDelay(120, 4)).to.equal(500);
        });
    });

    describe("calcNote", () => {
        it("should return 42", () => {
            expect(midi.calcNote(4, 4)).to.equal(52);
        });
        it("should return 63", () => {
            expect(midi.calcNote(5, 3)).to.equal(63);
        });
    });

    describe("noteOn", () => {
        it("should return [0x90,12,64]", () => {
            expect(midi.noteOn(12, 64, 500).msg).to.eql([0x90,12,64]);
        });
        it("should return 500", () => {
            expect(midi.noteOn(12, 64, 500).delay).to.equal(500);
        });
    });

    describe("noteOff", () => {
        it("should return [0x80,12,0]", () => {
            expect(midi.noteOff(12, 1000).msg).to.eql([0x80,12,0]);
        });
        it("should return 1000", () => {
            expect(midi.noteOff(12, 1000).delay).to.equal(1000);
        });
    });

    describe("setVolume", () => {
        it("should return [0xB0,0x07,64]", () => {
            expect(midi.setVolume(64).msg).to.eql([0xB0,0x07,64]);
        });
    });

    describe("changeProgram", () => {
        it("should return [0xC0,3]", () => {
            expect(midi.changeProgram(3).msg).to.eql([0xC0,3]);
        });
    });

    describe("setVoice", () => {
        it("should return [0xf0,0x43,0x79,0x09,0x11,0x0a,0,2,0xf7]", () => {
            expect(midi.setVoice([2], 0).msg).to.eql([0xf0,0x43,0x79,0x09,0x11,0x0a,0,2,0xf7]);
        });
        it("should return [0xf0,0x43,0x79,0x09,0x11,0x0a,0,3,40,0xf7]", () => {
            expect(midi.setVoice([3,40], 0).msg).to.eql([0xf0,0x43,0x79,0x09,0x11,0x0a,0,3,40,0xf7]);
        });
    });

    describe("noteMsg", () => {
        it("should return [0x90,50,127]", () => {
            expect(midi.noteMsg(new MIDI.Note(4, null, 2), [])[0].msg).to.eql([0x90,50,127]);
        });
        it("should return [0x80,50,0]", () => {
            expect(midi.noteMsg(new MIDI.Note(4, null, 2), [])[1].msg).to.eql([0x80,50,0]);
        });
        it("should return 1000", () => {
            expect(midi.noteMsg(new MIDI.Note(4, null, 2), [])[1].delay).to.equal(1000);
        });
        it("should return 1", () => {
            expect(midi.noteMsg(new MIDI.Note(0, null, 2), []).length).to.equal(1);
        });
    });

    describe("restMsg", () => {
        it("should return [0x80, 0, 0]", () => {
            expect(midi.restMsg(new MIDI.Rest(4), [])[0].msg).to.eql([0x80, 0, 0]);
        });
        it("should return 1000", () => {
            expect(midi.restMsg(new MIDI.Rest(4), [])[0].delay).to.equal(1000);
        });
    });

    describe("voiceMsg", () => {
        it("should return [0xf0,0x43,0x79,0x09,0x11,0x0a,0,3,40,0xf7]", () => {
            expect(midi.voiceMsg([new MIDI.Voice(3),new MIDI.Voice(40)], 0).msg).to.eql([0xf0,0x43,0x79,0x09,0x11,0x0a,0,3,40,0xf7]);
        });
    });

    describe("toMessages", () => {
        it("len should return 2", () => {
            expect(midi.len).to.equal(4);
            midi.toMessages([new MIDI.Length(2)]);
            expect(midi.len).to.equal(2);
        });
        it("tempo should return 120", () => {
            expect(midi.tempo).to.equal(60);
            midi.toMessages([new MIDI.Tempo(120)]);
            expect(midi.tempo).to.equal(120);
        });
        it("octave should return 5", () => {
            expect(midi.octave).to.equal(4);
            midi.toMessages([new MIDI.Octave(5)]);
            expect(midi.octave).to.equal(5);
            midi.toMessages([new MIDI.Octave(null, 1)]);
            expect(midi.octave).to.equal(6);
            midi.toMessages([new MIDI.Octave(null, -1)]);
            expect(midi.octave).to.equal(5);
        });
        it("velocity should return 10", () => {
            expect(midi.velocity).to.equal(127);
            midi.toMessages([new MIDI.Velocity(10)]);
            expect(midi.velocity).to.equal(10);
            midi.toMessages([new MIDI.Velocity(null, 10)]);
            expect(midi.velocity).to.equal(20);
            midi.toMessages([new MIDI.Velocity(null, -10)]);
            expect(midi.velocity).to.equal(10);
        });
    });

    describe("setParameter", () => {
        it("len should return 8", () => {
            midi.setParameter(new MIDI.Length(8));
            expect(midi.len).to.equal(8);
        });
        it("tempo should return 111", () => {
            midi.setParameter(new MIDI.Tempo(111));
            expect(midi.tempo).to.equal(111);
        });
        it("octave should return 5", () => {
            midi.setParameter(new MIDI.Octave(5));
            expect(midi.octave).to.equal(5);
            midi.setParameter(new MIDI.Octave(null, -1));
            expect(midi.octave).to.equal(4);
            midi.setParameter(new MIDI.Octave(null, 1));
            expect(midi.octave).to.equal(5);
        });
        it("velocity should return 5", () => {
            midi.setParameter(new MIDI.Velocity(5));
            expect(midi.velocity).to.equal(5);
            midi.setParameter(new MIDI.Velocity(null, -1));
            expect(midi.velocity).to.equal(4);
            midi.setParameter(new MIDI.Velocity(null, 1));
            expect(midi.velocity).to.equal(5);
        });
    });


});

