/** handle data **/

var data  = JSON.parse(localStorage.getItem('dataGenerator')) || {
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

// initialize
(function(){
    var select1 = document.getElementById('depth1')
    for (var key_0 in data) {
        var option_0 = document.createElement('option');
        option_0.value = option_0.textContent = key_0;

        select1.appendChild(option_0);
    }

    var select2 = document.getElementById('depth2')
    for (var key_1 in data) {
        for (var key_2 in data[key_1]) {
            var option_1 = document.createElement('option');
            option_1.value = option_1.textContent = key_2;

            select2.appendChild(option_1);
        }
    }

    var select3 = document.getElementById('depth3')
    for (var key_3 in data) {
        for (var key_4 in data[key_3]) {
            for (var key_5 in data[key_3][key_4]) {
                var option_2 = document.createElement('option');
                option_2.value = option_2.textContent = key_5;

                select3.appendChild(option_2);
            }
        }
    }

    //TODO: limit values of further selects depending on input selection, also make selects disabled so they have to be selected in a row
    //TODO: allow newentry for select(), objektstruktur wird erweitert wenn eintrag nicht vorhanden

    document.getElementById('value').addEventListener('keyup', function(e) {
        if (e.keyCode === 13) {
            pushValue(e.target.value, [select1.value, select2.value, select3.value]);
        }
    });
}());

function pushValue (values, positions) {
    if (!values && values !== 0)
        throw 'Error: Invalid value given to push into data.';

    if (!positions instanceof Array || positions.length < 1)
        throw 'Error: Invalid position given to push into data.';

    var delimiter = document.getElementById('delimiter').value || ',';
    values = values.split(delimiter);

    // trim values
    for (var k = 0; k < values.length; k++) {
        values[k] = values[k].trim();
    }

    var dataLinkedCopy = data;

    // iterate over data
    for (var i = 0; i < positions.length; i++) {

        // keep a copy of the parent, in order to make enable reassigning dataLinkedCopy with an Array or Object (would loose reference otherwise)
        var dataLinkedCopyParent = dataLinkedCopy;

        // override dataLinkedCopy each time with new deeper linked copy, keeping the reference so values actualy change in data, but data will not be reassigned
        dataLinkedCopy = dataLinkedCopy[positions[i]];

        // if we end here and have an existing array
        if (positions.length === i+1 && dataLinkedCopy instanceof Array) {

            // iterate over values
            for (var j = 0; j < values.length; j++) {
                if (dataLinkedCopy.indexOf(values[j]) === -1)
                    dataLinkedCopy.push(values[j]);
            }
        }
        // if we end here and dont have an existing array
        else if (positions.length === i+1 && dataLinkedCopy) {
            dataLinkedCopyParent[positions[i]] = values;
        }
        // if we dont end here and dont have an existing object
        else if (positions.length > i+1 && dataLinkedCopy && positions[i+1] && !dataLinkedCopy[positions[i+1]])
            dataLinkedCopyParent[positions[i]] = {};
    }

    localStorage.setItem('dataGenerator', JSON.stringify(data));
    showValues();
}

function showValues() {
    document.querySelector('pre').textContent = JSON.stringify(data, null, 3);
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