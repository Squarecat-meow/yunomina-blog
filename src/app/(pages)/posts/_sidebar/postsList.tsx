"use client";

import { category, profile } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import getCategories from "../_actions/action";

export default function PostsList() {
  const [categories, setCategories] = useState<
    ({ ownedCategory: category[] } & profile)[] | null
  >();

  const fetchCategories = useCallback(async () => {
    const gotCategories = await getCategories();

    setCategories(gotCategories);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <>
      <li className="menu_item">
        <Link href={"/posts"}>Posts</Link>
      </li>
      {categories !== undefined ? (
        <>
          {categories !== null ? (
            <>
              {categories.map((owner) => (
                <li key={owner.id}>
                  <a>{owner.nickname}</a>
                  <ul>
                    {owner.ownedCategory.map((category) => (
                      <Link
                        href={`/posts/category/${category.id}`}
                        key={category.id}
                      >
                        <li>
                          <span>{category.category}</span>
                        </li>
                      </Link>
                    ))}
                  </ul>
                </li>
              ))}
            </>
          ) : (
            <li>
              <a>카테고리가 없어요!</a>
            </li>
          )}
        </>
      ) : (
        <li>
          <a>로딩중...</a>
        </li>
      )}
    </>
  );
}
