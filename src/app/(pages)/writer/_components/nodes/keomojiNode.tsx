import {
  $applyNodeReplacement,
  DecoratorNode,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import { ReactElement, Suspense } from "react";

export interface KeomojiPayload {
  name: string;
  width: number;
  height: number;
  src: string;
  key?: NodeKey;
}

export type SerializedKeomojiNode = Spread<
  {
    name: string;
    height: number;
    src: string;
    width: number;
  },
  SerializedLexicalNode
>;

export class KeomojiNode extends DecoratorNode<ReactElement> {
  __src: string;
  __width: number;
  __height: number;
  __name: string;

  static getType(): string {
    return "keomoji";
  }

  static clone(node: KeomojiNode): KeomojiNode {
    return new KeomojiNode(
      node.__name,
      node.__src,
      node.__width,
      node.__height,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedKeomojiNode): KeomojiNode {
    const { name, height, width, src } = serializedNode;
    const node = $createKeomojiNode({
      name,
      height,
      src,
      width,
    });
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("width", this.__width.toString());
    element.setAttribute("height", this.__height.toString());
    return { element };
  }

  exportJSON(): SerializedKeomojiNode {
    return {
      name: this.__name,
      height: this.__height,
      src: this.getSrc(),
      type: "keomoji",
      version: 1,
      width: this.__width,
    };
  }

  setWidthAndHeight(width: number, height: number): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.keomoji;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  decorate(): JSX.Element {
    return (
      <Suspense fallback={null}>
        <img
          src={this.__src}
          alt={this.__name}
          width={this.__width}
          height={this.__height}
          key={this.getKey()}
        />
      </Suspense>
    );
  }

  constructor(
    name: string,
    src: string,
    width: number,
    height: number,
    key?: NodeKey
  ) {
    super(key);
    this.__name = name;
    this.__src = src;
    this.__width = width;
    this.__height = height;
  }
}

export function $createKeomojiNode({
  name,
  src,
  height,
  width,
  key,
}: KeomojiPayload): KeomojiNode {
  return $applyNodeReplacement(new KeomojiNode(name, src, height, width, key));
}

export function $isKeomojiNode(
  node: LexicalNode | null | undefined
): node is KeomojiNode {
  return node instanceof KeomojiNode;
}
