// src/Chatbot.jsx
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import agent from "../src/assets/pic.png";
import tick from "../src/assets/tick2.png";
import deliver from "../src/assets/delivered.svg";
import { EllipsisVertical, Paperclip, Phone, SendHorizontalIcon } from "lucide-react";
import CallToActiondq from "./components/CallToActiondq";

// --- constants: match the original page's params exactly ---
const PERSISTED_KEYS = [
  "subid",
  "mksite",
  "fbclid",
  "mkcampaign",
  "pixel",
  "phone",
  "utm_campaign",
  "utm_source",
  "utm_medium",
  "utm_term",
  "utm_content",
  "utm_placement",
  "campaign_id",
  "adset_id",
  "ad_id",
  "adset_name",
];

// these are driven by the two questions
const QUESTION_KEYS = ["insurance_carrier", "insured", "homeowner", "subid1", "subid2", "subid3"];
const ALL_KEYS = [...PERSISTED_KEYS, ...QUESTION_KEYS];

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [currentOptions, setCurrentOptions] = useState([]);
  const [finalMessage, setFinalMessage] = useState(false);

  // kept here if you want to reference answers later
  const [carrierAnswer, setCarrierAnswer] = useState(""); // "GEICO" | "N" etc
  const [homeownerAnswer, setHomeownerAnswer] = useState(""); // "Yes" | "No"
  const [insuredAnswer, setInsuredAnswer] = useState("No"); // derived: "No" when carrier === "N", else "Yes"

  // keep whatever was already in the URL so we can keep them on every update
  const [baseParams, setBaseParams] = useState(() => {
    if (typeof window === "undefined") return {};
    const sp = new URLSearchParams(window.location.search);
    const obj = {};
    PERSISTED_KEYS.forEach((k) => (obj[k] = sp.get(k) ?? ""));
    return obj;
  });

  const messagesEndRef = useRef(null);

  // --------------- helpers for URL / logging ---------------
  const buildMergedParams = (updates) => {
    const merged = { ...baseParams, ...updates };
    ALL_KEYS.forEach((k) => {
      if (merged[k] === undefined || merged[k] === null) merged[k] = "";
    });
    return merged;
  };

  const replaceQueryParams = (updates) => {
    if (typeof window === "undefined") return;

    const merged = buildMergedParams(updates);
    const url = new URL(window.location.href);

    const sp = new URLSearchParams();
    ALL_KEYS.forEach((k) => sp.set(k, merged[k] ?? ""));

    url.search = `?${sp.toString()}`;
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);

    console.log("[Chatbot] Query params updated ->", url.toString());
    const tableObj = {};
    ALL_KEYS.forEach((k) => (tableObj[k] = sp.get(k) || ""));
    console.table(tableObj);

    setBaseParams((prev) => ({ ...prev, ...updates }));
  };

  const getFormattedTime = (timeString) =>
    timeString.split(" ")[0].split(":").slice(0, 2).join(":");

  const addMessagesWithDelay = (botResponses) => {
    let delay = 0;
    setIsTyping(true);
    botResponses.forEach((response, index) => {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            ...response,
            time: new Date().toTimeString(),
            lastInSequence: index === botResponses.length - 1,
          },
        ]);
        if (index === botResponses.length - 1) {
          setIsTyping(false);
          if (response.options) setCurrentOptions(response.options);
          if (response.input) setShowInput(true);
        }
      }, (delay += 800));
    });
  };

  // --------------- initial openers ---------------
  useEffect(() => {
    const initialMessages = [
      { text: "Hey there! 👋", sender: "bot" },
      {
        text:
          "Emily this side. Let’s find out how much money we can save you in Auto Insurance Coverage — it’s quick and only takes 2 minutes!",
        sender: "bot",
      },
      {
        text: "Tap 'Yes' to get started! ⬇️",
        sender: "bot",
        options: ["👉 Yes, I'm Ready!"],
      },
    ];
    addMessagesWithDelay(initialMessages);
  }, []);

  // normalize URL once so all keys exist from the start
  useEffect(() => {
    replaceQueryParams({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------- scroll ---------------
  useEffect(() => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight - container.clientHeight - (finalMessage ? 100 : 0),
          behavior: "smooth",
        });
      }
    }
  }, [messages, finalMessage, isTyping]);

  // --------------- 2-question flow ---------------
  const CARRIER_OPTIONS = [
    "Allstate",
    "GEICO",
    "State Farm",
    "Progressive",
    "Other",
    "Not insured", // maps to "N"
  ];
  const HOMEOWNER_OPTIONS = ["Yes", "No"];

  const startQuiz = () => {
    addMessagesWithDelay([
      { text: "Awesome! Just two quick questions.", sender: "bot" },
      { text: "What is your current insurance carrier?", sender: "bot", options: CARRIER_OPTIONS },
    ]);
  };

  const askHomeowner = () => {
    addMessagesWithDelay([{ text: "Are you a homeowner?", sender: "bot", options: HOMEOWNER_OPTIONS }]);
  };

  const finishAndCongratulate = () => {
    addMessagesWithDelay([
      { text: "🎉 Fantastic news!", sender: "bot" },
      {
        text:
          "Based on what you've told me, you’re eligible for a Discounted Auto Insurance Plan with the best coverage!",
        sender: "bot",
      },
    ]);
    setTimeout(() => setFinalMessage(true), 1200);
  };

  // ---------- push to query params (questions only) ----------
  const handleCarrierSelection = (label) => {
    const value = label === "Not insured" ? "N" : label; // match original "N"
    setCarrierAnswer(value);

    const insured = value === "N" ? "No" : "Yes";
    setInsuredAnswer(insured);

    // subid3 = carrier, subid2 = insured
    replaceQueryParams({
      insurance_carrier: value,
      insured: insured,
      subid3: value,
      subid2: insured,
    });

    askHomeowner();
  };

  const handleHomeownerSelection = (value) => {
    setHomeownerAnswer(value);

    // subid1 = homeowner
    replaceQueryParams({
      homeowner: value,
      subid1: value,
    });

    finishAndCongratulate();
  };

  // --------------- options dispatcher ---------------
  const handleOptionClick = (option) => {
    const echoed = option === "👉 Yes, I'm Ready!" ? "Yes" : option;
    setMessages((prev) => [...prev, { text: echoed, sender: "user", time: new Date().toTimeString() }]);

    setShowInput(false);
    setCurrentOptions([]);

    if (option === "👉 Yes, I'm Ready!") {
      startQuiz();
      return;
    }

    if (CARRIER_OPTIONS.includes(option)) {
      handleCarrierSelection(option);
      return;
    }

    if (HOMEOWNER_OPTIONS.includes(option)) {
      handleHomeownerSelection(option);
      return;
    }
  };

  // (optional) not used in 2Q flow
  const handleSendInput = () => {
    if (inputValue.trim() === "") return;
    setMessages((prev) => [...prev, { text: inputValue, sender: "user", time: new Date().toTimeString() }]);
    setInputValue("");
    setShowInput(false);
    addMessagesWithDelay([
      { text: `Nice to meet you, ${inputValue}!`, sender: "bot" },
      { text: "Tap to get started.", sender: "bot", options: ["👉 Yes, I'm Ready!"] },
    ]);
  };

  return (
    <div
      className="w-full h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
      }}
    >
      <div className="bg-[#005e54] text-white p-4 flex items-center gap-2 shadow-md sticky top-0 right-0 left-0 z-10 h-16">
        <img src={agent} alt="Agent" className="w-10 h-10 rounded-full" />
        <div className="flex items-center justify-between w-full">
          <div>
            <div className="flex items-center gap-3">
              <p className="font-bold text-sm">Auto Relief Act</p>
              <img src={tick} className="w-4 h-4" style={{ marginLeft: "-6px" }} alt="" />
            </div>
            <p className="text-sm">online</p>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-white" />
            <Paperclip className="w-5 h-5 text-white" />
            <EllipsisVertical className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-2 overflow-y-auto flex flex-col mt-[1%] pb-52">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: msg.sender === "bot" ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`flex relative ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && msg.lastInSequence && (
              <img
                src={agent}
                alt="Bot"
                className="w-8 h-8 rounded-full mr-2 absolute bottom-0"
              />
            )}
            <motion.div
              initial={{ width: 0, height: 15 }}
              animate={{ width: "auto", height: "auto" }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`pt-2 px-2 pb-0 rounded-lg text-base shadow-md ${
                msg.sender === "user"
                  ? "bg-[#dcf8c6] text-gray-800"
                  : "bg-white text-gray-800 ms-10"
              }`}
              style={{ minWidth: "70px", overflow: "hidden" }}
            >
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                {msg.text}
              </motion.span>

              <span className="flex flex-row-reverse gap-1 items-center">
                {msg.sender === "user" && <img src={deliver} className="h-4 w-4" alt="" />}
                <span className="text-[10px] text-gray-400">
                  {msg.time ? getFormattedTime(msg.time) : ""}
                </span>
              </span>
            </motion.div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2"
          >
            <img src={agent} alt="Bot" className="w-8 h-8 rounded-full" />
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="max-w-xs p-2 rounded-lg text-sm bg-white text-gray-800 flex items-center gap-1"
            >
              <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.3s] bg-gray-500"></div>
              <div className="w-2 h-2 rounded-full animate-bounce [animation-delay:-0.15s] bg-gray-500"></div>
              <div className="w-2 h-2 rounded-full animate-bounce bg-gray-500"></div>
            </motion.div>
          </motion.div>
        )}

        {showInput && (
          <div className="mt-2 flex items-center gap-2 justify-end">
            <input
              type="text"
              className="border w-[60vw] p-4 rounded-2xl"
              placeholder="Type your name..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button
              className="px-5 py-4 bg-[#005e54] text-white rounded-2xl"
              onClick={handleSendInput}
            >
              <SendHorizontalIcon className="w-6 h-6" />
            </button>
          </div>
        )}

        {currentOptions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 items-center justify-start ms-10">
            {currentOptions.map((option, i) => (
              <button
                key={i}
                className="px-6 py-3 bg-[#005e54] text-white rounded-full text-lg"
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        )}

        {/* CTA now dynamically receives DNI number */}
        {finalMessage && <CallToActiondq 
        siteId="1723"
        campaignId="325675"
        finalMessage={finalMessage} />}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
