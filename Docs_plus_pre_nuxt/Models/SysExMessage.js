//todo read more about sysex structure as well as structure of other devices eg. novation
class SysExMessage {
    constructor(manufacturerId, productNumber, command, data, append){
        if (!(this instanceof SysExMessage)) {
            return new SysExMessage(manufacturerId, productNumber, command);
        }


       this.manufacturer_id = manufacturerId;
       this.product_number = productNumber;
       this.command = command;
       this.data = data;
       this.append = append;

    }

    //computed
    get sysExMessage() {
        return this.manufacturer_id.concat(this.product_number, this.command, this.data, this.append);
    }
}