import { X, Download, Smartphone, Monitor } from "lucide-react";
import { usePWA } from "../../hooks/usePWA";

export default function InstallPrompt() {
  const {
    showInstallPrompt,
    canInstall,
    isStandalone,
    installApp,
    dismissInstallPrompt,
  } = usePWA();

  if (!showInstallPrompt || !canInstall || isStandalone) {
    return null;
  }
  return (
    <div className="mt-6 animate-bounce-in">
      <div className="relative glass-effect border-2 border-primary-500/30 rounded-2xl p-6 backdrop-blur-md">
        <button
          onClick={dismissInstallPrompt}
          className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center">
            <Download className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              Install DuckDev Tools
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Install the app for quick access, optimized performance, and
              offline usage.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Monitor className="w-4 h-4 text-primary-400" />
                <span>Quick access from the desktop</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <Smartphone className="w-4 h-4 text-primary-400" />
                <span>Works offline</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-300">
                <span className="w-4 h-4 text-primary-400">⚡</span>
                <span>Optimized performance</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={installApp}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white rounded-lg transition-all duration-200 font-medium"
              >
                <Download className="w-4 h-4" />
                <span>Installer</span>
              </button>

              <button
                onClick={dismissInstallPrompt}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-gray-300 hover:text-white rounded-lg transition-colors duration-200"
              >
                Later
              </button>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-2xl pointer-events-none"></div>
      </div>
    </div>
  );
}
