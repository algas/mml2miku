{
    var m = null;
    var outputIndex = 0;
    var outputDevice = null;
    var outputDevices = null;
    var outputMenu = null;
    var output = null;
    var timerId = null;

    var run = function (){
        navigator.requestMIDIAccess( { sysex: true } ).then( success, failure );
    }

    var success = function (midiAccess){
        // alert("success");
        m = midiAccess;
        outputDevices = m.outputs();
        setOutputDevice();
    }

    var failure = function (error){
        alert("Failed to access MIDI devices.");
        console.log(error);
    }

    var selectOutputDevice = function (item) {
        outputIndex = item.options[item.selectedIndex].value - 1;
        if(outputIndex == -1) outputIndex = 0;
        output = outputDevices[outputIndex];
    }

    var setOutputDevice = function () {
        if(m != null){
            if(outputDevices.length > 0){
                for(var i = 0; i < outputDevices.length; i++){
                    outputMenu.options[i + 1] = new Option(outputDevices[i].name, i + 1);
                }
            }
        }
    }

    var setOutputMenu = function (menu){
        outputMenu = menu;
    }

    var sendMessage = function(msg) {
        if (outputDevices == null) {
            alert("No output MIDI devices.");
        } else {
            if (output == null) output = outputDevices[outputIndex];
            output.send(msg);
        }
    }

    function sleep(time) {
        var d1 = new Date().getTime();
        var d2 = new Date().getTime();
        while (d2 < d1 + time) {
            d2 = new Date().getTime();
        }
        return;
    }

    var playMML = function (mmlText) {
        // console.log(mmlText);
        var i = 0;
        var mmlData = parser.parseMML(mmlText);
        var mml = null;
        timerId=setInterval( function() {
            if (i < mmlData.length) {
                mml = mmlData[i];
                for (var j = 0; j < mml.length; j++) {
                    sleep(mml[j].delay);
                    this.sendMessage(mml[j].msg);
                }
                i++;
            }
        }, 0);
    }

    var stopMML = function () {
        output.send([0xb0, 0x78, 0x00], 0);
        clearInterval(timerId);
    }

}