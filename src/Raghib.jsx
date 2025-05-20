import React, { useState, useEffect } from "react";
import "./raghib.css";
import emily from "./images/emily.jpg";
import yesBtn from "./images/yes-btn.png";
import hyIcon from "./images/hy-icon.png";
import receiptIcon from "./images/receipt-ic.png";

const Raghib = () => {
  const [showBottomSection, setShowBottomSection] = useState(false);
  const [messages, setMessages] = useState({
    msg1: true,
    msg6: false,
    msg7: false,
    msg8: false,
    msg9: false,
    msg10: false,
    msg11: false,
    msg12: false,
    msg13: false,
    msg14: false,
  });
  const [typingStates, setTypingStates] = useState({
    msg1: false,
    msg6: false,
    msg7: false,
    msg8: false,
    msg9: false,
    msg10: false
  });
  const [countdown, setCountdown] = useState({ minutes: "05", seconds: "00" });
  const [progressValue, setProgressValue] = useState(100);
  const [pass, setPass] = useState(false);
    const [isYesOption, setIsYesOption] = useState(true);

  const scrollToBottom = () => {
    const chatContainer = document.querySelector('.chat_section');
    if (chatContainer) {
      requestAnimationFrame(() => {
        chatContainer.scrollTo({
          top: chatContainer.scrollHeight,
          behavior: 'smooth'
        });
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingStates]);

  const TypingAnimation = () => (
    <div className="typing">
      <div className="text-bg-left">
        Typing<span></span><span></span><span></span>
      </div>
    </div>
  );

const handleYesClick = () => {
    setShowBottomSection(true);
    setTypingStates(prev => ({ ...prev, msg1: true }));
    setTimeout(() => {
        setTypingStates(prev => ({ ...prev, msg1: false }));
       setMessages(prev => ({ ...prev, msg6: true }));
        setTimeout(() => {
            setTypingStates(prev => ({ ...prev, msg6: false }));
            setMessages(prev => ({ ...prev, msg6: true }));
            setTypingStates(prev => ({ ...prev, msg7: true }));
                setTimeout(() => {
                    setTypingStates(prev => ({ ...prev, msg7: false }));
                    setMessages(prev => ({ ...prev, msg7: true }));
                }, 500);
        }, 500);
    }, 1000);
};

  const handleStep2Click = () => {
    setMessages(prev => ({ ...prev, msg8: true}));
    setTypingStates(prev => ({ ...prev, msg8: true }));
    setTimeout(() => {
      setTypingStates(prev => ({ ...prev, msg8: false }));
      setPass(true);
      setTypingStates(prev => ({ ...prev, msg9: true }));
      setTimeout(() => {  
        setTypingStates(prev => ({ ...prev, msg9: false }));
        setMessages(prev => ({ ...prev, msg9: true }));
      }, 1500);
    }, 1500);
  };

  const handleStep3Click = (isNo) => {
    setIsYesOption(!isNo);
    setTypingStates(prev => ({ ...prev, msg10: true }));

    const messageSequence = [
      { msg: "msg10", delay: 1000 },
      { msg: "msg11", delay: 1000 },
      { msg: "msg12", delay: 1000 },
      { msg: "msg13", delay: 1000 },
      { msg: "msg14", delay: 500 }
    ];

    if (isNo) {
        setMessages(prev => ({ ...prev, msg10: true }));
        console.log('Setting timeout for redirect...');
       setTimeout(() => {
        console.log('Redirecting to Google...');
           window.location.href = "https://google.com";
       }, 2000);
         return;
    }

    let totalDelay = 0;
    messageSequence.forEach(({ msg, delay }, index) => {
      totalDelay += delay;
      setTimeout(() => {
        setMessages(prev => ({ ...prev, [msg]: true }));
        if (index < messageSequence.length - 1) {
          setTypingStates(prev => ({ ...prev, msg10: true }));
        } else {
          setTypingStates(prev => ({ ...prev, msg10: false }));
        }
      }, totalDelay);
    });
  };

  useEffect(() => {
    let timer;
    if (showBottomSection) {
      let totalSeconds = 5 * 60;
      timer = setInterval(() => {
        totalSeconds--;
        if (totalSeconds < 0) {
          clearInterval(timer);
          return;
        }
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        setCountdown({
          minutes: minutes < 10 ? `0${minutes}` : minutes,
          seconds: seconds < 10 ? `0${seconds}` : seconds
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [showBottomSection]);

  useEffect(() => {
    let progressTimer;
    if (showBottomSection) {
      progressTimer = setInterval(() => {
        setProgressValue(prev => {
          if (prev <= 0) {
            clearInterval(progressTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(progressTimer);
  }, [showBottomSection]);

  return (
    <div className="app-container">
      <div id="full-background" className="full-background" />

      <div className="wrapper">
        {!showBottomSection && (
          <div className="top-section">
            <div className="container">
              <div className="bnr-section">
                <p className="top_banner_text1" style={{ display: 'none' }}>
                  Attn: <span id="top-state-name"></span> Seniors!
                </p>
                <div className="banner_content">
                  <p className="banner_text1">Could you use extra</p>
                  <p className="banner_text2">$3,300*</p>
                  <p className="banner_text1"> to spend on groceries, utilities or rent?</p>
                </div>
                <div className="speak_row">
                  <p className="speak_row-text">
                    Tap "Yes" to speak to an <br />
                    agent and qualify!
                  </p>
                  <button onClick={handleYesClick} className="yes-btn">
                    <img src={yesBtn} width="500" height="182" alt="Yes button" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showBottomSection && (
          <div id="bottom_section">
            <div className="live_header-outer">
              <div className="container">
                <div className="live_header">
                  <div className="enrollment_row">
                    <p>Seniors On Medicare Get a $3,300* Flex Spending Allowance by Doing This Today.</p>
                  </div>
                  <div className="online_strip">
                    <p><span></span> Emily is online</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="chat-sec chat-sec-v2">
              <div className="container">
                <div className="chat_section">
                  <div className="contact-block">
                    {/* Initial greeting */}
                    <div className="contact-box boxtop">
                      <div className="agent-row top">
                        <img src={emily} width="100" height="100" className="agent-pic" alt="Emily" />
                        <div className="messages-container">
                          {messages.msg1 && (
                            <div className="msg_box" id="msg1">
                              <div className="text-bg-left">
                                <p className="contact-txt1">
                                  Hi <img src={hyIcon} width="50" height="48" className="hy-icon" alt="Wave icon" />, I'm
                                  Emily from <br />
                                  the <span id="state-name"></span> Senior Benefit <br /> Center
                                </p>
                              </div>
                            </div>
                          )}
                          {typingStates.msg1 && <TypingAnimation />}
                        </div>
                      </div>
                    </div>

                    {/* Step 2 box */}
                    <div className={`contact-box box1 ${!messages.msg6 ? 'hidden' : ''}`}>
                      <div className="agent-row chat-row">
                        <img src={emily} width="100" height="100" className="agent-pic agent2" alt="Emily" />
                        <div className="messages-container">
                          {messages.msg6 && (
                            <div className="msg_box" id="msg6">
                              <div className="text-bg-left">
                                <p className="contact-txt2">
                                  Want to find out if you qualify for the up to $900 in Grocery Allowance? Tap Yes! 😃
                                </p>
                              </div>
                            </div>
                          )}
                          {typingStates.msg7 && <TypingAnimation />}
                          {messages.msg7 && (
                            <div className="msg_box" id="msg7">
                              <div className="btnbox">
                                <button onClick={handleStep2Click} className="comon-btn step2Btn pulse-btn">
                                  <div><span>Yes</span></div>
                                </button>
                              </div>
                            </div>
                          )}
                          {typingStates.msg6 && <TypingAnimation />}
                        </div>
                      </div>
                    </div>

                    {/* Step 3 box */}
                    <div className={`contact-box box3 ${!messages.msg8 ? 'hidden' : ''}`}>
                      <div className="recipient-header">
                        <div className="recipient-cont">
                          <p className="opt-heading1">
                            <span>Yes</span> <img src={receiptIcon} width="50" height="50" alt="ic" />
                          </p>
                        </div>
                      </div>
                      <div className="agent-row chat-row3">
                        <img src={emily} width="100" height="100" className="agent-pic agent3" alt="Emily" />
                        <div className="messages-container">
                          {pass && messages.msg8 && (
                            <div className="msg_box" id="msg8">
                              <div className="text-bg-left">
                                <p className="contact-txt1" style={{ fontSize: '18px' }}>
                                  Are you on Medicare Parts A/B?
                                </p>
                              </div>
                            </div>
                          )}
                          {typingStates.msg8 && <TypingAnimation />}
                          {messages.msg9 && (
                            <div className="msg_box" id="msg9">
                              <div className="btnbox">
                                <button onClick={() => handleStep3Click(false)} className="comon-btn step3Btn pulse-btn">
                                  <div><span>Yes</span></div>
                                </button>
                                <a onClick={() => handleStep3Click(true)} className="comon-btn step3Btn">
                                  <div><span>No</span></div>
                                </a>
                              </div>
                            </div>
                          )}
                          {typingStates.msg9 && <TypingAnimation />}
                        </div>
                      </div>
                    </div>

                    {/* Step 4 box */}
                    <div className={`contact-box box4 ${!messages.msg10 ? 'hidden' : ''}`}>
                      <div className="recipient-header">
                        <div className="recipient-cont">
                          <p className="opt-heading2">
                            {isYesOption && (
                              <>
                                <span>YES</span> <img src={receiptIcon} width="50" height="50" alt="ic" />
                              </>
                            )}
                            {!isYesOption && (
                              <>
                                <span>NO</span> <img src={receiptIcon} width="50" height="50" alt="ic" />
                              </>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="agent-row chat-row4">
                        <img src={emily} width="100" height="100" className="agent-pic agent4" alt="Emily" />
                        <div className="messages-container">
                          {messages.msg10 && (
                            <div className="msg_box" id="msg10">
                              <div className="text-bg-left">
                                <p className="contact-txt1">🎉 🎉 Great News!</p>
                              </div>
                            </div>
                          )}
                          {messages.msg11 && (
                            <div className="msg_box" id="msg11">
                              <div className="text-bg-left">
                                <p className="contact-txt2">You are pre-qualified for a $3,300* Flex Card.</p>
                              </div>
                            </div>
                          )}
                          {messages.msg12 && (
                            <div className="msg_box" id="msg12">
                              <div className="text-bg-left">
                                <p className="contact-txt2">
                                  Tap the number below to call now and add it to your plan. It's completely
                                  free and takes minutes to see what you can get.
                                </p>
                              </div>
                            </div>
                          )}
                          {messages.msg13 && (
                            <div className="msg_box" id="msg13">
                              <div className="text-bg-left">
                                <p className="contact-txt2">
                                  Make sure to mention to the agent that you are looking for information on getting a Flexible Spending.
                                </p>
                              </div>
                            </div>
                          )}
                          {typingStates.msg10 && <TypingAnimation />}
                        </div>
                      </div>
                      {messages.msg14 && (
                        <div className="agent-row" id="msg14">
                          <a href="tel:+18449192785" className="comon-btn call-btn pulse-btn">
                            <div><span>(844) 919-2785</span></div>
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="timer_section">
              <div className="container">
                <div className="timer_row">
                  <div className="reading-progress">
                    <div className="time stopwatch">{`${countdown.minutes}.${countdown.seconds}`}</div>
                    <svg 
                      className="progress-circle" 
                      width="100%" 
                      height="100%" 
                      viewBox="0 0 100 100" 
                      preserveAspectRatio="xMinYMin meet"
                      style={{ 
                        strokeDashoffset: 300 - (progressValue * 3)
                      }}
                    >
                      <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
                    </svg>
                    <svg 
                      className="progress-circle-background" 
                      width="100%" 
                      height="100%" 
                      viewBox="0 0 100 100" 
                      preserveAspectRatio="xMinYMin meet"
                    >
                      <path d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" />
                    </svg>
                  </div>
                  <p>
                    <span>LEFT TO CLAIM</span><br />
                    Your place is only <br />guaranteed for this time!
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="disclaimer" style={{ fontSize: '11px' }}>
          <div className="accordion-heading">
            <p className="pt-3">
              © 2024 AdWorld, LLC<br />
              All Rights Reserved. | <a href="./privacy.html">Privacy Policy</a> | <a href="./tos.html">Terms & Conditions</a>
            </p>
          </div>
          <p>This website (www.healthsecuritynow.com) is owned and operated by AdWorld,
              LLC, which
              partners with licensed insurance professionals to connect consumers with Medicare
              options.
          </p>
          <p>

          </p><p>
              Invitations for applications for insurance on AdWorld, LLC are made through
              AdWorld, LLC, only where licensed and appointed. AdWorld, LLC is a wholly
              owned subsidiary
              of AdWorld, LLC. AdWorld, LLC is a licensed insurance agency of
              AdWorld, LLC HMO, PPO and PPFS organizations and prescription drug plans with a Medicare
              contract.
              Enrollment in any plan depends on contract renewal. We do not offer every plan available
              in your area.
              Any information we provide is limited to those plans we do offer in your area. Please
              contact
              Medicare.gov or 1-800-MEDICARE to get information on all of your options.
          </p>
          <p>
              This site is not connected with or endorsed by the U.S. Government or the federal
              Medicare program.
          </p>
          <p>
              Enrollment in the described plan type may be limited to certain times of the year unless
              you qualify for
              a Special Enrollment Period.
          </p>
          <p>healthsecuritynow.com (owned and operated by AdWorld, LLC)
              is an
              independent marketplace
              and is not a federal or state marketplace website. healthsecuritynow.com (owned and
              operated by AdWorld, LLC)
              does provide quotes or sell insurance directly to consumers; healthsecuritynow.com (owned
              and operated by AdWorld, LLC)
              is not affiliated with any exchange; healthsecuritynow.com (owned and operated by AdWorld, LLC)
              is a licensed insurance agency or broker. Accordingly, you should not send us (via mail
              or email) any
              sensitive information,
              including personal health information or applications; any such communications will not
              be treated as
              confidential and will be discarded,
              as, in offering this website, we are required to comply with the standards established
              under 45 CFR
              155.260 to protect the privacy
              and security of personally identifiable information.</p>
          <p>* Individual benefits may vary by state and eligibility.</p>
          <p>Multiplan</p>
        </div>
      </div>
    </div>
  );
};

export default Raghib;