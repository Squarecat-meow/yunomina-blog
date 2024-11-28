import { createElement, RefObject, useRef, useState } from "react";
import { DropdownType } from "../toolbar";

type PropsType = {
  props: DropdownType[];
};

export default function EditorDropdown({ props }: PropsType) {
  const [activeItem, setActiveItem] = useState<DropdownType>(props[0]);
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  return (
    <details className="dropdown" ref={dropdownRef}>
      <summary tabIndex={0} className="select select-sm w-44 flex items-center">
        <div className="flex items-center gap-2">
          {activeItem.carbonIcon ? (
            <>
              {createElement(activeItem.carbonIcon, {}, "")}
              {createElement("a", {}, activeItem.string)}
            </>
          ) : (
            <>
              {activeItem.faIcon && (
                <>
                  {createElement(activeItem.faIcon, {}, "")}
                  {createElement("a", {}, activeItem.string)}
                </>
              )}
            </>
          )}
        </div>
      </summary>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        {props.map((el) => (
          <li key={el.key}>
            {el.carbonIcon ? (
              <a
                onClick={() => {
                  if (el.onClick) el.onClick();
                  if (dropdownRef.current) dropdownRef.current.open = false;
                  setActiveItem({
                    key: el.key,
                    carbonIcon: el.carbonIcon,
                    string: el.string,
                  });
                }}
              >
                {createElement(el.carbonIcon, {}, "")}
                {createElement("span", {}, el.string)}
              </a>
            ) : (
              <>
                {el.faIcon && (
                  <a
                    onClick={() => {
                      if (el.onClick) el.onClick();
                      if (dropdownRef.current) dropdownRef.current.open = false;
                      setActiveItem({
                        key: el.key,
                        faIcon: el.faIcon,
                        string: el.string,
                      });
                    }}
                  >
                    {createElement(el.faIcon, {}, "")}
                    {createElement("span", {}, el.string)}
                  </a>
                )}
              </>
            )}
          </li>
        ))}
      </ul>
    </details>
  );
}
