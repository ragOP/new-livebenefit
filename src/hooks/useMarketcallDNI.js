// src/hooks/useMarketcallDNI.js
import { useEffect } from "react";

function qp(name, def = "") {
  if (typeof window === "undefined") return def;
  const v = new URLSearchParams(window.location.search).get(name);
  return v ?? def;
}

function formatUS(phoneDigits) {
  const d = (phoneDigits || "").replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("1")) return `(${d.slice(1,4)}) ${d.slice(4,7)}-${d.slice(7,11)}`;
  if (d.length === 10) return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6,10)}`;
  return phoneDigits;
}

/**
 * Auto-DNI hook:
 * - Reads site/campaign from URL, then props, then env.
 * - Shows a visible fallback number instantly.
 * - Only loads Marketcall if site+campaign are defined.
 * - Mirrors swapped tel: to the visible label.
 */
export function useMarketcallDNI({
  selector,                               // e.g. '#ctaTel'  (make sure this matches Marketcall dashboard selector!)
  fallbackPhone = (import.meta?.env?.VITE_DEFAULT_PHONE || "+18662278549"),
  siteId,                                 // optional prop fallback
  campaignId,                             // optional prop fallback
  mask = "(xxx) xxx-xxxx",
  serviceBaseUrl = "//www.marketcall.com",
} = {}) {
  useEffect(() => {
    if (typeof window === "undefined" || !selector) return;

    // ---- Resolve identifiers (URL -> props -> env) ----
    const site =
      qp("mksite") ||
      siteId ||
      import.meta?.env?.VITE_MK_SITE ||
      "";

    const campaign =
      qp("mkcampaign") ||
      campaignId ||
      import.meta?.env?.VITE_MK_CAMPAIGN ||
      "";

    // Tracking meta (still read from URL if you’re using them)
    const subid  = qp("subid", "");
    const subid1 = qp("subid1", qp("homeowner", ""));
    const subid2 = qp("subid2", qp("insured", ""));
    const subid3 = qp("subid3", qp("insurance_carrier", ""));

    // ---- Always paint fallback immediately (so it’s never blank) ----
    const el = document.querySelector(selector);
    if (el) {
      const raw    = qp("phone", fallbackPhone);
      const digits = (raw || "").replace(/\D/g, "");
      const href   = digits.length === 11 && digits.startsWith("1") ? `tel:+${digits}` : `tel:${digits}`;
      el.setAttribute("href", href);
      const display = formatUS(digits);
      const numberNode = el.querySelector("[data-phone-text]") || el.querySelector(".dni-number");
      if (numberNode) numberNode.textContent = display;
      if (!numberNode && !el.querySelector("*")) el.textContent = display;
    }

    // Mirror href -> visible label when Marketcall swaps it
    let observer;
    if (el) {
      observer = new MutationObserver(() => {
        const href = el.getAttribute("href") || "";
        if (href.startsWith("tel:")) {
          const digits = href.replace(/^tel:/, "").replace(/\D/g, "");
          const display = formatUS(digits);
          const numberNode = el.querySelector("[data-phone-text]") || el.querySelector(".dni-number");
          if (numberNode) numberNode.textContent = display;
          if (!numberNode && !el.querySelector("*")) el.textContent = display;
        }
      });
      observer.observe(el, { attributes: true, attributeFilter: ["href"] });
    }

    // ---- If site/campaign missing, stop after showing fallback (no errors) ----
    if (!site || !campaign) {
      console.warn("[useMarketcallDNI] Missing site/campaign (URL/props/env). Fallback only.");
      return () => observer && observer.disconnect();
    }

    // ---- Official Marketcall loader (id='mcc') ----
    if (typeof window.mcc !== "function") {
      (function (w, d, s, o, f, js, fjs) {
        w[o] = w[o] || function () { (w[o].q = w[o].q || []).push(arguments); };
        js = d.createElement(s); fjs = d.getElementsByTagName(s)[0];
        js.id = o; js.src = 'https://marketcall.com/js/mc-calltracking.js'; js.async = 1;
        fjs.parentNode.insertBefore(js, fjs);
      })(window, document, 'script', 'mcc');
    }

    try {
      window.mcc("init", { site, serviceBaseUrl });
      window.mcc("requestTrackingNumber", {
        campaign,
        selector: [{ type: "dom", value: selector }],
        mask,
        subid,
        subid1,
        subid2,
        subid3,
      });
    } catch (e) {
      console.warn("[useMarketcallDNI] Marketcall queue/init failed:", e);
    }

    return () => observer && observer.disconnect();
  }, [selector, fallbackPhone, siteId, campaignId, mask, serviceBaseUrl]);
}
