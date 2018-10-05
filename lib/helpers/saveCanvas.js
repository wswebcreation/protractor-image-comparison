export async function saveCanvas(buffer, regtangles, filename, folders) {
  // img.src = `data:image/png;base64,${buffer}`;

  // at the top of the test spec:
  var fs = require('fs');

  // abstract writing screen shot to a file
  function writeScreenShot(data, filename) {
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
  }

  // within a test:
  writeScreenShot(buffer, 'exception.png');

}
