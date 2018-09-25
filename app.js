/** ------- handle base data ------- **/

var data  = {
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
    },
    checkboxId = 0;

//** ------- initialize ------- **/

(function(){

    // merge localStorage Data with basic data
    var localdata = JSON.parse(localStorage.getItem('dataGenerator'));

    if (localdata && typeofObj(localdata) === 'object') {
        data = merge(data, localdata);
    }

    //TODO: überarbeiten
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

    /*region [rgba(0,100,0,0.1)]

    ----- ADD DATA-----

    endregion*/

    var input1 = document.getElementById('depth-input1'),
        input2 = document.getElementById('depth-input2'),
        input3 = document.getElementById('depth-input3'),
        rowCount = document.getElementById('rowCount'),
        addRowsButton = document.getElementById('addRowsButton'),
        copyRowsButton = document.getElementById('copyRowsButton'),
        deleteRowsButton = document.getElementById('deleteRowsButton');

    select1.addEventListener('change', function() {
        input1.value = select1.value;
    });
    select2.addEventListener('change', function() {
        input2.value = select2.value;
    });
    select3.addEventListener('change', function() {
        input3.value = select3.value;
    });

    document.getElementById('value').addEventListener('keyup', function(e) {
        if (e.keyCode === 13)
            pushValue(e.target.value, [input1.value, input2.value, input3.value]);
    });

    document.getElementById('depthWrapper').addEventListener('keyup', function(e) {
        if (e.target.tagName === 'INPUT')
            e.target.previousElementSibling.value = '';
    });


    /*region [rgba(0,0,100,0.1)]

    ----- SELECT DATA-----

    endregion*/

    //** --- buttons for input rows --- **/

    addRowsButton.addEventListener('click', function() {
        appendRows(+rowCount.value);
    });
    copyRowsButton.addEventListener('click', function() {
        copyRows();
    });
    deleteRowsButton.addEventListener('click', function() {
        deleteRows();
    });

    document.getElementById('changeAllAmount').addEventListener('keyup', function(e) {
        if (e.keyCode === 13)
           changeAmountOfAllRows(+e.target.value);
    });

    var dragTargetWrapper = document.getElementById('selectDataBody');

    //** --- select input rows --- **/

    dragTargetWrapper.addEventListener('click', function(e) {
        if (~e.target.id.indexOf('box')) {
            if (~e.target.parentElement.parentElement.className.indexOf('selected'))
                e.target.parentElement.parentElement.className = 'selectData-input-group';
            else
                e.target.parentElement.parentElement.className += ' selected';
        }
    });

    //** --- drag input rows --- **/

    // TODO: ordentlich machen
    var dragItem;

    dragTargetWrapper.addEventListener('dragstart', function(e) {
        e.target.style.opacity = 0.3;
        dragItem = e.target.className === 'grip' ? e.target.parentElement : e.target.parentElement.parentElement;
    });
    dragTargetWrapper.addEventListener('dragover', function(e) {
        if (e.preventDefault) {
            e.preventDefault();
        }

        dragTargetWrapper.className = 'dragging-active';

        var inputGroups = [].slice.call(dragTargetWrapper.querySelectorAll('.selectData-input-group'),0);
        inputGroups.forEach(function(group) {
            if (group !== e.target) {
                group.style.border = "2px solid white";
            }
        });
        if (e.target.className === "selectData-input-group" || e.target.className === "selectData-input-group selected")
            e.target.style.border = "2px dashed #0dafc2";
    });
    dragTargetWrapper.addEventListener('drop', function(e) {
        e.target.parentElement.insertBefore(dragItem, e.target);
        var inputGroups = [].slice.call(dragTargetWrapper.querySelectorAll('.selectData-input-group'),0);
        inputGroups.forEach(function(group) {
                group.style.border = "2px solid white";
        });
    });
    dragTargetWrapper.addEventListener('dragend', function(e) {
        // var inputGroups = [].slice.call(dragTargetWrapper.querySelectorAll('.selectData-input-group'),0);
        // inputGroups.forEach(function(group) {
        //     if (group !== e.target) {
        //         group.style.border = "2px solid white";
        //     }
        // });
        e.target.style.opacity = 1;
        dragTargetWrapper.className = '';
    });

    //TODO: inputvalidierung ( alle positionen müssen der reihe nach ausgefüllt sein) --> warnung key X existiert nicht, er wird neu angelegt wenn sie bestätigen

    /*region [rgba(100,0,100,0.1)]

    ----- Return DATA-----

    endregion*/


    select1.addEventListener('change', function() {
        input1.value = select1.value;
    });
    select2.addEventListener('change', function() {
        input2.value = select2.value;
    });
    select3.addEventListener('change', function() {
        input3.value = select3.value;
    });

    document.getElementById('generateAll').addEventListener('click', function() {
        generateHelper();
    });

    document.getElementById('generateSelected').addEventListener('click', function() {
        generateHelper(true);
    });

    showValues();
    appendRows(3);
}());

