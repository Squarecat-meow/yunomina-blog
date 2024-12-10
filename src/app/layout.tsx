import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./@header/page";
import { Suspense } from "react";
import Loading from "./loading";

const IBMMono = localFont({
  src: "./fonts/IBMPlexMono-Medium.ttf",
  variable: "--font-ibm-mono",
  weight: "100 900",
});
const Pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard-variable",
  weight: "100 400 700",
});

export const metadata: Metadata = {
  title: "놋치미나의 아늑한 집",
  description: "놋치미나의 공동블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          defer
          data-domain="yuno.mina.house"
          src="https://plausible.mina.house/js/script.js"
        ></script>
        <meta
          name="google-site-verification"
          content="mXr9xeLPH7srkDxe75OTKBpCxubthM1JdLTuGVoqWf0"
        />
      </head>
      <body
        className={`${Pretendard.variable} ${IBMMono.variable} font-[family-name:var(--font-pretendard-variable)] antialiased flex flex-col items-center p-2 desktop:p-6`}
      >
        <Suspense fallback={<Loading />}>
          <Header />
          {children}
        </Suspense>
      </body>
    </html>
  );
}
