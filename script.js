function readFile() {
	let brutFile = document.getElementById('brutFile').files[0];

	let fileContent = "";

	readFileIntoMemory(brutFile, function(fileInfo) {
		console.log("file type: ", fileInfo.type);
	    // console.info("Read file " + fileInfo.name + " of size " + fileInfo.size);
	    fileContent = new TextDecoder().decode(fileInfo.content);

	    reformatToCSV(fileContent);
	});
}

function reformatToCSV(fileContent) {
	console.log(fileContent);
	fileContent = replaceAll(fileContent, '\n                             ', '');
	fileContent = fileContent.split('\n');

	let dictAttributsVal = {};
	let numUsers = 0;

	for(let elem in fileContent) {
		if(fileContent[elem].trim() == '') {
			numUsers += 1;
		} else {
			let attribute = fileContent[elem].split(':')[0].trim();
			attribute = replaceAll(attribute, ',', '/');
			attribute = replaceAll(attribute, ';', '/');
			let value = fileContent[elem].replace(fileContent[elem].split(':')[0]+':', '').trim();
			value = replaceAll(value, ',', '/');
			value = replaceAll(value, ';', '/');
			// console.log((attribute+' : '+value));

			if(attribute in dictAttributsVal) {
				dictAttributsVal[attribute][numUsers] = value;
			} else {
				dictAttributsVal[attribute] = {};
				dictAttributsVal[attribute][numUsers] = value;
			}
		}
	}
	// console.log(dictAttributsVal);
	csvBakerFromDict(numUsers, dictAttributsVal);
}

function csvBakerFromDict(numUsers, dictAttributsVal) {
	let result = "";
	let attributs = "";
	for(let elem in dictAttributsVal) {
		attributs += elem + ',';
	}
	result = attributs.slice(0, -1) + ';\n';

	for(let i = 0; i < numUsers; i++) {
		for(let elem in dictAttributsVal) {
			if(i in dictAttributsVal[elem]) {
				result += dictAttributsVal[elem][i] + ',';
			} else {
				result += ',';
			}
		}
		result += ';\n';
	}

	// console.log(result);
	console.log('Number of users treated: ' + numUsers);
	download('exported_users_reformated.csv', result);
}

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function escapeRegExp(string) {
  return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function replaceAll(str, find, replace) {
	return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function readFileIntoMemory (file, callback) {
    var reader = new FileReader();
    reader.onload = function () {
        callback({
            name: file.name,
            size: file.size,
            type: file.type,
            content: new Uint8Array(new Uint16Array(this.result)) // change to new Uint8Array(this.result) --> for UTF-8 files
         });
    };
    reader.readAsArrayBuffer(file);
}