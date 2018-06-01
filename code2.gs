/* The script is deployed as a web app and renders the form */
function adoGet(e) {
  return HtmlService
    .createHtmlOutputFromFile('form.html')
    .setTitle("Google File Upload by CTRLQ.org");
}

function uploadFileToGoogleDrive(data, file, name, email) {
  setLogger();
  try {

    var dropbox = "My Dropbox";
    var folder, folders = DriveApp.getFoldersByName(dropbox);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }

    Logger.log("folder:" + folder.getId());
    
    var contentType = data.substring(5,data.indexOf(';')),
        bytes = Utilities.base64Decode(data.substr(data.indexOf('base64,')+7)),
        blob = Utilities.newBlob(bytes, contentType, file);
        
    Logger.log("contentype:"+contentType);
    Logger.log("bytes:"+bytes);
    Logger.log("blob:"+blob);

    folder.createFolder([name, email].join(" ")).createFile(blob);

    return "OK";

  } catch (f) {
    return f.toString();
  }

}
https://drive.google.com/open?id=0B1W9KnZUUDR5LWtkLS1jVmtvdWs

function testfindFolder() {

  try {

    var dropbox = "My Dropbox";
    var folder, folders = DriveApp.getFoldersByName(dropbox);

    if (folders.hasNext()) {
      folder = folders.next();
    } else {
      folder = DriveApp.createFolder(dropbox);
    }

    Logger.log("folder:" + folder.getId());
  } catch (f) {
    return f.toString();
  }

}