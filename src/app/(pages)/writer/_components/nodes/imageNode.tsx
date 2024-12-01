import {
  $applyNodeReplacement,
  DecoratorNode,
  DOMExportOutput,
  EditorConfig,
  NodeKey,
} from "lexical";
import Image from "next/image";
import { ReactElement, Suspense } from "react";

export interface ImagePayload {
  altText?: string;
  width: number;
  height: number;
  src: string;
  key?: NodeKey;
}

export class ImageNode extends DecoratorNode<ReactElement> {
  __src: string;
  __width: number;
  __height: number;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(node.__src, node.__width, node.__height, node.__key);
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("width", this.__width.toString());
    element.setAttribute("height", this.__height.toString());
    return { element };
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
    const className = theme.image;
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
        <Image
          src={this.__src}
          alt="selected Image"
          width={this.__width}
          height={this.__height}
          key={this.getKey()}
        />
      </Suspense>
    );
  }

  constructor(src: string, width: number, height: number, key?: NodeKey) {
    super(key);
    this.__src = src;
    this.__width = width;
    this.__height = height;
  }
}

export function $createImageNode({
  src,
  height,
  width,
  key,
}: ImagePayload): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, height, width, key));
}
