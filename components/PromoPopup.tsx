'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Phone, Heart, Home } from 'lucide-react';
import { Button } from './ui/button';

const STORAGE_KEY = 'promo_popup_dismissed';

export default function PromoPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show again in the same session if already dismissed
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const timer = setTimeout(() => setVisible(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, '1');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={dismiss}
    >
      {/* Card — stop click from closing when clicking inside */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-sky-500 to-sky-400" />

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Icon */}
          <div className="w-14 h-14 bg-sky-50 rounded-2xl flex items-center justify-center mb-5">
            <Heart className="w-7 h-7 text-sky-500" />
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2 leading-snug">
            Start Your Health Journey Today
          </h2>

          {/* Body */}
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
            Regular health checkups help detect diseases early. Book your preventive health package today at{' '}
            <span className="font-semibold text-slate-800">Sachdeva Diagnostics Pvt Ltd.</span>
          </p>

          {/* Home collection badge */}
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-5 w-fit">
            <Home className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-green-700">Home Collection Available</span>
          </div>

          {/* Phone numbers */}
          <div className="flex flex-wrap gap-3 mb-6">
            {['+91 9911-380288', '+91 9811-582086'].map((num) => (
              <a
                key={num}
                href={`tel:${num.replace(/[\s\-]/g, '')}`}
                className="flex items-center gap-1.5 bg-sky-50 border border-sky-200 text-sky-700 font-semibold text-sm px-3 py-1.5 rounded-lg hover:bg-sky-100 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                {num}
              </a>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/tests" className="flex-1" onClick={dismiss}>
              <Button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl">
                Book Health Package
              </Button>
            </Link>
            <Button
              variant="outline"
              className="flex-1 border-slate-300 text-slate-600 font-semibold rounded-xl hover:bg-slate-50"
              onClick={dismiss}
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
