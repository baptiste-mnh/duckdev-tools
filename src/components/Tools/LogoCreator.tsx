import React, { useRef, useState, useEffect } from "react";
import Button from "../UI/Button";

const SIZES = [16, 32, 64, 128, 256, 512];

interface LogoOptions {
  squared: boolean;
  border: boolean;
  borderWidth: number;
  rounding: number;
  transparent: boolean;
}

const defaultOptions: LogoOptions = {
  squared: true,
  border: false,
  borderWidth: 2,
  rounding: 16,
  transparent: false,
};

const LogoCreator: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [options, setOptions] = useState<LogoOptions>(defaultOptions);
  const [generated, setGenerated] = useState<{ size: number; url: string }[]>(
    []
  );
  const fileInput = useRef<HTMLInputElement>(null);

  const generateLogo = (size: number): Promise<string> => {
    if (!image) return Promise.resolve("");

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d")!;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Background - always transparent when not squared (respecting aspect ratio)
    if (options.squared && !options.transparent) {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, size, size);
    }

    // Rounding
    if (options.rounding > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(options.rounding, 0);
      ctx.lineTo(size - options.rounding, 0);
      ctx.quadraticCurveTo(size, 0, size, options.rounding);
      ctx.lineTo(size, size - options.rounding);
      ctx.quadraticCurveTo(size, size, size - options.rounding, size);
      ctx.lineTo(options.rounding, size);
      ctx.quadraticCurveTo(0, size, 0, size - options.rounding);
      ctx.lineTo(0, options.rounding);
      ctx.quadraticCurveTo(0, 0, options.rounding, 0);
      ctx.closePath();
      ctx.clip();
    }

    // Draw image
    const img = new window.Image();
    img.src = image;

    return new Promise((resolve) => {
      img.onload = () => {
        let drawW = size,
          drawH = size,
          drawX = 0,
          drawY = 0;
        if (!options.squared) {
          // Respect original aspect ratio
          const ratio = img.width / img.height;
          if (ratio > 1) {
            drawW = size;
            drawH = size / ratio;
            drawY = (size - drawH) / 2;
          } else {
            drawH = size;
            drawW = size * ratio;
            drawX = (size - drawW) / 2;
          }
        }
        ctx.drawImage(img, drawX, drawY, drawW, drawH);

        // Border
        if (options.border) {
          ctx.save();
          ctx.strokeStyle = "#000000";
          ctx.lineWidth = options.borderWidth;
          ctx.beginPath();
          ctx.moveTo(options.rounding, 0);
          ctx.lineTo(size - options.rounding, 0);
          ctx.quadraticCurveTo(size, 0, size, options.rounding);
          ctx.lineTo(size, size - options.rounding);
          ctx.quadraticCurveTo(size, size, size - options.rounding, size);
          ctx.lineTo(options.rounding, size);
          ctx.quadraticCurveTo(0, size, 0, size - options.rounding);
          ctx.lineTo(0, options.rounding);
          ctx.quadraticCurveTo(0, 0, options.rounding, 0);
          ctx.closePath();
          ctx.stroke();
          ctx.restore();
        }

        ctx.restore();
        resolve(canvas.toDataURL("image/png"));
      };
    });
  };

  const generateAllLogos = async () => {
    if (!image) return;

    const results: { size: number; url: string }[] = [];
    for (const size of SIZES) {
      const url = await generateLogo(size);
      results.push({ size, url });
    }
    setGenerated(results);
  };

  // Real-time rendering
  useEffect(() => {
    if (image) {
      generateAllLogos();
    }
  }, [image, options]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImage(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleGenerate = () => {
    generateAllLogos();
  };

  return (
    <div className="space-y-6">
      <div className="bg-dark-800 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold mb-2">Upload your PNG logo</h3>
        <div
          className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors"
          onClick={() => fileInput.current?.click()}
        >
          <input
            type="file"
            accept="image/png"
            ref={fileInput}
            onChange={handleFile}
            className="hidden"
          />
          {image ? (
            <div className="space-y-4">
              <img
                src={image}
                alt="preview"
                className="max-h-32 rounded-lg border border-gray-700 mx-auto"
              />
              <p className="text-sm text-gray-400">Click to change image</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-gray-300">Click to select a PNG file</p>
              <p className="text-sm text-gray-500">or drag and drop here</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-dark-800 rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold mb-2">Options</h3>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.squared}
              onChange={(e) =>
                setOptions((o) => ({ ...o, squared: e.target.checked }))
              }
            />
            Square format
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.border}
              onChange={(e) =>
                setOptions((o) => ({ ...o, border: e.target.checked }))
              }
            />
            Border
          </label>
          {options.border && (
            <input
              type="number"
              min={1}
              max={16}
              value={options.borderWidth}
              onChange={(e) =>
                setOptions((o) => ({
                  ...o,
                  borderWidth: Number(e.target.value),
                }))
              }
              className="w-16"
            />
          )}
          <label className="flex items-center gap-2">
            Rounding
            <input
              type="range"
              min={0}
              max={64}
              value={options.rounding}
              onChange={(e) =>
                setOptions((o) => ({ ...o, rounding: Number(e.target.value) }))
              }
            />
            <span>{options.rounding}px</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={options.transparent}
              onChange={(e) =>
                setOptions((o) => ({ ...o, transparent: e.target.checked }))
              }
            />
            Transparent background
          </label>
        </div>
      </div>

      <Button onClick={handleGenerate} variant="primary" disabled={!image}>
        Generate logos
      </Button>

      {generated.length > 0 && (
        <div className="bg-dark-800 rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold mb-2">Generated logos</h3>
          <div className="flex flex-wrap gap-6">
            {generated.map(({ size, url }) => (
              <div key={size} className="flex flex-col items-center gap-2">
                <div
                  className="rounded-lg border border-gray-700"
                  style={{
                    width: size,
                    height: size,
                    background: options.transparent
                      ? "repeating-conic-gradient(#ccc 0% 25%, transparent 0% 50%) 50% / 20px 20px"
                      : "white",
                  }}
                >
                  <img
                    src={url}
                    alt={`logo ${size}x${size}`}
                    width={size}
                    height={size}
                    className="rounded-lg"
                    style={{ width: size, height: size }}
                  />
                </div>
                <div className="text-xs text-gray-400">
                  {size}x{size}
                </div>
                <a
                  href={url}
                  download={`logo_${size}x${size}.png`}
                  className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LogoCreator;
