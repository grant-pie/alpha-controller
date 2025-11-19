class MIDIRouter {
    constructor(midiInterface, hardwareInterface, controller, routes) {
        this.midi_interface = midiInterface;
        this.hardware_interface = hardwareInterface;
        this.controller = controller
        this.routes = undefined;
        this.state = this.initiateListen();
    };

    initiateListen(){
        const midiRouter = this;
        this.midi_interface.listen(function(message){
            console.log(message);
            const statusByte = message.data[0];
            const dataByte1 = message.data[1];
            const dataByte2 = message.data[2]

            //determine if btn was pressed or control change received
            //note received
            if (statusByte === 144) {
                midiRouter.handleNoteReceived(dataByte1, dataByte2);
            }

            //cc received
            if (statusByte === 176) {
                midiRouter.handleCCReceived(dataByte1, dataByte2);
            }

            //ACK received
            if(message.data.length > 3 && message.data.length < 8) {
                /*
                console.log({
                    name: 'ACK Received',
                    value: message
                });
                */
            }

            //sysex received
            if(message.data.length > 7) {
                midiRouter.handleSysExMessageReceived(message.data);
            }
        });

        return 'listening';

    }

    createRoutes(routes){
        const noteRoutes = routes.notes;
        const ccRoutes = routes.cc;

        //note routes
        let notes;
        let callBack;
        let note;
        for(const noteRouteKey in noteRoutes) {

            notes = noteRoutes[noteRouteKey].notes;
            callBack =  noteRoutes[noteRouteKey].callBack;

            //btn group routes
            for(let i = 0; i <= noteRoutes[noteRouteKey].notes.length -1; i++) {
                note = notes[i];

                this.addEventListener('noteReceived-' + note, callBack);
            }
        }

        //cc routes
        let ids;
        let id;
        for(const ccRouteKey in ccRoutes) {

            ids = ccRoutes[ccRouteKey].ids;
            callBack =  ccRoutes[ccRouteKey].callBack;

            //btn group routes
            for(let i = 0; i <= ccRoutes[ccRouteKey].ids.length -1; i++) {
                id = ids[i];

                this.addEventListener('ccReceived-' + id, callBack);
            }
        }



    }

    handleNoteReceived(noteReceived, velocityReceived){
        console.log({
            'note_received' : {
                'note': noteReceived,
                'velocityReceived': velocityReceived
            }
        });
        const midiRouter = this;
        const event = new CustomEvent('noteReceived-' + noteReceived, {
            detail:
                {
                    note: noteReceived,
                    velocity: velocityReceived,
                    midiRouter: midiRouter
                }

        });

        //dispatch the event.
        document.dispatchEvent(event);
    }

    handleCCReceived(ccId, value){
        console.log({
            'cc_received' : {
                'ccId': ccId,
                'value': value
            }
        });
        const midiRouter = this;
        const event = new CustomEvent('ccReceived-' + ccId, {
            detail:
                {
                    id: ccId,
                    value: value,
                    midiRouter: midiRouter
                }

        });

        //dispatch the event.
        document.dispatchEvent(event);
    }

    handleSysExMessageReceived(data){
        //append noteReceived and velocity received to event
        const midiRouter = this;
        const event = new CustomEvent('sysExMessageReceived', {
        detail:{
            data:data,
            midiRouter: midiRouter
            }
        });

        //dispatch the event.
        document.dispatchEvent(event);
    }

    //this should maybe be in hardware interface controller, pass object with data, append data to event
    addEventListener(eventName, callBack){
        document.addEventListener(eventName, callBack);
    }

    removeEventListener(eventName, callBack){
        document.removeEventListener(eventName, callBack);
    }

}
export {MIDIRouter};

/*

const midiRouter = new MidiRouter(
    {
        hardware_interface : new OhmRGB(),
        midi_interface: new MidiInterface(),

        routes: {
            noteOn: {note, callback}
            noteOff: {note, callback}
        }
    }
);
*/



