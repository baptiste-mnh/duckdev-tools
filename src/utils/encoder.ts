export class EncodingUtils {
  static base64Encode(text: string): string {
    try {
      return btoa(unescape(encodeURIComponent(text)));
    } catch {
      throw new Error("Error during Base64 encoding");
    }
  }

  static base64Decode(text: string): string {
    try {
      return decodeURIComponent(escape(atob(text)));
    } catch {
      throw new Error("Error during Base64 decoding");
    }
  }

  static urlEncode(text: string): string {
    try {
      return encodeURIComponent(text);
    } catch {
      throw new Error("Error during URL encoding");
    }
  }

  static urlDecode(text: string): string {
    try {
      return decodeURIComponent(text);
    } catch {
      throw new Error("Error during URL decoding");
    }
  }

  static htmlEncode(text: string): string {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  static htmlDecode(text: string): string {
    const div = document.createElement("div");
    div.innerHTML = text;
    return div.textContent || "";
  }

  static hexEncode(text: string): string {
    try {
      return Array.from(text)
        .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join("");
    } catch {
      throw new Error("Error during hexadecimal encoding");
    }
  }

  static hexDecode(text: string): string {
    try {
      return (
        text
          .match(/.{1,2}/g)
          ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
          .join("") || ""
      );
    } catch {
      throw new Error("Error during hexadecimal decoding");
    }
  }

  static encode(text: string, type: "base64" | "url" | "html" | "hex"): string {
    switch (type) {
      case "base64":
        return this.base64Encode(text);
      case "url":
        return this.urlEncode(text);
      case "html":
        return this.htmlEncode(text);
      case "hex":
        return this.hexEncode(text);
      default:
        throw new Error("Unsupported encoding type");
    }
  }

  static decode(text: string, type: "base64" | "url" | "html" | "hex"): string {
    switch (type) {
      case "base64":
        return this.base64Decode(text);
      case "url":
        return this.urlDecode(text);
      case "html":
        return this.htmlDecode(text);
      case "hex":
        return this.hexDecode(text);
      default:
        throw new Error("Unsupported decoding type");
    }
  }
}
