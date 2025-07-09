import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Button from "../UI/Button";
import Textarea from "../UI/Textarea";
import Select from "../UI/Select";

const EncoderDecoder: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [encodingType, setEncodingType] = useState("base64");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const encodingTypes = [
    { value: "base64", label: "Base64" },
    { value: "url", label: "URL Encoding" },
    { value: "html", label: "HTML Entities" },
    { value: "hex", label: "Hexadecimal" },
    { value: "binary", label: "Binary" },
    { value: "rot13", label: "ROT13" },
    { value: "caesar", label: "Caesar Cipher" },
  ];

  const modes = [
    { value: "encode", label: "Encode" },
    { value: "decode", label: "Decode" },
  ];

  const encodeText = (text: string, type: string): string => {
    try {
      switch (type) {
        case "base64":
          return btoa(text);
        case "url":
          return encodeURIComponent(text);
        case "html":
          return text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
        case "hex":
          return Array.from(text)
            .map((char) => char.charCodeAt(0).toString(16).padStart(2, "0"))
            .join("");
        case "binary":
          return Array.from(text)
            .map((char) => char.charCodeAt(0).toString(2).padStart(8, "0"))
            .join(" ");
        case "rot13":
          return text.replace(/[a-zA-Z]/g, (char) => {
            const code = char.charCodeAt(0);
            const isUpperCase = code >= 65 && code <= 90;
            const base = isUpperCase ? 65 : 97;
            return String.fromCharCode(((code - base + 13) % 26) + base);
          });
        case "caesar":
          return text.replace(/[a-zA-Z]/g, (char) => {
            const code = char.charCodeAt(0);
            const isUpperCase = code >= 65 && code <= 90;
            const base = isUpperCase ? 65 : 97;
            return String.fromCharCode(((code - base + 3) % 26) + base);
          });
        default:
          return text;
      }
    } catch {
      toast.error("Error encoding text");
      return "";
    }
  };

  const decodeText = (text: string, type: string): string => {
    try {
      switch (type) {
        case "base64":
          return atob(text);
        case "url":
          return decodeURIComponent(text);
        case "html": {
          const div = document.createElement("div");
          div.innerHTML = text;
          return div.textContent || div.innerText || "";
        }
        case "hex":
          return (
            text
              .match(/.{1,2}/g)
              ?.map((byte) => String.fromCharCode(parseInt(byte, 16)))
              .join("") || ""
          );
        case "binary":
          return text
            .split(" ")
            .map((binary) => String.fromCharCode(parseInt(binary, 2)))
            .join("");
        case "rot13":
          return text.replace(/[a-zA-Z]/g, (char) => {
            const code = char.charCodeAt(0);
            const isUpperCase = code >= 65 && code <= 90;
            const base = isUpperCase ? 65 : 97;
            return String.fromCharCode(((code - base + 13) % 26) + base);
          });
        case "caesar":
          return text.replace(/[a-zA-Z]/g, (char) => {
            const code = char.charCodeAt(0);
            const isUpperCase = code >= 65 && code <= 90;
            const base = isUpperCase ? 65 : 97;
            return String.fromCharCode(((code - base + 23) % 26) + base);
          });
        default:
          return text;
      }
    } catch {
      toast.error("Error decoding text");
      return "";
    }
  };

  useEffect(() => {
    if (inputText) {
      const result =
        mode === "encode"
          ? encodeText(inputText, encodingType)
          : decodeText(inputText, encodingType);
      setOutputText(result);
    } else {
      setOutputText("");
    }
  }, [inputText, encodingType, mode]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const swapTexts = () => {
    const tempInput = inputText;
    const tempOutput = outputText;
    setMode(mode === "encode" ? "decode" : "encode");
    setInputText(tempOutput);
    setOutputText(tempInput);
  };

  const clearTexts = () => {
    setInputText("");
    setOutputText("");
  };

  const handleProcess = () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to process");
      return;
    }
  };

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Encoding Type"
            value={encodingType}
            onChange={setEncodingType}
            options={encodingTypes}
          />
          <Select
            label="Mode"
            value={mode}
            onChange={(value) => setMode(value as "encode" | "decode")}
            options={modes}
          />
        </div>
      </div>

      {/* Input */}
      <div className="bg-dark-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Input Text</h3>
          <div className="flex gap-2">
            <Button onClick={clearTexts} variant="outline" size="sm">
              Clear
            </Button>
            <Button onClick={handleProcess} variant="primary" size="sm">
              {mode === "encode" ? "Encode" : "Decode"}
            </Button>
          </div>
        </div>

        <Textarea
          value={inputText}
          onChange={setInputText}
          placeholder={`Enter text to ${mode}...`}
          rows={6}
        />
      </div>

      {/* Output */}
      <div className="bg-dark-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Output Text</h3>
          <div className="flex gap-2">
            <Button
              onClick={() => copyToClipboard(outputText)}
              variant="outline"
              size="sm"
              disabled={!outputText}
            >
              Copy
            </Button>
            <Button onClick={swapTexts} variant="secondary" size="sm">
              Swap
            </Button>
          </div>
        </div>

        <Textarea
          value={outputText}
          onChange={() => {}} // Read-only
          placeholder={`${mode === "encode" ? "Encoded" : "Decoded"} text will appear here...`}
          rows={6}
          disabled
        />
      </div>

      {/* Information */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">
          About {encodingType.toUpperCase()}
        </h3>
        <div className="text-gray-300 space-y-2">
          {encodingType === "base64" && (
            <p>
              Base64 is a group of binary-to-text encoding schemes that
              represent binary data in an ASCII string format by translating it
              into a radix-64 representation.
            </p>
          )}
          {encodingType === "url" && (
            <p>
              URL encoding converts characters that are not allowed in URLs into
              their percent-encoded equivalents.
            </p>
          )}
          {encodingType === "html" && (
            <p>
              HTML entity encoding converts special characters to their HTML
              entity equivalents to prevent XSS attacks.
            </p>
          )}
          {encodingType === "hex" && (
            <p>
              Hexadecimal encoding represents each character as its ASCII value
              in hexadecimal format.
            </p>
          )}
          {encodingType === "binary" && (
            <p>
              Binary encoding represents each character as its ASCII value in
              binary format (8 bits per character).
            </p>
          )}
          {encodingType === "rot13" && (
            <p>
              ROT13 is a simple letter substitution cipher that replaces a
              letter with the 13th letter after it in the alphabet.
            </p>
          )}
          {encodingType === "caesar" && (
            <p>
              Caesar cipher is a substitution cipher where each letter is
              shifted by a fixed number of positions in the alphabet (shift of
              3).
            </p>
          )}
        </div>
      </div>

      {/* Quick Examples */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Base64</h4>
            <div className="text-sm text-gray-400">
              <div>Hello → SGVsbG8=</div>
              <div>World → V29ybGQ=</div>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">URL Encoding</h4>
            <div className="text-sm text-gray-400">
              <div>Hello World → Hello%20World</div>
              <div>@#$% → %40%23%24%25</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncoderDecoder;
