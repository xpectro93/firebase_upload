const functions = require('firebase-functions')
const { Storage } = require('@google-cloud/storage');
const projectId = 'upload-80d65';
let gcs = new Storage ({
  projectId
});
const os = require('os');
const path = require('path');



exports.onFileChange = functions.storage.object().onFinalize(event => {
  console.log(event);
  const bucket = event.bucket;
  const contentType = event.contentType;
  const filePath = event.name;
  console.log('file detected')

if(path.basename(filePath).startsWith('renamed-')){
  console.log('already renamed this file')
  return;
}

  const destBucket = gcs.bucket(bucket);
  const tmpFilePath = path.join(os.tmpdir(), path.basename(filePath));
  const metadata = { contentType : contentType }
  return destBucket.file(filePath).download({
    destination : tmpFilePath
  }).then(() => {
   return destBucket.upload(tmpFilePath, {
    destination:'renamed-'+ path.basename(filePath),
    metadata: metadata
  }) 

 
  })

});