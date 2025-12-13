"use client";

import { useState } from "react";
import { MapPin, X } from "lucide-react";

interface LocationPermissionDialogProps {
  onAllow: () => void;
  onDeny: () => void;
}

export function LocationPermissionDialog({
  onAllow,
  onDeny,
}: LocationPermissionDialogProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-scaleIn">
        {/* Header */}
        <div className="bg-gradient-to-br from-[#62a4ee] to-[#afd0f8] p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-white/20 backdrop-blur-sm w-14 h-14 rounded-full flex items-center justify-center">
              <MapPin className="size-7" />
            </div>
            <button
              onClick={() => {
                setIsVisible(false);
                onDeny();
              }}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="size-6" />
            </button>
          </div>
          <h2 className="text-2xl font-bold">Location Permission</h2>
          <p className="text-white/90 mt-2">
            Allow weather app to access your location?
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="bg-blue-50 rounded-full p-2 mt-1">
                <MapPin className="size-4 text-[#2B7FFF]" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">
                  Accurate Weather Data
                </h3>
                <p className="text-sm text-neutral-600">
                  Get precise weather information for your exact location
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-blue-50 rounded-full p-2 mt-1">
                <svg
                  className="size-4 text-[#2B7FFF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 mb-1">
                  Your Privacy Matters
                </h3>
                <p className="text-sm text-neutral-600">
                  We only use your location to show weather data
                </p>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => {
                setIsVisible(false);
                onAllow();
              }}
              className="w-full bg-gradient-to-r from-[#2B7FFF] to-[#51a2ff] text-white font-semibold py-3 px-6 rounded-xl hover:shadow-lg transition-all hover:scale-105"
            >
              Allow Location Access
            </button>
            <button
              onClick={() => {
                setIsVisible(false);
                onDeny();
              }}
              className="w-full bg-neutral-100 text-neutral-700 font-semibold py-3 px-6 rounded-xl hover:bg-neutral-200 transition-all"
            >
              Use Default Location (Tân Bình)
            </button>
          </div>

          <p className="text-xs text-neutral-500 text-center mt-4">
            You can change this setting anytime
          </p>
        </div>
      </div>
    </div>
  );
}
