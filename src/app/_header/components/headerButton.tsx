"use client";

import Link from "next/link";

interface Props {
  children: React.ReactNode;
  href: string;
}

export default function HeaderButton({ children, href }: Props) {
  return (
    <div className="text-lg px-6 py-2 transition-shadow rounded-lg hover:shadow">
      <Link href={href}>{children}</Link>
    </div>
  );
}
