import { useState, useEffect } from "react";
import { FaWhatsapp, FaTimes } from "react-icons/fa";

function WhatsAppWidget() {

  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(true);

  const phone = "255710946015";

  const message =
    "Hello Victor.io Solutions, I'm interested in your services.";

  // AUTO OPEN AFTER 4 SECONDS
  useEffect(() => {

    const autoOpen = setTimeout(() => {
      setOpen(true);
    }, 4000);

    return () => clearTimeout(autoOpen);

  }, []);

  // FAKE TYPING EFFECT
  useEffect(() => {

    const typingTimer = setTimeout(() => {
      setTyping(false);
    }, 2500);

    return () => clearTimeout(typingTimer);

  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">

      {/* CHAT BOX */}

      {open && (
        <div className="mb-4 w-[350px] rounded-3xl overflow-hidden shadow-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 animate-in slide-in-from-bottom duration-300">

          {/* HEADER */}

          <div className="bg-green-500 text-white p-4 flex justify-between items-center">

            <div>

              <h3 className="font-bold text-lg">
                Victor.io Support
              </h3>

              <p className="text-xs opacity-90">
                Usually replies instantly
              </p>

            </div>

            <button
              onClick={() => setOpen(false)}
              className="hover:rotate-90 transition"
            >
              <FaTimes />
            </button>

          </div>

          {/* BODY */}

          <div className="p-5">

            <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 mb-5">

              {typing ? (

                <div className="flex gap-2 items-center">

                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-100"></span>
                  <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce delay-200"></span>

                  <span className="text-sm text-gray-500 ml-2">
                    typing...
                  </span>

                </div>

              ) : (

                <>
                  <p className="text-gray-700 dark:text-gray-200 text-sm">
                    👋 Welcome to Victor.io Solutions.
                  </p>

                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                    Need help with websites, systems,
                    React, Django, design or digital solutions?
                  </p>
                </>

              )}

            </div>

            <a
              href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-green-500 hover:bg-green-600 text-white py-3 rounded-2xl font-semibold transition duration-300 hover:scale-105"
            >
              Start WhatsApp Chat
            </a>

          </div>

        </div>
      )}

      {/* FLOATING BUTTON */}

      <div className="relative">

        {/* NOTIFICATION BADGE */}

        {!open && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full animate-pulse">
            ?
          </span>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="bg-green-500 hover:bg-green-600 text-white p-5 rounded-full shadow-2xl transition duration-300 hover:scale-110"
        >
          <FaWhatsapp size={30} />
        </button>

      </div>

    </div>
  );
}

export default WhatsAppWidget;