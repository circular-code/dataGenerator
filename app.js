/** handle data **/

var data  = localStorage.getItem('dataGenerator') || {
    person: {
        address: {
            firstName: [],
            lastName: [],
            street: [],
            streetNumber: [],
            zip: [],
        },
        contact: {
            phone: [],
            mobile: [],
            email: [],
        },
        banking: {
            creditNumber: [],
            bic: [],
            iban: []
        }
    }
};

function pushValue (value, position) {
    if (!value && value !== 0)
        throw 'Error: Invalid position given to push into data.';

    if (!position instanceof Array || position.length < 1)
        throw 'Error: Invalid position given to push into data.';

    var evalString = 'data';
    for (var i = 0; i < position.length; i++) {
        evalString += '["' + position[i] + '"]';
    }

    evalString += 'push(' + value + ')';

    eval(evalString);
}

function randomNumBetween (max, min) {
    if (typeof max === 'undefined'){
        console.log('max undefined');
        return false;
    }
    if (typeof min === 'undefined'){
        min = 0;
    }
    return ~(Math.random()*(max-min)+min);
}

function generateData (count) {
    var i,
    status = ['New', 'Canceled', 'Processing', 'Rejected', 'Approved', 'Work', 'Ready to Print', 'Printing', 'Printed', 'Diecut', 'Error'],
    bereich = ['Std', 'RP', 'VK', 'EK', 'WMF', 'EST', 'DTI', 'DPT', 'DTS', 'CPC', 'MSI'],
    batchName = ['In_Plo_ha', 'In_Hi', 'In_Da_te', 'In_Duk_nam','In_Zu','In_Ter_set','In_Dev_tx','In_In_out','In_In','In_In_in','In_Dx_tx'],
    lack = ['Matt', 'Gloss'],
    items = [],
    startDate = Date.parse('1/1/1975'),
    endDate = Date.parse('1/1/1992');

    for (i = 0; i < count; i++) {
        var date = new Date(utils.randomNumBetween(endDate, startDate));
        date.setHours(12);
        var item = {
            id: i + 1,
            Status: status[utils.randomNumBetween(status.length)],
            Bereich: bereich[utils.randomNumBetween(bereich.length)],
            BatchId: utils.randomNumBetween(3000,2000),
            BatchName: batchName[utils.randomNumBetween(batchName.length)],
            AnzahlJobs: utils.randomNumBetween(100),
            Auflage: utils.randomNumBetween(300),
            AnzahlBogen: utils.randomNumBetween(5000),
            Substrat: 'Ensocoat-' +utils.randomNumBetween(3000),
            Lack: lack[utils.randomNumBetween(lack.length)] + ' ' + utils.randomNumBetween(400000,200000),
            Erstelldatum: moment(date).format('L')
        };
        items.push(item);
    }
    return items;
}