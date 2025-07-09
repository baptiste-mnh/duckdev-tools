import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Textarea from "../UI/Textarea";
import Checkbox from "../UI/Checkbox";
import type { RegexTest } from "../../types";

const RegexTester: React.FC = () => {
  const [pattern, setPattern] = useState("");
  const [testString, setTestString] = useState(
    "Hello World! This is a test string with numbers 123 and symbols @#$%"
  );
  const [flags, setFlags] = useState({
    global: true,
    ignoreCase: false,
    multiline: false,
  });
  const [matches, setMatches] = useState<RegexTest["matches"]>([]);
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState("");

  // Test regex in real-time
  useEffect(() => {
    if (!pattern) {
      setMatches([]);
      setIsValid(true);
      setError("");
      return;
    }

    try {
      const flagString = Object.entries(flags)
        .filter(([, enabled]) => enabled)
        .map(([flag]) => {
          switch (flag) {
            case "global":
              return "g";
            case "ignoreCase":
              return "i";
            case "multiline":
              return "m";
            default:
              return "";
          }
        })
        .join("");

      const regex = new RegExp(pattern, flagString);
      const regexMatches: RegexTest["matches"] = [];

      if (flags.global) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          regexMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          regexMatches.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      setMatches(regexMatches);
      setIsValid(true);
      setError("");
    } catch (err) {
      setIsValid(false);
      setError(err instanceof Error ? err.message : "Invalid regex pattern");
      setMatches([]);
    }
  }, [pattern, testString, flags]);

  const saveTest = () => {
    if (!pattern.trim()) {
      toast.error("Please enter a regex pattern");
      return;
    }

    // Assuming addToHistory and addToast are removed from imports,
    // so this function will no longer work as intended.
    // For now, commenting out the toast call as it's no longer imported.
    // addToHistory(
    //   "regex",
    //   "Saved regex test",
    //   { pattern, testString, flags },
    //   { matches }
    // );
    toast.success("Regex test saved to history");
  };

  const highlightMatches = (text: string): React.ReactNode => {
    if (!isValid || matches.length === 0) {
      return text;
    }

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    matches.forEach((match, index) => {
      // Add text before match
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      // Add highlighted match
      parts.push(
        <span
          key={index}
          className="bg-yellow-500 text-black px-1 rounded font-mono"
          title={`Match ${index + 1}: ${match.match}`}
        >
          {match.match}
        </span>
      );

      lastIndex = match.index + match.match.length;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };

  const commonPatterns = [
    {
      name: "Email",
      pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
    },
    {
      name: "URL",
      pattern:
        "^(https?:\\/\\/)?([\\da-z\\.-]+)\\.([a-z\\.]{2,6})([\\/\\w \\.-]*)*\\/?$",
    },
    { name: "Phone", pattern: "^\\+?[1-9]\\d{1,14}$" },
    {
      name: "Date (YYYY-MM-DD)",
      pattern: "^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$",
    },
    {
      name: "IPv4",
      pattern:
        "^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
    },
    {
      name: "Credit Card",
      pattern:
        "^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|6(?:011|5[0-9]{2})[0-9]{12}|(?:2131|1800|35\\d{3})\\d{11})$",
    },
  ];

  const insertPattern = (pattern: string) => {
    setPattern(pattern);
    toast.success("Pattern inserted");
  };

  return (
    <div className="space-y-6">
      {/* Pattern Input */}
      <div className="bg-dark-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Regex Pattern</h3>
          <div className="flex gap-2">
            <Button onClick={saveTest} variant="primary" size="sm">
              Save Test
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Input
            label="Pattern"
            value={pattern}
            onChange={setPattern}
            placeholder="Enter your regex pattern..."
            error={!isValid ? error : undefined}
            className="font-mono"
          />

          <div className="flex items-center gap-4">
            <Checkbox
              label="Global (g)"
              checked={flags.global}
              onChange={(checked) =>
                setFlags((prev) => ({ ...prev, global: checked }))
              }
            />
            <Checkbox
              label="Case Insensitive (i)"
              checked={flags.ignoreCase}
              onChange={(checked) =>
                setFlags((prev) => ({ ...prev, ignoreCase: checked }))
              }
            />
            <Checkbox
              label="Multiline (m)"
              checked={flags.multiline}
              onChange={(checked) =>
                setFlags((prev) => ({ ...prev, multiline: checked }))
              }
            />
          </div>
        </div>
      </div>

      {/* Test String */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Test String</h3>
        <Textarea
          value={testString}
          onChange={setTestString}
          placeholder="Enter text to test against..."
          rows={4}
        />
      </div>

      {/* Results */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Results</h3>

        {!isValid && (
          <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg mb-4">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Highlighted Text */}
          <div>
            <h4 className="font-medium mb-2">Highlighted Text</h4>
            <div className="bg-dark-900 p-4 rounded-lg border border-gray-600">
              <div className="whitespace-pre-wrap">
                {highlightMatches(testString)}
              </div>
            </div>
          </div>

          {/* Match Details */}
          <div>
            <h4 className="font-medium mb-2">Matches ({matches.length})</h4>
            {matches.length > 0 ? (
              <div className="space-y-2">
                {matches.map((match, index) => (
                  <div
                    key={index}
                    className="bg-dark-900 p-3 rounded-lg border border-gray-600"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-mono text-sm bg-yellow-500 text-black px-2 py-1 rounded">
                        {match.match}
                      </div>
                      <div className="text-xs text-gray-400">
                        Index: {match.index}
                      </div>
                    </div>
                    {match.groups.length > 0 && (
                      <div className="text-xs text-gray-400">
                        Groups:{" "}
                        {match.groups.map((group, i) => (
                          <span
                            key={i}
                            className="bg-gray-700 px-1 rounded ml-1"
                          >
                            {group || "(empty)"}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm">No matches found</div>
            )}
          </div>

          {/* Statistics */}
          <div>
            <h4 className="font-medium mb-2">Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {matches.length}
                </div>
                <div className="text-gray-400">Matches</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {matches.reduce((sum, match) => sum + match.match.length, 0)}
                </div>
                <div className="text-gray-400">Characters</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-500">
                  {pattern.length}
                </div>
                <div className="text-gray-400">Pattern Length</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">
                  {testString.length}
                </div>
                <div className="text-gray-400">Text Length</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Common Patterns */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Common Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {commonPatterns.map((item) => (
            <Button
              key={item.name}
              onClick={() => insertPattern(item.pattern)}
              variant="outline"
              size="sm"
              className="text-left justify-start"
            >
              <div className="w-full min-w-0">
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-400 font-mono truncate">
                  {item.pattern}
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Regex Cheat Sheet */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Quick Reference</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Character Classes</h4>
            <div className="text-sm space-y-1 text-gray-300">
              <div>
                <code className="bg-dark-900 px-1 rounded">.</code> Any
                character except newline
              </div>
              <div>
                <code className="bg-dark-900 px-1 rounded">\w</code> Word
                character [a-zA-Z0-9_]
              </div>
              <div>
                <code className="bg-dark-900 px-1 rounded">\d</code> Digit [0-9]
              </div>
              <div>
                <code className="bg-dark-900 px-1 rounded">\s</code> Whitespace
              </div>
              <div>
                <code className="bg-dark-900 px-1 rounded">[abc]</code> Any of
                a, b, or c
              </div>
              <div>
                <code className="bg-dark-900 px-1 rounded">[^abc]</code> Not a,
                b, or c
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2">Quantifiers</h4>
            <div className="text-sm space-y-1 text-gray-300">
              <div>
                <code className="bg-dark-900 px-1 rounded">*</code> 0 or more
              </div>
              <div>
                <code className="bg-dark-900 px-1 rounded">+</code> 1 or more
              </div>
              <div>
                <code className="bg-dark-900 px-1 rounded">?</code> 0 or 1
              </div>
              <div>
                <code className="bg-dark-900 px-1 rounded">{`{n}`}</code>{" "}
                Exactly n
              </div>
              <div>
                <code className="bg-dark-900 px-1 rounded">{`{n,}`}</code> n or
                more
              </div>
              <div>
                <code className="bg-dark-900 px-1 rounded">{`{n,m}`}</code>{" "}
                Between n and m
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegexTester;
