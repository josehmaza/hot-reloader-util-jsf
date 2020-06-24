const Obserser = require('./observer');
const fs = require('fs-extra');  
const fsNative = require('fs');
const fsp = require('fs-promise');
const random = '-random-'

const config = {
  folderToWatch:  'D:/Repositories/watcher-hot-reload/folder-1',
  foldersToUpdate: [
    'D:/Repositories/watcher-hot-reload/folder-2',
    'D:/Repositories/watcher-hot-reload/ola/folder-random-/folder-x/folder-random-/folder-3',
  ]
}


var obserser = new Obserser();

obserser.on('file-updated', ({message: filePath}) => {
  //console.log(`Changed =>  ${filePath}`)
  config.foldersToUpdate.forEach(destinoF => {
    updateFiles(filePath, destinoF)
  
  })
 
});

var updateFiles = async (filePath, destinoF) => {
  var destinoPath = await getDestinoPathFrom(config.folderToWatch, filePath, destinoF);
  replaceFile(filePath, destinoPath)
}

var getDestinoPathFrom = async (folderToWatch, origenFilePath, destino) => {
  let destinoFinal = destino.replace(/\\/g, '/')
  origenFilePath = origenFilePath.replace(/\\/g, '/')
  if(destinoFinal.indexOf('-random-') !== -1) {
    // acceder a su carpeta padre
    let destinoN = await randomToPath(destinoFinal)
   
   // console.log(`El destino tenia random ${destinoFinal} y ahora es ${destinoN}`)
    //console.log('el origen es ', origenFilePath)
    destinoFinal= origenFilePath.replace(folderToWatch, destinoN)

  }else {
    destinoFinal = origenFilePath.replace(folderToWatch, destino)
  }

  
  return destinoFinal;
}
var randomToPath= async (path) => {
  let folderList = path.split('/')
  let parentFolder = []
  for(let folder of folderList){
    let folderActual= folder
    //console.log('Iterando ', folder) 
    if(folderActual.indexOf(random) !== -1){
      //obtener padre
      // obtener hijo
      //console.log('Buscare ', folder) 
      //console.log('padre ', parentFolder) 
      folderActual = await search(parentFolder.join('/'), folderActual.replace(random, ''))
    }
    parentFolder.push(folderActual)
  }
  return parentFolder.join('/')
}
var search = async (folder, folderToSearch) => {
  try {
    const files = await fsp.readdir(folder);
    // uncomment to see files
    /*files.forEach(function (file) {
      // Do whatever you want to do with the file
      console.log(file); 
    });*/
    let fileMatch = files.find(file => {
      return file.indexOf(folderToSearch) != -1
    })
    //console.log(`Buscando ${folderToSearch} en la carpeta ${folder} = ${fileMatch}`)
    return fileMatch;

  } catch (e) {
    console.log('error: ', e);
  }

  /*fsNative.readdir(folder, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    } 
    //listing all files using forEach
    

    files.forEach(function (file) {
        // Do whatever you want to do with the file
        console.log(file); 
    });
    let fileMatch = files.find(file => {
      return file.indexOf(folderToSearch) != -1
    })
    console.log(`Buscando ${folderToSearch} en la carpeta ${folder} = ${fileMatch}`)
    return fileMatch;
});*/
}
var replaceFile = (origen, destino) => {
  fs.copy(origen, destino, err => {  
    if (err) return console.error(err)  
    console.info(`[${new Date().toLocaleString()}] ${destino} reloaded`)  
  });  
}

obserser.watchFile(config.folderToWatch);