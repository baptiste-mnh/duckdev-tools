import React from "react";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./Dashboard";
import ToolLayout from "../Layout/ToolLayout";
import JWTCreator from "../Tools/JWTCreator";
import PasswordGenerator from "../Tools/PasswordGenerator";
import EncoderDecoder from "../Tools/EncoderDecoder";
import ColorPalette from "../Tools/ColorPalette";
import RegexTester from "../Tools/RegexTester";
import LogoCreator from "../Tools/LogoCreator";
import type { Tool } from "../../types";

const tools: Tool[] = [
  {
    id: "jwt",
    name: "JWT Creator",
    description:
      "Create and decode JWT tokens with different signature algorithms",
    icon: "🔐",
    category: "generators",
    component: JWTCreator,
  },
  {
    id: "password",
    name: "Password Generator",
    description: "Generate secure passwords with customizable criteria",
    icon: "🔑",
    category: "generators",
    component: PasswordGenerator,
  },
  {
    id: "encoder",
    name: "Encoder/Decoder",
    description: "Encode and decode your data in Base64, URL, HTML and more",
    icon: "🔄",
    category: "converters",
    component: EncoderDecoder,
  },
  {
    id: "colors",
    name: "Color Palette",
    description: "Create harmonious color palettes with CSS export",
    icon: "🎨",
    category: "generators",
    component: ColorPalette,
  },
  {
    id: "regex",
    name: "Regex Tester",
    description: "Test and validate your regular expressions in real-time",
    icon: "🔍",
    category: "analyzers",
    component: RegexTester,
  },
  {
    id: "logo",
    name: "Logo Creator",
    description:
      "Generate app logos from a PNG with format, border, rounding, etc. options",
    icon: "🖼️",
    category: "image",
    component: LogoCreator,
  },
];

const Router: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Dashboard tools={tools} />} />
        <Route
          path="/jwt"
          element={
            <ToolLayout tool={tools.find((t) => t.id === "jwt")!}>
              <JWTCreator />
            </ToolLayout>
          }
        />
        <Route
          path="/password"
          element={
            <ToolLayout tool={tools.find((t) => t.id === "password")!}>
              <PasswordGenerator />
            </ToolLayout>
          }
        />
        <Route
          path="/encoder"
          element={
            <ToolLayout tool={tools.find((t) => t.id === "encoder")!}>
              <EncoderDecoder />
            </ToolLayout>
          }
        />
        <Route
          path="/colors"
          element={
            <ToolLayout tool={tools.find((t) => t.id === "colors")!}>
              <ColorPalette />
            </ToolLayout>
          }
        />
        <Route
          path="/regex"
          element={
            <ToolLayout tool={tools.find((t) => t.id === "regex")!}>
              <RegexTester />
            </ToolLayout>
          }
        />
        <Route
          path="/logo"
          element={
            <ToolLayout tool={tools.find((t) => t.id === "logo")!}>
              <LogoCreator />
            </ToolLayout>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default Router;
