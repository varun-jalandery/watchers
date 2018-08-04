require('dotenv').config();
const fs = require('fs');
const { execFile } = require('child_process');

let lastChangeTime = null;
let numberOfRsyncs = 0;

const addWatcher = (filename) => {
    fs.watch(
        `${process.env.BASE_DIR}${filename}`,
        { encoding: 'utf8', recursive: true },
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

process.env.SUB_DIRS.split(';').forEach(dir => addWatcher(dir));

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
    numberOfRsyncs = 0;
}, 5000);