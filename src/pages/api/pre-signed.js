


// const AWS = require('aws-sdk');
import AWS from 'aws-sdk';

// Set the AWS region
const region = process.argv[2]; // REGION
AWS.config.update(region);

// Create S3 service object
const s3 = new AWS.S3();

// Set the parameters
const myBucket = process.argv[3]; //BUCKET_NAME
const myKey = process.argv[4]; // FILE_NAME
const signedUrlExpireSeconds = 60*5; //EXPIRATION

const presignedURL = s3.getSignedUrl('getObject', {
    Bucket: myBucket,
    Key: myKey,
    Expires: signedUrlExpireSeconds
})
console.log(presignedURL)











import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Set the AWS Region.
const REGION = "REGION"; //e.g. "us-east-1"
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION });
export { s3Client };


// Set parameters
// Create a random names for the S3 bucket and key.
export const bucketParams = {
  Bucket: `test-bucket-${Math.ceil(Math.random() * 10 ** 10)}`,
  Key: `test-object-${Math.ceil(Math.random() * 10 ** 10)}`,
  Body: "BODY"
};

export const run = async () => {

  // Create a presigned URL.
  try {
    // Create the command.
    const command = new GetObjectCommand(bucketParams);

    // Create the presigned URL.
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    console.log(
      `\nGetting "${bucketParams.Key}" using signedUrl with body "${bucketParams.Body}" in v3`
    );
    console.log(signedUrl);
    const response = await fetch(signedUrl);
    console.log(
      `\nResponse returned by signed URL: ${await response.text()}\n`
    );
  } catch (err) {
    console.log("Error creating presigned URL", err);
  }

}
















https://adamrichardson.dev/code/uploading-images-to-s3-react


import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
// ...
const client = new S3Client(clientParams);
const command = new GetObjectCommand(getObjectParams);
const url = await getSignedUrl(client, command, { expiresIn: 3600 });











// read 
const AWS = require('aws-sdk');
AWS.config.update(
  {
    accessKeyId: "....",
    secretAccessKey: "...",
    region: 'ap-southeast-1'
  }
);
const s3 = new AWS.S3();
const options = {
  Bucket    : '/bucket-url',
  Key    : fileKey,
};
const fileStream = s3.getObject(options).createReadStream();
fileStream.pipe(res);



// pages/api/upload-url.js

import aws from 'aws-sdk';

export default async function handler(req, res) {
  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
    signatureVersion: 'v4',
  });

  const s3 = new aws.S3();
  const post = await s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key: req.query.file,
    },
    Expires: 60, // seconds
    Conditions: [
      ['content-length-range', 0, 1048576], // up to 1 MB
    ],
  });

  res.status(200).json(post);
}


