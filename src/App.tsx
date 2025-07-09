import { useEffect } from "react";
import { useAppStore } from "./stores/useAppStore";
import Header from "./components/Layout/Header";
import InstallPrompt from "./components/Layout/InstallPrompt";
import Router from "./components/Layout/Router";

function App() {
  const { setPWAState } = useAppStore();

  useEffect(() => {
    const isStandalone = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;

    const isInstalled =
      isStandalone ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    setPWAState({ isStandalone, isInstalled });

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPWAState({
        deferredPrompt: e,
        showInstallPrompt: true,
      });
    };

    const handleAppInstalled = () => {
      setPWAState({
        isInstalled: true,
        showInstallPrompt: false,
        deferredPrompt: null,
      });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [setPWAState]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 to-dark-900 text-gray-100">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Header />
        <InstallPrompt />
        <main className="mt-8">
          <Router />
        </main>
      </div>
    </div>
  );
}

export default App;
