import { TextMatchTransformer } from "@lexical/markdown"
import { $isTextNode } from "lexical"

export const ANGLE_BRAKET: TextMatchTransformer = {
  export: (node, exportChildren, exportFormat) => {
    if (!$isTextNode(node)) return null;
    const text = node.getTextContent();
    return `${text.replaceAll(/(?=[<>])/g, '\\')}`;
  },
  importRegExp: /(?=[<>])/g,
  regExp: /(?=[<>])/g,
  type: 'text-match',
  dependencies: [],
}
