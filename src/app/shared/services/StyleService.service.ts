import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class StyleService {
  private stylesMap: Map<any, Node> = new Map();
  private host: Node;

  constructor() {
    this.host = document.head;
  }

  private createStyleNode(content: string): Node {
    const styleEl = document.createElement("style");
    styleEl.textContent = content;
    return styleEl;
  }

  addStyle(key: any, style: string): void {
    const styleEl = this.createStyleNode(style);
    this.stylesMap.set(key, styleEl);
    this.host.appendChild(styleEl);
  }

  removeStyle(key: any): void {
    const styleEl = this.stylesMap.get(key);
    if (styleEl) {
      this.stylesMap.delete(key);
      this.host.removeChild(styleEl);
    }
  }
}
