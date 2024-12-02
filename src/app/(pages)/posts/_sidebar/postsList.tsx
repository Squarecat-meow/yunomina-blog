"use client";

import { category } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import getCategories from "../_actions/action";

export default function PostsList() {
  const [categories, setCategories] = useState<category[] | null>();

  const fetchCategories = useCallback(async () => {
    const gotCategories = await getCategories();

    setCategories(gotCategories);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <li className="desktop:hidden menu_item">
        <Link href={"/posts"}>Posts Top</Link>
      </li>
      {categories?.map((category, key) => (
        <li key={key}>
          <a>{category.owner}</a>
          <ul>
            <li>
              <a>{category.category}</a>
            </li>
          </ul>
        </li>
      ))}
    </>
  );
}
