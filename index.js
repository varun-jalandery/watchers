const fs = require('fs');
const { execFile } = require('child_process');

const BASE_DIR = '/Users/varunjalandery/sites/mycode/liberty-cms/';

const SUB_DIRS = [
    'src',
    'bin',
    'lib'
];

let lastChangeTime = null;
let numberOfRsyncs = 0;

const addWatcher = (filename) => {
    fs.watch(
        `${BASE_DIR}${filename}`,
        { encoding: 'buffer', recursive: true },
        (eventType, filename) => {
            if (filename) {
                console.log('Changed : ', filename);
                updateLastChangedTime();
            }
        }
    );
}

const updateLastChangedTime = () => {
    lastChangeTime = new Date().getTime();
}

const rsyncc = () => {
    numberOfRsyncs++;
    execFile('./rsyncc.sh', (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
    });
}

SUB_DIRS.forEach(dir => addWatcher(dir));

setInterval(() => {
	if (lastChangeTime && new Date().getTime() - lastChangeTime > 500) {
	    lastChangeTime = null;
	    rsyncc();
	}
}, 500);

setInterval(() => {
    if (numberOfRsyncs > 5) {
        console.error('Unstability Detected, too many rsyncs happened.');
        process.exit(1);
    }
    console.log('unstab', numberOfRsyncs);
    numberOfRsyncs = 0;
}, 5000);