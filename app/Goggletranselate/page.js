"use client";
import React, { useEffect } from "react";

export default function GoogleTranslate() {
  useEffect(() => {
    // ntela3 script tea traduction &
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Initialize widget
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "fr",
          includedLanguages: "en,fr,ar",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    // Hide banner and branding
    const style = document.createElement("style");
    style.innerHTML = `
      .goog-te-banner-frame.skiptranslate,
      .goog-te-banner,
      #goog-gt-tt,
      .goog-te-balloon-frame,
      .goog-te-menu-frame,
      iframe[id^=":"] {
        display: none !important;
        visibility: hidden !important;
      }

      body {
        top: 0 !important;
      }

      .goog-logo-link,
      .goog-te-gadget span,
      .goog-te-banner-frame,
      .goog-te-menu-value span[style*="color"] {
        display: none !important;
      }

      .goog-te-gadget {
        font-size: 0 !important;
      }

      .goog-te-gadget select {
        font-size: 14px !important;
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid #ccc;
        background: white;
        color: #333;
        cursor: pointer;
        outline: none;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div id="google_translate_element" style={{ display: "inline-block" }} />
  );
}

