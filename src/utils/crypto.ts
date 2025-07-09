import type { JWTHeader, JWTPayload } from "../types";

export class JWTUtils {
  static base64urlEncode(str: string): string {
    return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
  }

  static base64urlDecode(str: string): string {
    str += "=".repeat(4 - (str.length % 4));

    str = str.replace(/-/g, "+").replace(/_/g, "/");
    return atob(str);
  }

  static createJWT(
    header: JWTHeader,
    payload: JWTPayload,
    secret: string
  ): string {
    const encodedHeader = this.base64urlEncode(JSON.stringify(header));
    const encodedPayload = this.base64urlEncode(JSON.stringify(payload));

    const signature = this.base64urlEncode(
      `${encodedHeader}.${encodedPayload}.${secret}`
    );

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  static decodeJWT(
    token: string
  ): { header: JWTHeader; payload: JWTPayload; signature: string } | null {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
      }

      const header = JSON.parse(this.base64urlDecode(parts[0]));
      const payload = JSON.parse(this.base64urlDecode(parts[1]));
      const signature = parts[2];

      return { header, payload, signature };
    } catch (error) {
      console.error("JWT decode error:", error);
      return null;
    }
  }

  static validateJWT(token: string): boolean {
    const parts = token.split(".");
    if (parts.length !== 3) return false;

    try {
      JSON.parse(this.base64urlDecode(parts[0]));
      JSON.parse(this.base64urlDecode(parts[1]));
      return true;
    } catch {
      return false;
    }
  }
}

export class PasswordUtils {
  static readonly UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  static readonly LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
  static readonly NUMBERS = "0123456789";
  static readonly SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  static generatePassword(options: {
    length: number;
    uppercase: boolean;
    lowercase: boolean;
    numbers: boolean;
    symbols: boolean;
  }): string {
    let charset = "";

    if (options.uppercase) charset += this.UPPERCASE;
    if (options.lowercase) charset += this.LOWERCASE;
    if (options.numbers) charset += this.NUMBERS;
    if (options.symbols) charset += this.SYMBOLS;

    if (charset === "") {
      throw new Error("At least one character type must be selected");
    }

    let password = "";
    for (let i = 0; i < options.length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    return password;
  }

  static generatePasswords(
    count: number,
    options: {
      length: number;
      uppercase: boolean;
      lowercase: boolean;
      numbers: boolean;
      symbols: boolean;
    }
  ): string[] {
    const passwords: string[] = [];
    for (let i = 0; i < count; i++) {
      passwords.push(this.generatePassword(options));
    }
    return passwords;
  }

  static evaluateStrength(password: string): {
    score: number;
    level: "weak" | "fair" | "good" | "strong";
    suggestions: string[];
  } {
    let score = 0;
    const suggestions: string[] = [];

    if (password.length >= 8) score += 25;
    else suggestions.push("Utilisez au moins 8 caractères");

    if (password.length >= 12) score += 25;
    else if (password.length >= 8)
      suggestions.push("Utilisez au moins 12 caractères pour plus de sécurité");

    if (/[a-z]/.test(password)) score += 10;
    else suggestions.push("Ajoutez des lettres minuscules");

    if (/[A-Z]/.test(password)) score += 10;
    else suggestions.push("Ajoutez des lettres majuscules");

    if (/[0-9]/.test(password)) score += 10;
    else suggestions.push("Ajoutez des chiffres");

    if (/[^A-Za-z0-9]/.test(password)) score += 20;
    else suggestions.push("Ajoutez des caractères spéciaux");

    let level: "weak" | "fair" | "good" | "strong";
    if (score < 25) level = "weak";
    else if (score < 50) level = "fair";
    else if (score < 75) level = "good";
    else level = "strong";

    return { score, level, suggestions };
  }

  static generatePassphrase(wordCount: number = 4): string {
    const words = [
      "apple",
      "banana",
      "cherry",
      "dragon",
      "elephant",
      "forest",
      "garden",
      "honey",
      "island",
      "jungle",
      "kitten",
      "lemon",
      "mountain",
      "ocean",
      "purple",
      "rainbow",
      "sunset",
      "tiger",
      "umbrella",
      "violin",
      "waterfall",
      "yellow",
      "zebra",
      "crystal",
      "diamond",
      "emerald",
      "falcon",
      "guitar",
      "harmony",
      "infinity",
      "jupiter",
      "karma",
      "liberty",
      "melody",
      "nature",
      "phoenix",
      "quantum",
      "rhythm",
      "serenity",
      "thunder",
    ];

    const selectedWords: string[] = [];
    for (let i = 0; i < wordCount; i++) {
      const randomIndex = Math.floor(Math.random() * words.length);
      selectedWords.push(words[randomIndex]);
    }

    return selectedWords.join("-");
  }
}

export class CryptoUtils {
  static generateRandomKey(length: number = 32): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  static generateUUID(): string {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  static simpleHash(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString();

    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }

    return Math.abs(hash).toString(16);
  }
}
