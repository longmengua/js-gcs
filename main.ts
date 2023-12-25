import { Storage } from '@google-cloud/storage';

// Set your Google Cloud Storage project ID
const projectId = 'wmch-408510';

const credentials = {
  "type": "service_account",
  "project_id": "wmch-408510",
  "private_key_id": "7efe60647a195bd5cea6fcda13b079244cc0fcdd",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCZ/vOHinmmh0eg\nhwFM2vKRCJgVlwv5oSlxw5OIaC7hGF9WsX0AaQHTn3LstsujYwgV12tJ17+5PShU\n6CksqV9E7Pi84lOf3NyOVgrJ06N0/aZ35iX6do+qroUme+pDSsgOS2OFV6qR2v36\nocBcKmLxfD65DpsKXvIUdP5b+gAgsY+BV3Y0AWfsr1OQj7i0iK9DRpORq0CKd/mu\njVXIbQWQ61AIhbgoXCd5peXgI5wMaWOSAhSEoQsTJsCUiIpDtYY+eA2xI6jnYpYk\nNAuKk9cOsNUXVJP2V4Ai6aYCtMwghJ1FFFSAX+UliXHUvFdYoJrgR2bee6pMcoyz\nqsJlC3KBAgMBAAECggEAL3kowyqdyQggPS0Ragt/RtXC6Lj5YJndyGv18dHITe0x\nCu1Jb1Rv0zju+Wl6yqIvbmhL82Y2/RiM8+vkMZf/PiTdo4EULY6tUZXV2pVLaTf+\n1yyUnatqK8CEXLJLrDYECWAVTJiThUZhEKBHyEHq4a4fOfZ2NlLBxyuv9FPUMT+B\nYqIszX0xkiLYrWJZG+TARACnDq2Jm5/JB0OhRQjBq9EaAp0aAciTiExcnKQIyIvd\nXzOuAgF0DYt+9b0WCtWREJjt5uOe8gmPMtuy9Zs6SMltnrFzFlgDgn2DwRdHjI8f\nnpntc8k8KN/UGAaSlwWKKXC1bhPrOJJYV6Mlfgq7DwKBgQDJeXQf4SAcn7Lsilfq\nP59dz5vhX1fFmEd1OtfcaxpH/KVKvCxU49tSzK4v6seFK2gOlJXOgVydinHmtIxr\n2VOvttk+NDNXwjHkBfz9d7p/7iYP2E4nbD0/9Hm767+uWXUxLslze8WZ044g0xLB\np1bAwT8mwmI2rHDJTG+bkZdtRwKBgQDDrBd5H23hAVjXHBNE/3ItKJ33nGG7Sacn\nmqUkAPhCmWOg/CcM5yxkoIApDLxqczCB5tYK5/yqHUsMLRZ1WlBaa757WruevayA\nd6yTPIPzjSMFXDslDugh0+orC+1IqJWJcw6LhGg4BVQFSteUSosf7shNGa5gl9vK\nB8rtvYxl9wKBgHwt+d80WSCLZjLZSjq9oDKoJcIRi/3kUBb3f9kBwp8gH5kixohE\nMQil068BHJz+FhL2jidMIJORo4a5PduzhhtFrjzi28p5jVqoPjjUNQVo+djGT9WI\np2/l9apYMjr6NHtuBQjC/xZDCNU+g88MnzILaisvoG1md9X64MeYQyc9AoGBAJd9\nffLdfWFtfI2WA+kwaAJEZwCURyoMHOjRlrcoNQzC2tqBPe6Eb988T9z4Kku0AMMh\np2dsMja2VSsJIVEb6ggHUMMJ/SYqLQqNHMQlXvdJtupofLX1M401Fx/arQvK0XNH\n6+PiUBnHLkSmq/74M3w2j0b58gKAr75biCXF0ZQDAoGBAKR5z9Tn1kI20VZV88Tg\nyKfK+T3GH503/Y8R7o+KcuRYijMC2UEWwxs2YotLPZTf0z7TWcR7lvRK+0IcYT+S\n9NaLZ++viQQ4KArvH4MS882VUMKpWPEX0k48q0jo2RNTFzk+a7bmJLx4pWq88Lij\nVgOx7hNFVNgNdPjHwvKqCHWl\n-----END PRIVATE KEY-----\n",
  "client_email": "120005314515-compute@developer.gserviceaccount.com",
  "client_id": "101964368133463539986",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/120005314515-compute%40developer.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

// Your JSON key as a string
const obj: any = {
  projectId: projectId,
  // keyFilename: 'path/to/keyfile.json',
  credentials: credentials,
  autoRetry: false,
  maxRetries: 3,
  // promise: Promise, // Use a custom promise module if needed
};

// Create a storage client using the JSON key string
const storage = new Storage(obj);
const bucketName = 'wmch-bucket'

// If no bucket created, create a new one
storage
  .createBucket(bucketName)
  .then(() => {
    console.log('Bucket created successfully!');
  })
  .catch(error => {
    console.error('Error creating bucket:', error);
  });

// Get a reference to the destination bucket
const bucket = storage.bucket(bucketName);

// Define the destination file name in the bucket
const destinationFileName = 'CloudFile.txt';

// Replace 'path/to/local/file.txt' with the local path to the file you want to upload
const localFilePath = 'file.txt';

bucket
  .upload(localFilePath, {
    destination: destinationFileName,
  })
  .then(() => {
    console.log(`File ${localFilePath} uploaded to ${bucketName}/${destinationFileName}`);
  })
  .catch(error => {
    console.error('Error uploading file:', error);
  });