function pushValue (values, positions) {
    if (!values && values !== 0)
        throw 'Error: Invalid value given to push into data.';

    if (!positions instanceof Array || positions.length < 1)
        throw 'Error: Invalid position given to push into data.';

    var delimiter = document.getElementById('delimiter').value || ',';
    values = values.split(delimiter);

    // sanitize input values
    values = sanitizeInputArray(values);

    // sanitize and validate positions
    positions = sanitizePositionsArray(positions);

    //TODO: validatePositionsArray(positions);

    var dataLinkedCopy = data;

    if (positions.length === 0)
        alert('Sie müssen einen Ort definieren, an welchem die Werte eingefügt werden sollen.');

    // iterate over data
    for (var i = 0; i < positions.length; i++) {

        // keep a copy of the parent, in order to make enable reassigning dataLinkedCopy with an Array or Object (would loose reference otherwise)
        var dataLinkedCopyParent = dataLinkedCopy;

        if (positions.length === i+1 && dataLinkedCopy[positions[i]] && !(dataLinkedCopy[positions[i]] instanceof Array))
            // TODO: besser machen
            alert('Objekt- oder Arrayeintrag kann nicht als Objekt oder Array gespeichert werden, da bereits ein Objekt oder Array an dieser Stelle existiert');

        // override dataLinkedCopy each time with new deeper linked copy, keeping the reference so values actualy change in data, but data will not be reassigned
        if (dataLinkedCopy[positions[i]] instanceof Object && !(dataLinkedCopy[positions[i]] instanceof Array)) {
            dataLinkedCopy = dataLinkedCopy[positions[i]];
            continue;
        }

        // if we end here and have an existing array
        if (positions.length === i+1 && dataLinkedCopy[positions[i]] instanceof Array) {

            // iterate over values
            for (var j = 0; j < values.length; j++) {
                if (dataLinkedCopy[positions[i]].indexOf(values[j]) === -1)
                dataLinkedCopy[positions[i]].push(values[j]);
            }
        }

        // if we end here and dont have an existing array
        else if (positions.length === i+1 && !dataLinkedCopy[positions[i]])
            dataLinkedCopyParent[positions[i]] = values;

        // if we dont end here and dont have an existing object
        else if (positions.length > i+1 && dataLinkedCopy && positions[i+1] && !dataLinkedCopy[positions[i+1]]) {
            dataLinkedCopyParent[positions[i]] = {};
            i--;
        }
    }

    localStorage.setItem('dataGenerator', JSON.stringify(data));
    showValues();
}

function showValues() {
    document.getElementById('showAllData').textContent = JSON.stringify(data, null, 3);
    document.getElementById('returnData').textContent = JSON.stringify(data, null, 3);
}

function sanitizeInputArray (array) {
    for (var k = array.length -1; k + 1; k--) {
        array[k] = array[k].trim();

        for (var l = array.length - 1; l + 1; l--) {
            if (array[l] === array[k] && k !== l) {
                array.splice(k,1);
            }
        }
    }
    return array;
}

function sanitizePositionsArray (array) {
    for (var k = array.length -1; k + 1; k--) {
        if (array[k].trim() === '')
            array.splice(k,1);
    }
    return array;
}

