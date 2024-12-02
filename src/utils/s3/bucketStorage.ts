import { PutObjectCommand, S3Client, S3ClientConfig } from "@aws-sdk/client-s3";

class s3 {
  private static newClient: S3Client;
  protected static Bucket = process.env.BACKBLAZE_BUCKET;
  protected static s3Payload: S3ClientConfig = {
    endpoint: process.env.BACKBLAZE_ENDPOINT,
    region: process.env.BACKBLAZE_REGION,
    credentials: {
      accessKeyId: process.env.BACKBLAZE_APPLICATION_ID as string,
      secretAccessKey: process.env.BACKBLAZE_APPLICATION_KEY as string,
    },
  };

  public static getClient() {
    if (!s3.newClient) {
      s3.newClient = new S3Client(this.s3Payload);
    }
    return s3.newClient;
  }
}

export class putObject extends s3 {
  private static storage = s3.getClient();
  public static put(key: string, body: Buffer, contentType: string) {
    if (!putObject.storage) {
      putObject.storage = s3.getClient();
    }
    this.storage.send(
      new PutObjectCommand({
        Bucket: this.Bucket,
        Key: `post-images/${key}`,
        Body: body,
        ContentType: contentType,
      })
    );

    const address: string = `https://${this.Bucket}.s3.${this.s3Payload.region}.backblazeb2.com/post-images/${key}`;
    return address;
  }
}
