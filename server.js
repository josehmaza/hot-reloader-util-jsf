const Obserser = require('./observer');
const fs = require('fs-extra');  
const fsNative = require('fs');
const random = '-random-'
var obserser = new Obserser();

const folderToWatch = 'D:/Repositories/watcher-hot-reload/folder-1';
const destinoFolder = [
  //'D:/Repositories/watcher-hot-reload/folder-2',
  'D:/Repositories/watcher-hot-reload/ola/folder-random-/folder-x/folder-random-/folder-3',
];
obserser.on('file-updated', ({message: filePath}) => {
  //console.log(`Changed =>  ${filePath}`)
  destinoFolder.forEach(destinoF => {
    var destinoPath = getDestinoPathFrom(folderToWatch, filePath, destinoF);
    console.log('El destino es ', destinoPath);
    //replaceFile(filePath, destinoPath)
  })
  
 // replaceFile(filePath, )
// Async with callbacks:  
  /*fs.copy('texto.txt', 'texto-image.txt', err => {  
    if (err) return console.error(err)  
    console.log('success!')  
  });  */
});

var getDestinoPathFrom = (folderToWatch, origenFilePath, destino) => {
  //let nuevoDestino = origenFilePath.replace(/\\/g, '/')//.replace(folderToWatch, destino)
  let destinoFinal = destino.replace(/\\/g, '/')
  if(destinoFinal.indexOf('-random-') !== -1) {
    // acceder a su carpeta padre
    let destinoN = randomToPath(destinoFinal)
    destinoFinal.replace(folderToWatch, destinoN)

  }else {
    destinoFinal.replace(folderToWatch, destino)
  }

  
  return destinoFinal;
}
var randomToPath= (path) => {
  let folderList = path.split('/')
  let parentFolder = []
  for(let folder of folderList){
    let folderActual= folder
    //console.log('Iterando ', folder) 
    if(folderActual.indexOf(random) !== -1){
      //obtener padre
      // obtener hijo
      console.log('Buscare ', folder) 
      console.log('padre ', parentFolder) 
      folderActual = search(parentFolder.join('/'), folderActual.replace(random, ''))
    }
    parentFolder.push(folderActual)
  }
  return parentFolder.join('/')
}
var search = async (folder, folderToSearch) => {
  fsNative.readdir(folder, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    /*try {
      const names = await fsp.readdir('path/to/dir');
      console.log(names[0]);
    } catch (e) {
      console.log('error: ', e);
    }*/

    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
    });
    let fileMatch = files.find(file => {
      return file.indexOf(folderToSearch) != -1
    })
    console.log(`Buscando ${folderToSearch} en la carpeta ${folder} = ${fileMatch}`)
    return fileMatch;
});
}
var replaceFile = (origen, destino) => {
  fs.copy(origen, destino, err => {  
    if (err) return console.error(err)  
    console.log('success reload!')  
  });  
}

obserser.watchFile(folderToWatch);