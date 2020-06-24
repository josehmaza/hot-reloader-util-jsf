const chokidar = require('chokidar');
const EventEmitter = require('events').EventEmitter;

class Observer extends EventEmitter {
  constructor() {
    super();
  }

  watchFile(targetFolder) {
    try {
      console.log(
        `[${new Date().toLocaleString()}] Watching for file changes on: ${targetFolder}`
      );

      var watcher = chokidar.watch(targetFolder, { persistent: true });

      watcher.on('change', async filePath => {
  
        this.emit('file-updated', { message: filePath });
      });
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Observer;