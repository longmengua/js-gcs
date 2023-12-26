import { Bucket, CreateBucketResponse, Storage } from '@google-cloud/storage';
import axios from 'axios'

async function fetchConfiguration() {
  const username = 'longmengua';
  const repository = 'configuration';
  const branchName = 'master'
  const file = 'wmch-gcs-config.json';
  const token = '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'

  // https://raw.githubusercontent.com/longmengua/configuration/master/wmch-gcs-config.json
  const rawUrl = `https://raw.githubusercontent.com/${username}/${repository}/${branchName}/${file}`;
  const headers = { 'Authorization': `token ${token}` }

  const data = await axios.get(rawUrl, {headers})
    .then((response: any) => {
      return response?.data
    })
    .catch((error: any) => {
      throw new Error(error);
    });
  return data
}

async function getBucketFromGCS(
  credentials: any, 
  bucketName: string, 
): Promise<Bucket> {
  // Your JSON key as a string
  const obj: any = {
    projectId: 'wmch-408510',
    // keyFilename: 'path/to/keyfile.json',
    credentials: credentials,
    autoRetry: false,
    maxRetries: 3,
    // promise: Promise, // Use a custom promise module if needed
  };
  
  // Create a storage client using the JSON key string
  const storage = new Storage(obj);

  // Get bucket by name
  let bucket: Bucket = storage.bucket(bucketName);
  const [existed] = await bucket.exists();
  
  if (!existed) {
    // If no bucket created, create a new one
    [bucket] = await storage.createBucket(bucketName).then((res: CreateBucketResponse) => {
      return res
    }).catch(error => {
      throw new Error(error);
    });
  }

  return bucket
}

async function uploadFileToGCS(
  bucket: Bucket, 
  fileName: string, 
) {
  // Replace 'path/to/local/file.txt' with the local path to the file you want to upload
  const localFilePath = 'file.txt';
  
  await bucket
    .upload(localFilePath, {
      destination: fileName,
    })
    .catch(error => {
      throw new Error(error);
    });

  return `${bucket.name}/${fileName}`
}

async function fetchFileFromGCS(
  bucket: Bucket, 
  fileUrl: string,
) {
  const [fileName] = fileUrl.split('/')
  const file = bucket.file(fileName);
  return file;
}

(async () => {
  const bucketName = 'wmch-bk-bucket'
  const fileName = 'demo.txt'
  const credentials = await fetchConfiguration()
  
  const bucket = await getBucketFromGCS(credentials, bucketName)
  const fileUrl = await uploadFileToGCS(bucket, fileName)
  const res = await fetchFileFromGCS(bucket, fileUrl)

  console.log('status:', res)
})()
