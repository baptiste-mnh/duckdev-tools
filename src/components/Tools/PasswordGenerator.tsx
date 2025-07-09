import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Checkbox from "../UI/Checkbox";

const PasswordGenerator: React.FC = () => {
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const characters = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    numbers: "0123456789",
    symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  };

  const similarChars = "il1Lo0O";
  const ambiguousChars = "{}[]()/\\'\"`~,;:.<>";

  const calculateStrength = useCallback((password: string): number => {
    let score = 0;

    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    return Math.min(score, 7);
  }, []);

  const generatePassword = () => {
    let availableChars = "";

    if (options.uppercase) availableChars += characters.uppercase;
    if (options.lowercase) availableChars += characters.lowercase;
    if (options.numbers) availableChars += characters.numbers;
    if (options.symbols) availableChars += characters.symbols;

    if (availableChars === "") {
      toast.error("Please select at least one character type");
      return;
    }

    if (excludeSimilar) {
      availableChars = availableChars
        .split("")
        .filter((char) => !similarChars.includes(char))
        .join("");
    }

    if (excludeAmbiguous) {
      availableChars = availableChars
        .split("")
        .filter((char) => !ambiguousChars.includes(char))
        .join("");
    }

    let password = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);

    for (let i = 0; i < length; i++) {
      password += availableChars[array[i] % availableChars.length];
    }

    // Ensure at least one character from each selected type
    if (options.uppercase && !/[A-Z]/.test(password)) {
      const randomUpper =
        characters.uppercase[
          Math.floor(Math.random() * characters.uppercase.length)
        ];
      const randomIndex = Math.floor(Math.random() * length);
      password =
        password.slice(0, randomIndex) +
        randomUpper +
        password.slice(randomIndex + 1);
    }

    if (options.lowercase && !/[a-z]/.test(password)) {
      const randomLower =
        characters.lowercase[
          Math.floor(Math.random() * characters.lowercase.length)
        ];
      const randomIndex = Math.floor(Math.random() * length);
      password =
        password.slice(0, randomIndex) +
        randomLower +
        password.slice(randomIndex + 1);
    }

    if (options.numbers && !/[0-9]/.test(password)) {
      const randomNumber =
        characters.numbers[
          Math.floor(Math.random() * characters.numbers.length)
        ];
      const randomIndex = Math.floor(Math.random() * length);
      password =
        password.slice(0, randomIndex) +
        randomNumber +
        password.slice(randomIndex + 1);
    }

    if (options.symbols && !/[^A-Za-z0-9]/.test(password)) {
      const randomSymbol =
        characters.symbols[
          Math.floor(Math.random() * characters.symbols.length)
        ];
      const randomIndex = Math.floor(Math.random() * length);
      password =
        password.slice(0, randomIndex) +
        randomSymbol +
        password.slice(randomIndex + 1);
    }

    setGeneratedPassword(password);
    const strength = calculateStrength(password);
    setPasswordStrength(strength);

    // The original code had addToHistory, but it was removed from imports.
    // Assuming it's no longer needed or will be re-added if the user intends.
    // For now, removing it as per the new_code's removal of useAppStore.
    // If addToHistory is truly gone, this section will need to be removed or refactored.
    // Based on the new_code, addToHistory is removed from imports.
    // Therefore, the line `addToHistory( ... )` is removed.

    toast.success("Password generated successfully");
  };

  const copyToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      toast.success("Password copied to clipboard");
    }
  };

  const getStrengthLabel = (strength: number): string => {
    if (strength <= 2) return "Very Weak";
    if (strength <= 3) return "Weak";
    if (strength <= 4) return "Fair";
    if (strength <= 5) return "Good";
    if (strength <= 6) return "Strong";
    return "Very Strong";
  };

  const getStrengthColor = (strength: number): string => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-orange-500";
    if (strength <= 4) return "bg-yellow-500";
    if (strength <= 5) return "bg-blue-500";
    if (strength <= 6) return "bg-green-500";
    return "bg-emerald-500";
  };

  return (
    <div className="space-y-6">
      {/* Length Configuration */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Password Length</h3>
        <div className="flex items-center gap-4">
          <Input
            type="number"
            value={length.toString()}
            onChange={(value) => setLength(parseInt(value) || 8)}
            className="w-32"
          />
          <span className="text-gray-400">characters (4-128)</span>
        </div>
      </div>

      {/* Character Options */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Character Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Checkbox
            label="Uppercase letters (A-Z)"
            checked={options.uppercase}
            onChange={(checked) =>
              setOptions((prev) => ({ ...prev, uppercase: checked }))
            }
          />
          <Checkbox
            label="Lowercase letters (a-z)"
            checked={options.lowercase}
            onChange={(checked) =>
              setOptions((prev) => ({ ...prev, lowercase: checked }))
            }
          />
          <Checkbox
            label="Numbers (0-9)"
            checked={options.numbers}
            onChange={(checked) =>
              setOptions((prev) => ({ ...prev, numbers: checked }))
            }
          />
          <Checkbox
            label="Symbols (!@#$%^&*)"
            checked={options.symbols}
            onChange={(checked) =>
              setOptions((prev) => ({ ...prev, symbols: checked }))
            }
          />
        </div>
      </div>

      {/* Exclusion Options */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Exclusion Options</h3>
        <div className="space-y-4">
          <Checkbox
            label="Exclude similar characters (i, l, 1, L, o, 0, O)"
            checked={excludeSimilar}
            onChange={setExcludeSimilar}
          />
          <Checkbox
            label="Exclude ambiguous characters"
            checked={excludeAmbiguous}
            onChange={setExcludeAmbiguous}
          />
        </div>
      </div>

      {/* Generate Button */}
      <div className="bg-dark-800 rounded-lg p-6">
        <Button onClick={generatePassword} variant="primary" fullWidth>
          Generate Password
        </Button>
      </div>

      {/* Generated Password */}
      {generatedPassword && (
        <div className="bg-dark-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Generated Password</h3>

          <div className="space-y-4">
            <div className="bg-dark-900 p-4 rounded-lg">
              <code className="text-lg break-all">{generatedPassword}</code>
            </div>

            <div className="flex gap-2">
              <Button onClick={copyToClipboard} variant="outline">
                Copy Password
              </Button>
              <Button onClick={generatePassword} variant="secondary">
                Generate New
              </Button>
            </div>

            {/* Strength Indicator */}
            <div className="mt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Password Strength:</span>
                <span className="text-sm">
                  {getStrengthLabel(passwordStrength)}
                </span>
              </div>
              <div className="w-full bg-dark-900 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getStrengthColor(passwordStrength)}`}
                  style={{ width: `${(passwordStrength / 7) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Password Statistics */}
      {generatedPassword && (
        <div className="bg-dark-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Password Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">
                {generatedPassword.length}
              </div>
              <div className="text-gray-400">Length</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">
                {generatedPassword.match(/[A-Z]/g)?.length || 0}
              </div>
              <div className="text-gray-400">Uppercase</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {generatedPassword.match(/[0-9]/g)?.length || 0}
              </div>
              <div className="text-gray-400">Numbers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {generatedPassword.match(/[^A-Za-z0-9]/g)?.length || 0}
              </div>
              <div className="text-gray-400">Symbols</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordGenerator;
