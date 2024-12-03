import { LexicalEditor } from "lexical";
import { createContext, Dispatch, SetStateAction } from "react";

export const EditorContext = createContext<Dispatch<
  SetStateAction<LexicalEditor | null>
> | null>(null);
