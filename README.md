# mml2miku

MML (Music Macro Language) interpreter written in JavaScript.
This is desined for nsx-39.

## Setup

1. Connect your midi output device with your computer
2. Open Google Chrome web browser
3. Input the following text in address bar of the browser  
chrome://flags/#enable-web-midi
4. Enable Web MIDI API

## Demo

To play demo, perform the following steps after setup.

[http://algas.github.io/mml2miku](http://algas.github.io/mml2miku)

1. Access [demo](http://algas.github.io/mml2miku) page with your web browser
2. Select your midi output device.
3. Write mml in the textarea
4. Click "play" and listen to your music

## Notice

Current version supports  
* only one channel (ch 1)
* only whitespace splitted grammer
* no repeatable brackets

Under development :)
Send me PR or issues!

## MML Reference

See [mml reference](https://github.com/algas/mml2miku/blob/master/docs/mml.md)

## Test

Run the following commands to test

```
npm install
grunt build
grunt test
```

## License

The MIT License (MIT)

## Authors

Masahiro Yamauchi
