import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ColorPalette as ColorPaletteType } from "../../types";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Select from "../UI/Select";

const ColorPalette: React.FC = () => {
  const [baseColor, setBaseColor] = useState("#3B82F6");
  const [paletteType, setPaletteType] = useState<
    "monochromatic" | "analogous" | "complementary" | "triadic"
  >("monochromatic");
  const [generatedPalette, setGeneratedPalette] = useState<ColorPaletteType>({
    colors: [],
    type: "monochromatic",
    baseColor: "#3B82F6",
  });

  const paletteTypes = [
    { value: "monochromatic", label: "Monochromatic" },
    { value: "analogous", label: "Analogous" },
    { value: "complementary", label: "Complementary" },
    { value: "triadic", label: "Triadic" },
  ];

  // Convert hex to HSL
  const hexToHsl = (hex: string): [number, number, number] => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
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
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  // Convert HSL to hex
  const hslToHex = (h: number, s: number, l: number): string => {
    h = h / 360;
    s = s / 100;
    l = l / 100;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (c: number): string => {
      const hex = Math.round(c * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Generate palette based on type
  const generatePalette = () => {
    const [h, s, l] = hexToHsl(baseColor);
    let colors: string[] = [];

    switch (paletteType) {
      case "monochromatic":
        colors = [
          hslToHex(h, s, Math.max(0, l - 40)),
          hslToHex(h, s, Math.max(0, l - 20)),
          hslToHex(h, s, l),
          hslToHex(h, s, Math.min(100, l + 20)),
          hslToHex(h, s, Math.min(100, l + 40)),
        ];
        break;

      case "analogous":
        colors = [
          hslToHex((h - 30 + 360) % 360, s, l),
          hslToHex((h - 15 + 360) % 360, s, l),
          hslToHex(h, s, l),
          hslToHex((h + 15) % 360, s, l),
          hslToHex((h + 30) % 360, s, l),
        ];
        break;

      case "complementary":
        colors = [
          hslToHex(h, s, Math.max(0, l - 20)),
          hslToHex(h, s, l),
          hslToHex(h, s, Math.min(100, l + 20)),
          hslToHex((h + 180) % 360, s, Math.max(0, l - 20)),
          hslToHex((h + 180) % 360, s, l),
        ];
        break;

      case "triadic":
        colors = [
          hslToHex(h, s, l),
          hslToHex((h + 120) % 360, s, l),
          hslToHex((h + 240) % 360, s, l),
          hslToHex(h, s, Math.min(100, l + 20)),
          hslToHex((h + 120) % 360, s, Math.min(100, l + 20)),
        ];
        break;
    }

    const newPalette: ColorPaletteType = {
      colors,
      type: paletteType,
      baseColor,
    };

    setGeneratedPalette(newPalette);
  };

  // Copy color to clipboard
  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    toast.success(`Copied ${color} to clipboard`);
  };

  // Generate CSS variables
  const generateCSS = () => {
    const css = `:root {
${generatedPalette.colors.map((color, index) => `  --color-${index + 1}: ${color};`).join("\n")}
}`;
    navigator.clipboard.writeText(css);
    toast.success("CSS variables copied to clipboard");
  };

  // Generate Tailwind config
  const generateTailwind = () => {
    const config = `module.exports = {
  theme: {
    extend: {
      colors: {
        custom: {
${generatedPalette.colors.map((color, index) => `          ${index + 1}: "${color}",`).join("\n")}
        },
      },
    },
  },
}`;
    navigator.clipboard.writeText(config);
    toast.success("Tailwind config copied to clipboard");
  };

  useEffect(() => {
    generatePalette();
  }, [baseColor, paletteType]);

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Color Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Base Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={baseColor}
                onChange={(e) => setBaseColor(e.target.value)}
                className="w-16 h-10 rounded-lg border border-gray-600 cursor-pointer"
              />
              <Input
                value={baseColor}
                onChange={setBaseColor}
                placeholder="#3B82F6"
                className="flex-1"
              />
            </div>
          </div>
          <Select
            label="Palette Type"
            value={paletteType}
            onChange={(value) =>
              setPaletteType(
                value as
                  | "monochromatic"
                  | "analogous"
                  | "complementary"
                  | "triadic"
              )
            }
            options={paletteTypes}
          />
        </div>
      </div>

      {/* Generated Palette */}
      <div className="bg-dark-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Generated Palette</h3>
          <div className="flex gap-2">
            <Button onClick={generateCSS} variant="outline" size="sm">
              Copy CSS
            </Button>
            <Button onClick={generateTailwind} variant="outline" size="sm">
              Copy Tailwind
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {generatedPalette.colors.map((color, index) => (
            <div key={index} className="text-center">
              <div
                className="w-full h-24 rounded-lg mb-2 cursor-pointer border border-gray-600 hover:border-gray-400 transition-colors"
                style={{ backgroundColor: color }}
                onClick={() => copyColor(color)}
                title={`Click to copy ${color}`}
              />
              <div className="text-sm font-mono text-gray-300">{color}</div>
              <div className="text-xs text-gray-500">Color {index + 1}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Color Information */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Color Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generatedPalette.colors.map((color, index) => {
            const [h, s, l] = hexToHsl(color);
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);

            return (
              <div key={index} className="bg-dark-900 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-8 h-8 rounded border border-gray-600"
                    style={{ backgroundColor: color }}
                  />
                  <div>
                    <div className="font-mono text-sm">{color}</div>
                    <div className="text-xs text-gray-500">
                      Color {index + 1}
                    </div>
                  </div>
                </div>
                <div className="space-y-1 text-xs text-gray-400">
                  <div>
                    RGB: {r}, {g}, {b}
                  </div>
                  <div>
                    HSL: {Math.round(h)}°, {Math.round(s)}%, {Math.round(l)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Palette Type Information */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">
          About {paletteType.charAt(0).toUpperCase() + paletteType.slice(1)}{" "}
          Palettes
        </h3>
        <div className="text-gray-300 space-y-2">
          {paletteType === "monochromatic" && (
            <p>
              Monochromatic palettes use variations of a single color by
              adjusting lightness and saturation. This creates a cohesive and
              harmonious look that's easy to work with.
            </p>
          )}
          {paletteType === "analogous" && (
            <p>
              Analogous palettes use colors that are next to each other on the
              color wheel. They create serene and comfortable designs, often
              found in nature.
            </p>
          )}
          {paletteType === "complementary" && (
            <p>
              Complementary palettes use colors opposite each other on the color
              wheel. They create vibrant contrast and are great for highlighting
              important elements.
            </p>
          )}
          {paletteType === "triadic" && (
            <p>
              Triadic palettes use three colors equally spaced around the color
              wheel. They offer vibrant contrast while maintaining harmony and
              balance.
            </p>
          )}
        </div>
      </div>

      {/* Accessibility Check */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Accessibility Check</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {generatedPalette.colors.slice(0, 2).map((color, index) => {
            const contrast = (() => {
              const r = parseInt(color.slice(1, 3), 16);
              const g = parseInt(color.slice(3, 5), 16);
              const b = parseInt(color.slice(5, 7), 16);
              const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
              return luminance > 0.5 ? "Dark text" : "Light text";
            })();

            return (
              <div key={index} className="bg-dark-900 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded border border-gray-600 flex items-center justify-center"
                    style={{ backgroundColor: color }}
                  >
                    <span
                      className={
                        contrast === "Dark text" ? "text-black" : "text-white"
                      }
                    >
                      Aa
                    </span>
                  </div>
                  <div>
                    <div className="font-mono text-sm">{color}</div>
                    <div className="text-xs text-gray-500">Use {contrast}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
