import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    version: "2.0",
    software: {
      name: "blogmina",
      version: "0.7.0",
    },
    protocols: {
      0: "activitypub",
    },
    services: {
      inbound: [],
      outbound: {
        0: "atom1.0",
        1: "rss2.0",
      },
    },
    openRegistrations: false,
    metadata: {
      nodeName: "놋치미나의 아늑한 집",
      nodeDescription: "놋치미나의 공동블로그에요!",
      nodeAdmins: {
        0: {
          name: "Yozumina",
          email: "yozumina@serafuku.moe",
        },
        1: {
          name: "yunochi",
          email: "yuno@yunochi.com",
        },
      },
      themeColor: "#e2e8f0",
    },
  });
}
