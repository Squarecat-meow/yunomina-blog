"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { initialConfig } from "./_initialConfig";

export default function WriterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full desktop:w-[90%] p-6">
      <LexicalComposer initialConfig={initialConfig}>
        {children}
      </LexicalComposer>
    </div>
  );
}