function generateInputGroup () {

    var elem = document.createElement('div'),
        inputGroup = ` <div class="selectData-input-group">
                            <div class="pretty p-default"><input type="checkbox" id="box${checkboxId}"><div class="state">
                            <label></label>
                        </div></div>
                            <div class="grip" id="grip${checkboxId}"><i class="fas fa-grip-vertical"></i></div>
                            <input placeholder="name" class="name-input" type="text" id="key${checkboxId}">
                            <input placeholder="name" class="value-input" type="text" id="value${checkboxId}">
                            <input placeholder="50" class="amount-input" type="number" id="amount${checkboxId}">
                        </div>`;

    elem.innerHTML = inputGroup;
    checkboxId++;

    return elem.firstElementChild;
}

function appendRows (amount) {

    // NaN check
    if (amount !== amount || typeof amount !== 'number' || amount <= 0)
        return;

    while (amount) {
        document.getElementById('selectDataBody').appendChild(generateInputGroup());
        amount--;
    }
}

function deleteRows () {
    var inputs = document.querySelectorAll('input:checked');

    for (var i = 0; i < inputs.length; i++)
        if (inputs[i].checked === true)
            inputs[i].parentElement.parentElement.remove();
}

function copyRows () {
    var selectBody = document.getElementById('selectDataBody'),
        inputs = document.querySelectorAll('input:checked');

    for (var i = 0; i < inputs.length; i++)
        if (inputs[i].checked === true)
            selectBody.appendChild(inputs[i].parentElement.parentElement.cloneNode(true));
}

function changeAmountOfAllRows (amount) {
    var inputs = document.querySelectorAll('.amount-input');

    for (var i = 0; i < inputs.length; i++)
        inputs[i].value = amount;
}

function generate (rows) {

    var data = {};

    for (var i = 0; i < rows.length; i++) {

        var name = rows[i].children[2].value,
        values = rows[i].children[3].value,
        amount = +rows[i].children[4].value;

        // if any of these is not met, skip
        if (!~values.indexOf('[') ||
            !~values.indexOf(']') ||
            values.length < 3 ||
            name.trim().length === 0 ||
            amount !== amount ||
            amount < 0 ||
            !amount)
            continue;

        data[name] = generateRowData(amount, values);
    }

    showResultData(data);
}

function showResultData (data) {
    document.getElementById('returnData').textContent = JSON.stringify(data, null, 3);
}

function randomNumBetween (max, min) {
    if (typeof max === 'undefined'){
        console.log('max undefined');
        return false;
    }
    if (typeof min === 'undefined'){
        min = 0;
    }
    return (Math.random()*(max-min)+min) | 0;
}

function sanitizeGenerationValues(values) {
    values = values.trim();
    values = values.substring(1, values.length-1);
    return values.split(',');
}

function generateRowData (amount, values) {

    values = sanitizeGenerationValues(values);

    if (!values instanceof Array)
        return;

    var rowData = [];
    while (amount--)
        rowData.push(values[randomNumBetween(values.length)]);

    return rowData;
}

function generateHelper (selected) {
    var rows;
    if (selected)
        rows = document.querySelectorAll('.selectData-input-group.selected');
    else
        rows = document.querySelectorAll('.selectData-input-group');

        generate(rows);
}

function typeofObj (obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}

function merge (obj1, obj2) {

    var returnObj = {};

	for (var key in obj1) {

		if (obj2.hasOwnProperty(key)) {

			if (obj1[key] instanceof Array) {

                returnObj[key] = obj1[key];

				for (var i = 0; i < obj2[key].length; i++) {
					if (returnObj[key].indexOf(obj2[key][i]) <= -1)
                        returnObj[key].push(obj2[key][i]);
				}
			}
			else
                returnObj[key] = merge(obj1[key],obj2[key]);
        }
		else
            returnObj[key] = obj1[key];
	}
	for (var key2 in obj2) {
		if (obj2.hasOwnProperty(key2) && !returnObj.hasOwnProperty(key2))
            returnObj[key2] = obj2[key2];
	}
	return returnObj;
}

// TODO:
// neue Spalte (key) anlegen --> validieren gültiger key/variablenName --> zu Objektstruktur hinzufügen
// Spalten und Inhalte und Anzahl auswählen die exportiert werden sollen
// output:json, xml, csv, raw (z.B. bei nur einer Spalte)
