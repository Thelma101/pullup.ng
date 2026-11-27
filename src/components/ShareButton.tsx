"use client";

import { useState } from "react";
import type { Night } from "@/lib/types";
import { formatNightLabel, formatNaira } from "@/lib/nights";

type ShareButtonProps = {
  night: Night;
};

export function ShareButton({ night }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "https://gopullup.ng";
  const nightUrl = `${siteUrl}/nights/${night.id}`;
  const nightLabel = formatNightLabel(night);
  const shareText = `PullUp for ${nightLabel} · ${formatNaira(night.feeNaira)}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(nightUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleShare = (platform: "twitter" | "whatsapp" | "facebook") => {
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(nightUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${nightUrl}`)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(nightUrl)}`,
    };

    window.open(urls[platform], "_blank", "width=600,height=400");
    setShowMenu(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "PullUp",
          text: shareText,
          url: nightUrl,
        });
        setShowMenu(false);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Share failed:", err);
        }
      }
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowMenu(!showMenu)}
        className="btn-ghost flex items-center gap-2 text-sm"
        title="Share this event"
      >
        <span>🔗 Share</span>
      </button>

      {showMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
          <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded-xl border border-line bg-white shadow-lg">
            <div className="p-2">
              {typeof navigator !== "undefined" && navigator.share && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-void transition hover:bg-fog"
                >
                  <span>📱</span>
                  <span>Share via...</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleShare("whatsapp")}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-void transition hover:bg-fog"
              >
                <span>💬</span>
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => handleShare("twitter")}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-void transition hover:bg-fog"
              >
                <span>🐦</span>
                <span>Twitter/X</span>
              </button>

              <button
                type="button"
                onClick={() => handleShare("facebook")}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-void transition hover:bg-fog"
              >
                <span>👍</span>
                <span>Facebook</span>
              </button>

              <div className="my-1 border-t border-line" />

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-void transition hover:bg-fog"
              >
                <span>{copied ? "✅" : "📋"}</span>
                <span>{copied ? "Copied!" : "Copy link"}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
