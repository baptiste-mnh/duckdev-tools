// Utilitaires pour la gestion des couleurs
export class ColorUtils {
  // Conversion hex vers HSL
  static hexToHsl(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
        default:
          h = 0;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  }

  // Conversion HSL vers hex
  static hslToHex(h: number, s: number, l: number): string {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  // Génération de palette monochromatique
  static generateMonochromaticPalette(baseColor: string): string[] {
    const [h, s, l] = this.hexToHsl(baseColor);
    const colors: string[] = [];

    // Générer 5 variations de luminosité
    for (let i = 0; i < 5; i++) {
      const newL = Math.max(10, Math.min(90, l + (i - 2) * 20));
      colors.push(this.hslToHex(h, s, newL));
    }

    return colors;
  }

  // Génération de palette analogique
  static generateAnalogousPalette(baseColor: string): string[] {
    const [h, s, l] = this.hexToHsl(baseColor);
    const colors: string[] = [];

    // Générer 5 couleurs avec des teintes proches
    for (let i = -2; i <= 2; i++) {
      const newH = (h + i * 30 + 360) % 360;
      colors.push(this.hslToHex(newH, s, l));
    }

    return colors;
  }

  // Génération de palette complémentaire
  static generateComplementaryPalette(baseColor: string): string[] {
    const [h, s, l] = this.hexToHsl(baseColor);

    return [
      baseColor,
      this.hslToHex((h + 180) % 360, s, l),
      this.hslToHex(h, s * 0.7, l * 1.2),
      this.hslToHex((h + 180) % 360, s * 0.7, l * 1.2),
      this.hslToHex(h, s * 0.5, l * 0.8),
    ];
  }

  // Génération de palette triadique
  static generateTriadicPalette(baseColor: string): string[] {
    const [h, s, l] = this.hexToHsl(baseColor);

    return [
      baseColor,
      this.hslToHex((h + 120) % 360, s, l),
      this.hslToHex((h + 240) % 360, s, l),
      this.hslToHex(h, s * 0.7, l * 1.2),
      this.hslToHex((h + 60) % 360, s * 0.8, l * 0.9),
    ];
  }

  // Génération de palette selon le type
  static generatePalette(
    baseColor: string,
    type: "monochromatic" | "analogous" | "complementary" | "triadic"
  ): string[] {
    switch (type) {
      case "monochromatic":
        return this.generateMonochromaticPalette(baseColor);
      case "analogous":
        return this.generateAnalogousPalette(baseColor);
      case "complementary":
        return this.generateComplementaryPalette(baseColor);
      case "triadic":
        return this.generateTriadicPalette(baseColor);
      default:
        return [baseColor];
    }
  }

  // Génération de CSS pour la palette
  static generateCSS(colors: string[]): string {
    let css = ":root {\n";
    colors.forEach((color, index) => {
      css += `  --color-${index + 1}: ${color};\n`;
    });
    css += "}\n\n";

    css += "/* Utility classes */\n";
    colors.forEach((_color, index) => {
      const num = index + 1;
      css += `.bg-color-${num} { background-color: var(--color-${num}); }\n`;
      css += `.text-color-${num} { color: var(--color-${num}); }\n`;
      css += `.border-color-${num} { border-color: var(--color-${num}); }\n`;
    });

    return css;
  }

  // Validation d'une couleur hex
  static isValidHex(hex: string): boolean {
    return /^#[0-9A-F]{6}$/i.test(hex);
  }

  // Génération d'une couleur aléatoire
  static generateRandomColor(): string {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  // Calculer le contraste entre deux couleurs
  static calculateContrast(color1: string, color2: string): number {
    const getLuminance = (hex: string): number => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;

      const [rs, gs, bs] = [r, g, b].map((c) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });

      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };

    const lum1 = getLuminance(color1);
    const lum2 = getLuminance(color2);

    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
  }

  // Déterminer si une couleur est claire ou sombre
  static isLight(hex: string): boolean {
    const [, , l] = this.hexToHsl(hex);
    return l > 50;
  }

  // Obtenir une couleur de texte contrastée
  static getContrastingTextColor(backgroundColor: string): string {
    return this.isLight(backgroundColor) ? "#000000" : "#ffffff";
  }

  // Assombrir une couleur
  static darken(hex: string, amount: number): string {
    const [h, s, l] = this.hexToHsl(hex);
    const newL = Math.max(0, l - amount);
    return this.hslToHex(h, s, newL);
  }

  // Éclaircir une couleur
  static lighten(hex: string, amount: number): string {
    const [h, s, l] = this.hexToHsl(hex);
    const newL = Math.min(100, l + amount);
    return this.hslToHex(h, s, newL);
  }

  // Saturer une couleur
  static saturate(hex: string, amount: number): string {
    const [h, s, l] = this.hexToHsl(hex);
    const newS = Math.min(100, s + amount);
    return this.hslToHex(h, newS, l);
  }

  // Désaturer une couleur
  static desaturate(hex: string, amount: number): string {
    const [h, s, l] = this.hexToHsl(hex);
    const newS = Math.max(0, s - amount);
    return this.hslToHex(h, newS, l);
  }

  // Mélanger deux couleurs
  static mix(color1: string, color2: string, ratio: number = 0.5): string {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio);
    const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio);
    const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio);

    return this.rgbToHex(r, g, b);
  }

  // Conversion hex vers RGB
  static hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  // Conversion RGB vers hex
  static rgbToHex(r: number, g: number, b: number): string {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  }

  // Conversion hex vers HSV
  static hexToHsv(hex: string): [number, number, number] {
    const { r, g, b } = this.hexToRgb(hex);
    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    const max = Math.max(rNorm, gNorm, bNorm);
    const min = Math.min(rNorm, gNorm, bNorm);
    const delta = max - min;

    let h = 0;
    if (delta !== 0) {
      if (max === rNorm) h = ((gNorm - bNorm) / delta) % 6;
      else if (max === gNorm) h = (bNorm - rNorm) / delta + 2;
      else h = (rNorm - gNorm) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;

    const s = max === 0 ? 0 : delta / max;
    const v = max;

    return [h, Math.round(s * 100), Math.round(v * 100)];
  }

  // Génération de dégradé
  static generateGradient(
    color1: string,
    color2: string,
    steps: number = 5
  ): string[] {
    const gradient: string[] = [];
    for (let i = 0; i < steps; i++) {
      const ratio = i / (steps - 1);
      gradient.push(this.mix(color1, color2, ratio));
    }
    return gradient;
  }

  // Export des couleurs en différents formats
  static exportPalette(
    colors: string[],
    format: "css" | "json" | "ase" | "scss"
  ): string {
    switch (format) {
      case "css":
        return this.generateCSS(colors);
      case "json":
        return JSON.stringify(colors, null, 2);
      case "scss":
        let scss = "";
        colors.forEach((color, index) => {
          scss += `$color-${index + 1}: ${color};\n`;
        });
        return scss;
      case "ase":
        // Format Adobe Swatch Exchange (simplifié)
        return colors
          .map((color, index) => `Color ${index + 1}: ${color}`)
          .join("\n");
      default:
        return colors.join("\n");
    }
  }
}
