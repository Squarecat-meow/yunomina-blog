"use server";

export async function bucketAuth() {
  const token = btoa(
    `${process.env.BACKBLAZE_APPLICATION_ID}:${process.env.BACKBLAZE_APPLICATION_KEY}`
  );

  try {
    const authRes = await fetch(
      "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    );
    const bucket = await authRes.json();

    try {
      const bucketId = bucket.apiInfo.storageApi.bucketId;
      const authorizationToken = bucket.authorizationToken;
      const apiUrl = bucket.apiInfo.storageApi.apiUrl;

      const uploadRes = await fetch(
        `${apiUrl}/b2api/v3/b2_get_upload_url?bucketId=${bucketId}`,
        {
          headers: {
            Authorization: authorizationToken,
          },
        }
      );

      const uploadInfo = await uploadRes.json();

      return {
        uploadUrl: uploadInfo.uploadUrl as string,
        accessToken: uploadInfo.authorizationToken as string,
      };
    } catch (err) {
      throw new Error("업로드 URL Fetch 중 오류 발생");
    }
  } catch (err) {
    throw new Error("토큰 Authorizing 중 오류 발생");
  }
}
