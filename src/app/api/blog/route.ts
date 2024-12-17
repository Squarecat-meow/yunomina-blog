export async function GET() {
  return Response.json(
    {
      "@context": "https://www.w3.org/ns/activitystreams",
      id: `${process.env.WEB_URL}/blog`,
      type: "Person",
      following: "https://serafuku.moe/@Yozumina/following",
      followers: "https://serafuku.moe/@Yozumina/followers",
      inbox: `${process.env.WEB_URL}/api/inbox`,
      outbox: `${process.env.WEB_URL}/api/outbox`,
      preferredUsername: "yunominaBlog",
      name: "놋치미나의 아늑한 집",
      summary: "놋치미나의 공동블로그에요!",
      url: `${process.env.WEB_URL}`,
      discoverable: true,
      memorial: false,
      icon: {
        type: "Image",
        mediaType: "image/png",
        url: "https://yunomina-blog.s3.us-east-005.backblazeb2.com/profile-photo/b8b41ae5-323a-4baf-b374-d28acc859283",
      },
      image: {
        type: "Image",
        mediaType: "image/png",
        url: "https://yunomina-blog.s3.us-east-005.backblazeb2.com/341+%EC%8B%AD%EC%88%91+%EC%8A%A4%EB%94%94%ED%83%80%EC%9E%85+(%ED%97%A4%EB%8D%94).png",
      },
      publicKey: {
        "@context": "https://w3id.org/security/v1",
        "@type": "Key",
        id: `${process.env.WEB_URL}/blog#main-key`,
        owner: `${process.env.WEB_URL}/blog`,
        publicKeyPem: process.env.PUBLIC_KEY,
      },
    },
    { headers: { "Content-Type": "application/activity+json" } }
  );
}
