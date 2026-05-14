/** @format */

import React, { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes("android-app://");
    setIsStandalone(standalone);

    // Check if iOS
    const iOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(iOS);

    // Listen for beforeinstallprompt event (Android/Desktop)
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Show iOS prompt if on iOS and not standalone
    if (iOS && !standalone) {
      // Show iOS instructions after a delay
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    }

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("User accepted the install prompt");
    }

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem("installPromptDismissed", "true");
  };

  // Don't show if already installed or dismissed
  if (
    isStandalone ||
    !showPrompt ||
    sessionStorage.getItem("installPromptDismissed")
  ) {
    return null;
  }

  if (isIOS) {
    return (
      <div className='install-prompt ios'>
        <div className='install-prompt-content'>
          <button className='close-prompt' onClick={handleDismiss}>
            ✕
          </button>
          <h3>📱 Install Golf Tracker</h3>
          <p>Add this app to your Home Screen for quick access:</p>
          <ol>
            <li>
              Tap the <strong>Share</strong> button{" "}
              <span className='ios-icon'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='16'
                  height='20'
                  viewBox='0 0 16 20'>
                  <path
                    fill='currentColor'
                    d='M8 0l4 4h-3v9H7V4H4l4-4zm8 14v6H0v-6h2v4h12v-4h2z'
                  />
                </svg>
              </span>
            </li>
            <li>
              Scroll and tap <strong>"Add to Home Screen"</strong>
            </li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div className='install-prompt android'>
      <div className='install-prompt-content'>
        <button className='close-prompt' onClick={handleDismiss}>
          ✕
        </button>
        <h3>📱 Install Golf Tracker</h3>
        <p>Add this app to your home screen for quick access!</p>
        <button className='install-button' onClick={handleInstallClick}>
          Install App
        </button>
      </div>
    </div>
  );
}
