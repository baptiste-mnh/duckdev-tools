import { useCallback } from "react";
import { toast } from "sonner";
import { useAppStore } from "../stores/useAppStore";

export function usePWA() {
  const { pwa, setPWAState } = useAppStore();

  const installApp = useCallback(async () => {
    if (!pwa.deferredPrompt) {
      toast.error("Installation not available");
      return false;
    }

    try {
      pwa.deferredPrompt.prompt();

      const { outcome } = await pwa.deferredPrompt.userChoice;
      console.log("🚀 ~ installApp ~ outcome:", outcome);
      if (outcome === "accepted") {
        toast.success("Application installed successfully!");
        setPWAState({
          showInstallPrompt: false,
          deferredPrompt: null,
          isInstalled: true,
        });
        return true;
      } else {
        toast.info("Installation cancelled");
        return false;
      }
    } catch (error) {
      console.error("Error during app installation:", error);
      toast.error("Error during app installation");
      return false;
    }
  }, [pwa.deferredPrompt, setPWAState]);

  const dismissInstallPrompt = useCallback(() => {
    setPWAState({ showInstallPrompt: false });
  }, [setPWAState]);

  const canInstall = pwa.deferredPrompt !== null && !pwa.isInstalled;

  const isStandalone = pwa.isStandalone;

  const isInstalled = pwa.isInstalled;

  const isPWASupported =
    "serviceWorker" in navigator && "PushManager" in window;

  return {
    canInstall,
    isStandalone,
    isInstalled,
    isPWASupported,
    showInstallPrompt: pwa.showInstallPrompt,

    installApp,
    dismissInstallPrompt,
  };
}
