"use client";

import Link from "next/link";

interface Props {
  children: React.ReactNode;
  href: string;
}

export default function HeaderButton({ children, href }: Props) {
  return (
    <Link href={href}>
      <div className="text-lg px-6 py-2 transition-shadow rounded-lg hover:shadow">
        {children}
      </div>
    </Link>
  );
}
