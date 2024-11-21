import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Header from "./_header/page";

const noonnuuGotinc = localFont({
  src: "./fonts/NoonnuBasicGothicRegular.ttf",
  variable: "--font-noonnuu-gothic",
  weight: "100 900",
});
const IBMMono = localFont({
  src: "./fonts/IBMPlexMono-Medium.ttf",
  variable: "--font-ibm-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "YunoMina Blog",
  description: "놋치미나의 공동블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${noonnuuGotinc.variable} ${IBMMono.variable} font-[family-name:var(--font-noonnuu-gothic)] antialiased flex flex-col items-center p-2 desktop:p-6`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
