# mml2miku

MML (Music Macro Language) interpreter written in JavaScript.
This is desined for nsx-39 "Miku keyboard".

## Setup

1. Connect your midi output device with your computer.
2. Open Google Chrome web browser.
3. Input the following text in address bar of the browser.  
[chrome://flags/#enable-web-midi](chrome://flags/#enable-web-midi)
4. Enable Web MIDI API.

## Demo

After setup done, you can play mml music.

[http://algas.github.io/mml2miku](http://algas.github.io/mml2miku)

1. Access [demo](http://algas.github.io/mml2miku) page with your web browser.
2. Click OK for "?? requests full controll of midi devices."
3. Select your midi output device.
4. Write mml in the textarea.
5. Click "play" and listen to your music!

## Notice

Current version supports  
* only one channel (ch 0)
* only whitespace splitted grammer
* no comment characters
* no line breaks
* no repeatable brackets

Under development :)
Send me PR or issues!

## MML Reference

See [mml reference](https://github.com/algas/mml2miku/docs/mml.md)

## Test

JavaScript test included.
mocha, chai and phantom (mocha-phantom).

## License

The MIT License (MIT)

## Authors

Masahiro Yamauchi
