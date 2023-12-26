import { Bucket, CreateBucketResponse, Storage } from '@google-cloud/storage';
import axios from 'axios'
import { Buffer } from 'buffer'
import stream from 'stream'

interface ConfigInterface {
  type: string;
  project_id: string;
  private_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
  universe_domain: string;
}

async function fetchConfiguration(): Promise<ConfigInterface> {
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
  const base64Content = 'dGVzdGluZyB0ZXN0aW5n'
  // Decode the base64 string
  const buffer = Buffer.from(base64Content, 'base64');

  // Create a Readable stream from the Buffer
  const readableStream = new stream.Readable();
  readableStream.push(buffer);
  readableStream.push(null);

  // Upload the stream directly to GCS
  await new Promise((resolve, reject) => {
    readableStream
      .pipe(bucket.file(fileName).createWriteStream())
      .on('error', reject)
      .on('finish', resolve);
  }).catch(error => {
    throw new Error(error);
  });

  return `${fileName}`;
}

async function fetchFileFromGCS(
  bucket: Bucket, 
  fileName: string,
) {
  const file = bucket.file(fileName);

  try {
    const data = await file.download();
    const content = data[0].toString();
    return content;
  } catch (error) {
    throw error   
  }
}

async function removeFileFromGCS(
  bucket: Bucket, 
  fileName: string,
) {
  const file = bucket.file(fileName);

  const [res] = await file.delete().catch(error => { throw error });
  return { code: res?.statusCode, data: res?.statusMessage, fileName }
}


(async () => {
  const bucketName = 'wmch-presale'
  const fileName = 'demo.txt'
  const credentials = await fetchConfiguration()
  
  const bucket = await getBucketFromGCS(credentials, bucketName)
  const fileUrl = await uploadFileToGCS(bucket, fileName)
  // const fileUrl = `${fileName}`
  const resA = await fetchFileFromGCS(bucket, fileUrl)
  const resB = await removeFileFromGCS(bucket, fileUrl)

  console.log('==resA:', resA)
  console.log('==resB:', resB)
})()
