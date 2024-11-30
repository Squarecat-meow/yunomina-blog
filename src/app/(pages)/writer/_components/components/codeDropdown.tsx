import { useRef, useState } from "react";

export default function EditorCodeDropdown({
  language,
}: {
  language: [string, string][];
}) {
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const [activeItem, setActiveItem] = useState<string>(language[6][1]);

  return (
    <>
      <details className="dropdown" ref={dropdownRef}>
        <summary className="select select-sm w-44 flex items-center">
          <div className="flex items-center gap-2">{activeItem}</div>
        </summary>
        <ul className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          {language.map(([value, codeName], key) => (
            <ul key={key}>
              <li>
                <a
                  onClick={() => {
                    setActiveItem(codeName);
                    if (dropdownRef.current) dropdownRef.current.open = false;
                  }}
                >
                  {codeName}
                </a>
              </li>
            </ul>
          ))}
        </ul>
      </details>
    </>
  );
}
