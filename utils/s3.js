const {
	S3Client,
	GetObjectCommand,
	PutObjectCommand,
} = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const s3SecretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
const s3AccessKey = process.env.S3_ACCESS_KEY;
const s3 = new S3Client({
	credentials: {
		accessKeyId: s3AccessKey,
		secretAccessKey: s3SecretAccessKey,
	},
	region: bucketRegion,
});

const getFromS3 = async (key) => {
	let getObjectParams = {
		Bucket: bucketName,
	};
	getObjectParams = { ...getObjectParams, Key: key };
	const command = new GetObjectCommand(getObjectParams);
	return await getSignedUrl(s3, command, {
		expiresIn: 3600,
	});
};

const putInS3 = async (photoName, buffer, contentType) => {
	const s3Params = {
		Bucket: bucketName,
	};
	s3Params.Key = photoName;
	s3Params.Body = buffer;
	s3Params.ContentType = contentType;
	const put = new PutObjectCommand(s3Params);
	await s3.send(put);
};

module.exports = {
	getFromS3,
	putInS3,
};
