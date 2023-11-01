import multiparty from 'multiparty'
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3'
const bucketName = 'elle-next-s3'

export default async function handle(req, res){
    
    const form = new multiparty.Form()
    const {fields,files} = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
            if(err){
                reject(err)
            }
            resolve({fields, files})
        })
    })
    const client = new S3Client({
        region: 'ap-southeast-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    })

    for(const file of files.file){
        const ext = file.originalFilename.split('.').pop()
        console.log({ext, file})
        const newFilename = Date.now() + '.' + ext
        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: newFilename,
        }))
        
    }
}

export const config = {
    api: {bodyParser: false}
}