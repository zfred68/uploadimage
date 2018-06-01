var Logger;

function doGet(e) {

 var app = HtmlService.createHtmlOutputFromFile('index')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  return app;

}

function doPost(e) {

}

function uploadImage(e) {

 var foldername,name,image;
  
 setLogger();    
  
 if(e!=undefined) {
     foldername = e.parameter["folder"];
     name   = e.parameter["name"];
     image = e.parameter["image"];
  }
  if(length(foldername)==0) {
    foldername="programs_pics";
  }
  
  var user_loginid = Session.getUser().getUserLoginId();
  
  var  folders = DriveApp.getFoldersByName(foldername);
  var  image_folder=null;
  while (folders.hasNext()) {
       var folder = folders.next();
       Logger.log('folder:'+folder.getName()+' url:'+folder.getUrl());
       if(folder.getName()==foldername) {
          Logger.log('name matched');
          image_folder=folder;
          break;
       }
  }
  if(image_folder==null) { //create the folder
    var r = DriveApp.getRootFolder();
    image_folder=r.createFolder(foldername);
  }

  var file = image_folder.createFile(name, content, mimeType)
  return app;
}
 
function setLogger2() {
  Logger = MyLogger.useSpreadsheet("uploadImage",'Log'); 
}
var REGISTRATION_SHEET = 'uploads-request';

function setLogger() {
  var id = "1FycP7DmLOii8nMuN8juMJEpwj641bj_QrNDyuvEliH4";
//  var st = getdsheet(REGISTRATION_SHEET);                     
//  var ss = st.getParent()
//  var id = ss.getId();
  Logger = MyLogger.useSpreadsheet(id,'Log'); 
}
function getdsheet(name) {
  var files = DriveApp.getFilesByName(name);
  var file;
  while (files.hasNext()) {
     file = files.next();
     Logger.log('name:'+file.getName()+' id:'+file.getId()+' type:'+file.getMimeType()+' url:'+file.getUrl());
     var folders = file.getParents();
     while (folders.hasNext()) {
       var folder = folders.next();
       Logger.log('folder:'+folder.getName()+' url:'+folder.getUrl());  
       if(folder.getName()=="My Drive") {
          Logger.log('name matched');
          break;
       }
     }   
  }
  var ss = SpreadsheetApp.open(file);
  SpreadsheetApp.setActiveSpreadsheet(ss);
  var st = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log(st.getId());
  //var sh = st.getSheetByName("member-requests");
  //tz = st.getSpreadsheetTimeZone();
  return st;
}


/**
 * Insert new file.
 *
 * @param {File} fileData File object to read data from.
 * @param {Function} callback Function to call when the request is complete.
 */
function insertFile(fileData, callback) {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var reader = new FileReader();
  reader.readAsBinaryString(fileData);
  reader.onload = function(e) {
    var contentType = fileData.type || 'application/octet-stream';
    var metadata = {
      'title': fileData.fileName,
      'mimeType': contentType
    };

    var base64Data = btoa(reader.result);
    var multipartRequestBody =
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: ' + contentType + '\r\n' +
        'Content-Transfer-Encoding: base64\r\n' +
        '\r\n' +
        base64Data +
        close_delim;

    var request = gapi.client.request({
        'path': '/upload/drive/v2/files',
        'method': 'POST',
        'params': {'uploadType': 'multipart'},
        'headers': {
          'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
        },
        'body': multipartRequestBody});
    if (!callback) {
      callback = function(file) {
        console.log(file)
      };
    }
    request.execute(callback);
  }
}
// Create Base64 Object
var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}

var MyFolderID = "0B1W9KnZUUDR5UmExSFBwTDl0RkE";

/**

*/

function processForm(theForm) {
  setLogger();
 
  
  //var fileBlob = theForm.imagefile;
  //var filename = fileBlob.getName();
  var filename = theForm.name;
  var type     = theForm.type;
  
  //var type =   fileBlob.getContentType();
  Logger.log(" Name: " + filename);
  Logger.log(" type: " + type);
  
  var fileBlob2 = theForm.fileinput;
  Logger.log("fileBlob2 typeof: " + typeof(fileBlob2));
  Logger.log("fileBlob2 Name: " + fileBlob2.getName());
  Logger.log("fileBlob2 type: " + fileBlob2.getContentType());
  Logger.log("fileBlob2 : " + fileBlob2);
  var fldrSssn = DriveApp.getFolderById(MyFolderID);
  var file2 =  fldrSssn.createFile(fileBlob2);
  file2.setName(fileBlob2.getName());
  
  var afileBlob2 = Utilities.newBlob(fileBlob2);
  Logger.log("afileBlob2 : " + afileBlob2);
  
  var a  = Utilities.base64Encode(fileBlob2.getBytes());   // encode binary to base64  
  Logger.log("fileBlob2 a: " +a);                          // fileBlob2 a: /9j/4AAQSkZJRgABAgAAZABkAAD/7AARRHVj...........
  
  //----------------------------------------
 //  var fileBlob = Base64.decode(theForm.imagefile);
 Logger.log('imagefile: '+theForm.imagefile);              //imagefile: data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBw
 var imagefileEncoded = theForm.imagefile;
 Logger.log('imagefileEncoded typeof: '+typeof(imagefileEncoded));
 var imagefileEncoded2 = imagefileEncoded.replace("data:image/jpeg;base64,","");
  Logger.log('imagefileEncoded2: '+imagefileEncoded2);     // imagefileEncoded2: /9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwg..............

 //var byteCharacters = atob(imagefileEncoded2);
 
 var byteCharacters = Utilities.base64Decode(imagefileEncoded2);
  //var byteArray = new Uint8Array(byteNumbers);
 var contentType="image/jpeg";
 
 var fileBlob = Utilities.newBlob(byteCharacters,  contentType, filename);
   
  //---------- 
  //newBlob(data, contentType, name)
  //var blob2 = Utilities.newBlob(imagefileEncoded2,"image/jpeg",filename);
  //Logger.log("blob2: "+blob2);
  //var decoded = Utilities.base64Decode(imagefileEncoded2);
  //Logger.log("decoded:"+decoded);
   
  Logger.log("fileBlob typeof:"+ typeof(fileBlob));
  Logger.log("fileBlob Name: " + fileBlob.getName());
  Logger.log("fileBlob type: " + fileBlob.getContentType());
  

  Logger.log('fileBlob: ' + fileBlob);

  var fldrSssn = DriveApp.getFolderById(MyFolderID);
  var file =  fldrSssn.createFile( fileBlob);
 // file.setName(filename);
  return true;
}


function test2() {
 setLogger();
 var args = { "parameters" : []};
 
 args.parameters["folder"]="MyImagesA";
 args.parameters["name"]="ardvarck";
 args.parameters["image"]="";
 var r = doGet(args);
 Logger.log(r);
}