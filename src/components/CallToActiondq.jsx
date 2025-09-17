// src/components/CallToActiondq.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMarketcallDNI } from "../hooks/useMarketcallDNI";

const qp = (k, d = "") =>
  typeof window === "undefined" ? d : new URLSearchParams(window.location.search).get(k) ?? d;

const digitsOnly = (p) => (p || "").replace(/\D/g, "");
const formatUS = (d) => {
  if (d.length === 11 && d.startsWith("1")) return `(${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7,11)}`;
  if (d.length === 10) return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6,10)}`;
  return d;
};

const DEFAULT_FALLBACK = import.meta?.env?.VITE_DEFAULT_PHONE || "+18662278549";

const CallToActiondq = ({ finalMessage, siteId, campaignId }) => {
  const [time, setTime] = useState(180);

  const paramPhone  = useMemo(() => qp("phone", DEFAULT_FALLBACK), []);
  const baseDigits  = useMemo(() => digitsOnly(paramPhone), [paramPhone]);
  const baseDisplay = useMemo(() => formatUS(baseDigits), [baseDigits]);

  const anchorId = "ctaTel";
  const anchorSelector = `#${anchorId}`;

  // DNI (uses URL -> props -> env order inside the hook)
  useMarketcallDNI({
    selector: anchorSelector,
    fallbackPhone: paramPhone,
    siteId,          // optional: you can pass props OR just rely on env
    campaignId,      // optional
    mask: "(xxx) xxx-xxxx",
  });

  const numberRef = useRef(null);
  useEffect(() => { if (numberRef.current) numberRef.current.textContent = baseDisplay; }, [baseDisplay]);

  useEffect(() => {
    if (!finalMessage || time <= 0) return;
    const t = setInterval(() => setTime((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [finalMessage, time]);

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const initialHref =
    baseDigits.length === 11 && baseDigits.startsWith("1") ? `tel:+${baseDigits}` : `tel:${baseDigits}`;

  return (
    <motion.div
      className="flex flex-col items-center pt-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="bg-green-100 text-green-700 text-center p-3 rounded-md w-full max-w-md"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <p className="font-semibold">
          Tap on the button below to make a quick call &amp; that's it. You'll be
          qualified on the call by a licensed agent in minutes 👇
        </p>
      </motion.div>

      <motion.a
        id={anchorId}
        href={initialHref}
        className="mt-4 bg-green-500 text-white text-lg font-bold py-3 px-6 rounded-md w-full max-w-md text-center transition hover:bg-green-600 relative"
        style={{ height: "120%", fontSize: "140%" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
      >
        <span className="dni-number" data-phone-text ref={numberRef}>
          {baseDisplay}
        </span>
      </motion.a>

      <motion.p
        className="mt-4 text-gray-600 text-center text-sm w-full max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        Due to high call volume, your official agent is waiting for only{" "}
        <span className="font-bold">3 minutes</span>, then your spot will not be reserved.
      </motion.p>

      <motion.p
        className="mt-2 text-red-500 font-bold text-lg"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      >
        {formatTime(time)}
      </motion.p>
    </motion.div>
  );
};

export default CallToActiondq;
