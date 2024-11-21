import Link from "next/link";

export default function PostsList() {
  return (
    <>
      <li className="desktop:hidden menu_item">
        <Link href={"/posts"}>Posts Top</Link>
      </li>
      <li>
        <a>유놋치</a>
        <ul>
          <li>
            <a>Submenu 1</a>
          </li>
          <li>
            <a>Submenu 2</a>
          </li>
          <li>
            <a>Parent</a>
            <ul>
              <li>
                <a>Submenu 1</a>
              </li>
              <li>
                <a>Submenu 2</a>
              </li>
            </ul>
          </li>
        </ul>
      </li>
      <li>
        <a>요즈미나</a>
        <ul>
          <li>
            <a>Submenu 1</a>
          </li>
          <li>
            <a>Submenu 2</a>
          </li>
          <li>
            <a>Parent</a>
            <ul>
              <li>
                <a>Submenu 1</a>
              </li>
              <li>
                <a>Submenu 2</a>
              </li>
            </ul>
          </li>
        </ul>
      </li>
    </>
  );
}
