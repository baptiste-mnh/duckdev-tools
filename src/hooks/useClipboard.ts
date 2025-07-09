import { useState, useCallback } from "react";
import { toast } from "sonner";

export function useClipboard() {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    try {
      // Tentative avec l'API moderne
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback pour les navigateurs plus anciens
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (!successful) {
          throw new Error("Fallback copy failed");
        }
      }

      setCopied(true);
      toast.success("Copied to clipboard!");

      // Reset après 2 secondes
      setTimeout(() => setCopied(false), 2000);

      return true;
    } catch (error) {
      console.error("Failed to copy text:", error);
      toast.error("Failed to copy to clipboard");
      return false;
    }
  }, []);

  const readFromClipboard = useCallback(async (): Promise<string | null> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        const text = await navigator.clipboard.readText();
        return text;
      } else {
        // Pas de fallback sécurisé pour la lecture
        toast.error("Lecture du presse-papiers non supportée");
        return null;
      }
    } catch (error) {
      console.error("Failed to read from clipboard:", error);
      toast.error("Erreur lors de la lecture du presse-papiers");
      return null;
    }
  }, []);

  return {
    copied,
    copyToClipboard,
    readFromClipboard,
  };
}
