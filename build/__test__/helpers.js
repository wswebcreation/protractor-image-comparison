'use strict';
const fs = require('fs');
module.exports = helpers();
function helpers() {
    return {
        fileExistSync: fileExistSync
    };
    function fileExistSync(fp) {
        try {
            fs.accessSync(fp);
            return true;
        }
        catch (err) {
            return false;
        }
    }
}
;
//# sourceMappingURL=helpers.js.map