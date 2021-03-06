const {
    ipcRenderer
} = require('electron');
const elePrompt = require('electron-prompt');
const Code = require('../assets/js/coder');
const storageManager = require('../common-process/storageManager');

window.Blockly.prompt = function (msg, defaultValue, callback) {
    let renameVar = function (name) {
        return name;
    };

    elePrompt({
        type: 'input',
        width: 400,
        height: 200,
        title: msg,
        label: '變數名稱:',
    }).then((name) => {
        callback(renameVar(name));
    });
};

window.onbeforeunload = function (e) {
    storageManager.setBlocklyScript(Code);
    storageManager.saveBlockly(Code);
};

ipcRenderer.on('saved-script', (event, response) => {
    if (response.err) console.error(response.err);
});

ipcRenderer.on('export-xml', (event, response) => {
    if (response.err) console.error(response.err);
});

ipcRenderer.on('import-xml', (event, response) => {
    if (response.err) {
        console.error(response.err);
        return;
    }

    Code.restoreByXml(response.data);
});

document.addEventListener('DOMContentLoaded', () => {
    let btnSaveFile = document.getElementById('btnSaveFile');
    btnSaveFile.addEventListener('click', (event) => {
        let script = Code.getGeneratedScript();
        ipcRenderer.send('script-save-dialog', script);
    });

    let btnBackHome = document.getElementById('btnBackHome');
    btnBackHome.addEventListener('click', (event) => {
        window.location.assign('../index.html');
    });

    let btnSimulate = document.getElementById('btnSimulate');
    btnSimulate.addEventListener('click', (event) => {
        window.location.assign('../simulation/index.html');
    });

    let btnExportXml = document.getElementById('btnExportXml');
    btnExportXml.addEventListener('click', (event) => {
        let xml = Code.generateXml();
        ipcRenderer.send('xml-export-dialog', xml);
    });
    let btnImportXml = document.getElementById('btnImportXml');
    btnImportXml.addEventListener('click', (event) => {
        ipcRenderer.send('xml-import-dialog');
    });

    storageManager.restoreBlockly(Code);
});