export async function GET() {
  return Response.json(
    {
      subject: "acct:blog@yuno.mina.house",
      aliases: ["https://serafuku.moe/@Yozumina"],
      links: [
        {
          rel: "self",
          type: "application/activity+json",
          href: `${process.env.WEB_URL}/blog`,
        },
        {
          rel: "http://webfinger.net/rel/profile-page",
          type: "text/html",
          href: process.env.WEB_URL,
        },
      ],
    },
    { headers: { "Content-Type": "application/jrd+json" } }
  );
}
