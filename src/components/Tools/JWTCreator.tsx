import React, { useState } from "react";
import { toast } from "sonner";
import Button from "../UI/Button";
import Input from "../UI/Input";
import Textarea from "../UI/Textarea";
import Select from "../UI/Select";
import type { JWTHeader, JWTPayload } from "../../types";

const JWTCreator: React.FC = () => {
  const [header, setHeader] = useState<JWTHeader>({
    alg: "HS256",
    typ: "JWT",
  });
  const [payload, setPayload] = useState<JWTPayload>({
    sub: "user123",
    name: "John Doe",
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  });
  const [secret, setSecret] = useState("");
  const [token, setToken] = useState("");
  const [decodedToken, setDecodedToken] = useState<{
    header: JWTHeader;
    payload: JWTPayload;
    signature: string;
  } | null>(null);
  const [tokenToDecode, setTokenToDecode] = useState("");

  const algorithms = [
    { value: "HS256", label: "HMAC SHA256" },
    { value: "HS384", label: "HMAC SHA384" },
    { value: "HS512", label: "HMAC SHA512" },
    { value: "none", label: "None (Unsecured)" },
  ];

  const generateToken = async () => {
    try {
      if (!secret && header.alg !== "none") {
        toast.error("Secret key is required for signed tokens");
        return;
      }

      const headerB64 = btoa(JSON.stringify(header));
      const payloadB64 = btoa(JSON.stringify(payload));

      let signature = "";
      if (header.alg !== "none") {
        // For demo purposes, we'll use a simple hash
        // In production, you'd want to use a proper JWT library
        const data = `${headerB64}.${payloadB64}`;
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secret);
        const messageData = encoder.encode(data);

        const cryptoKey = await crypto.subtle.importKey(
          "raw",
          keyData,
          { name: "HMAC", hash: "SHA-256" },
          false,
          ["sign"]
        );

        const signatureBuffer = await crypto.subtle.sign(
          "HMAC",
          cryptoKey,
          messageData
        );
        signature = btoa(
          String.fromCharCode(...new Uint8Array(signatureBuffer))
        );
      }

      const generatedToken = `${headerB64}.${payloadB64}.${signature}`;
      setToken(generatedToken);

      // addToHistory(
      //   "jwt",
      //   "Generated JWT token",
      //   { header, payload },
      //   { token: generatedToken }
      // );
      toast.success("JWT token generated successfully");
    } catch {
      toast.error("Error generating JWT token");
    }
  };

  const decodeToken = () => {
    try {
      const parts = tokenToDecode.split(".");
      if (parts.length !== 3) {
        toast.error("Invalid JWT token format");
        return;
      }

      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      const signature = parts[2];

      setDecodedToken({ header, payload, signature });
      // addToHistory(
      //   "jwt",
      //   "Decoded JWT token",
      //   { token: tokenToDecode },
      //   { header, payload, signature }
      // );
      toast.success("JWT token decoded successfully");
    } catch {
      toast.error("Error decoding JWT token");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const addClaim = () => {
    const key = prompt("Enter claim key:");
    const value = prompt("Enter claim value:");
    if (key && value) {
      setPayload((prev) => ({ ...prev, [key]: value }));
    }
  };

  const removeClaim = (key: string) => {
    setPayload((prev) => {
      const newPayload = { ...prev };
      delete newPayload[key];
      return newPayload;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Configuration */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Header Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Algorithm"
            value={header.alg}
            onChange={(value) => setHeader((prev) => ({ ...prev, alg: value }))}
            options={algorithms}
          />
          <Input
            label="Type"
            value={header.typ}
            onChange={(value) => setHeader((prev) => ({ ...prev, typ: value }))}
            placeholder="JWT"
          />
        </div>
      </div>

      {/* Payload Configuration */}
      <div className="bg-dark-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Payload Claims</h3>
          <Button onClick={addClaim} variant="outline" size="sm">
            Add Claim
          </Button>
        </div>

        <div className="space-y-4">
          {Object.entries(payload).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4">
              <Input
                label="Key"
                value={key}
                onChange={() => {}} // Read-only for now
                disabled
                className="flex-1"
              />
              <Input
                label="Value"
                value={String(value)}
                onChange={(value) =>
                  setPayload((prev) => ({ ...prev, [key]: value }))
                }
                className="flex-1"
              />
              <Button
                onClick={() => removeClaim(key)}
                variant="danger"
                size="sm"
                className="mt-6"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Secret Key */}
      <div className="bg-dark-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Secret Key</h3>
        <Input
          label="Secret Key"
          value={secret}
          onChange={setSecret}
          type="password"
          placeholder="Enter your secret key"
          disabled={header.alg === "none"}
        />
        {header.alg === "none" && (
          <p className="text-yellow-500 text-sm mt-2">
            Warning: Using unsecured JWT (no signature)
          </p>
        )}
      </div>

      {/* Generate Token */}
      <div className="bg-dark-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Generated Token</h3>
          <Button onClick={generateToken} variant="primary">
            Generate Token
          </Button>
        </div>

        {token && (
          <div className="space-y-4">
            <Textarea
              value={token}
              onChange={() => {}} // Read-only
              rows={3}
              disabled
            />
            <Button
              onClick={() => copyToClipboard(token)}
              variant="outline"
              size="sm"
            >
              Copy Token
            </Button>
          </div>
        )}
      </div>

      {/* Decode Token */}
      <div className="bg-dark-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Decode Token</h3>
          <Button onClick={decodeToken} variant="secondary">
            Decode Token
          </Button>
        </div>

        <Textarea
          label="JWT Token to Decode"
          value={tokenToDecode}
          onChange={setTokenToDecode}
          placeholder="Paste your JWT token here"
          rows={3}
        />

        {decodedToken && (
          <div className="mt-4 space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Header</h4>
              <pre className="bg-dark-900 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(decodedToken.header, null, 2)}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Payload</h4>
              <pre className="bg-dark-900 p-4 rounded-lg overflow-x-auto text-sm">
                {JSON.stringify(decodedToken.payload, null, 2)}
              </pre>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Signature</h4>
              <pre className="bg-dark-900 p-4 rounded-lg overflow-x-auto text-sm">
                {decodedToken.signature}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JWTCreator;
