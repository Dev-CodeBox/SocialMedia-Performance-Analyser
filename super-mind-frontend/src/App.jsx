import React, { useState } from "react";
// import animate from "animate.css";
function ChatComponent() {
  const [selectedType, setSelectedType] = useState(""); // For dropdown selection
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!selectedType) {
      setError("Please select a content type.");
      return;
    }

    // Add user's message to the chat
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: `You asked about ${selectedType}`, sender: "user" },
    ]);

    setLoading(true);

    try {
      const response = await fetch(
        "https://socialmedia-performance-analyser.onrender.com/runFlow",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ inputValue: selectedType }), // Send selectedType as inputValue
        }
      );

      const data = await response.json(); // Assuming the backend sends back the message
      console.log("Backend Response:", data);

      setLoading(false);

      if (data && data.message) {
        const botMessage = data.message; // Use the message key from backend
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botMessage, sender: "bot" },
        ]);
      } else {
        const botMessage = "No message found."; // Fallback message
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: botMessage, sender: "bot" },
        ]);
      }

      // Check if there are diff metrics in the response
      if (data.diff) {
        const formattedMetrics = `
          <div class="text-lg font-semibold mb-2">Metrics:</div>
          <div class="mt-2 space-y-2">
            ${data.diff
              .split("\n")
              .map(
                (line, idx) =>
                  `<div key="${idx}" class="p-2 border-b">${line}</div>`
              )
              .join("")}
          </div>
        `;

        setMessages((prevMessages) => [
          ...prevMessages,
          { text: formattedMetrics, sender: "bot", isHtml: true },
        ]);
      }
    } catch (error) {
      setLoading(false);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "An error occurred. Please try again.", sender: "bot" },
      ]);
      console.error("Error:", error);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-xl shadow-xl mt-10">
      {/* Heading */}
      <div className="text-center text-3xl font-semibold text-white mb-4">
        Social Media Performance Analyser
      </div>

      {/* Caption */}
      <div className="text-center text-xl text-white font-light mb-6">
        SuperMind Hackathon Assignment by Hitesh Choudhary
      </div>

      <div className="bg-white p-8 rounded-lg shadow-lg max-h-[70vh] overflow-y-auto animate__animated animate__fadeIn">
        {/* Messages Display */}
        <div className="flex flex-col space-y-4 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg transition-all duration-300 ease-in-out transform ${
                msg.sender === "user"
                  ? "bg-indigo-500 text-white self-end"
                  : "bg-gray-200 text-gray-900 self-start"
              }`}
            >
              {/* Render the bot message with HTML formatting */}
              <div
                dangerouslySetInnerHTML={{
                  __html: msg.isHtml
                    ? msg.text
                    : msg.text.replace(/\n/g, "<br />"),
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Select and Submit Form */}
        <div className="flex flex-col space-y-4 mt-6">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="w-full p-3 bg-gray-100 text-gray-700 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
          >
            <option value="">Select Content Type</option>
            <option value="static_img">Static Image</option>
            <option value="reels">Reels</option>
            <option value="carousel">Carousel</option>
          </select>

          <div className="flex space-x-4 justify-between items-center">
            <input
              type="text"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              placeholder="Type your message"
              className="w-full p-3 bg-gray-100 text-gray-700 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </div>

        {/* Error Handling */}
        {error && (
          <div className="mt-4 text-red-500 text-sm font-semibold">{error}</div>
        )}
      </div>
    </div>
  );
}

export default ChatComponent;

// import React, { useState } from "react";

// function ChatComponent() {
//   const [selectedType, setSelectedType] = useState(""); // For dropdown selection
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const handleSubmit = async () => {
//     if (!selectedType) {
//       setError("Please select a content type.");
//       return;
//     }

//     // Add user's message to the chat
//     setMessages((prevMessages) => [
//       ...prevMessages,
//       { text: `You asked about ${selectedType}`, sender: "user" },
//     ]);

//     setLoading(true);

//     try {
//       const response = await fetch("http://localhost:3000/runFlow", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ inputValue: selectedType }), // Send selectedType as inputValue
//       });

//       const data = await response.json(); // Assuming the backend sends back the message
//       console.log("Backend Response:", data);

//       setLoading(false);

//       // Check if the response contains the expected structure
//       if (data && data.message) {
//         const botMessage = data.message; // Use the message key from backend
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { text: botMessage, sender: "bot" },
//         ]);
//       } else {
//         const botMessage = "No message found."; // Fallback message
//         setMessages((prevMessages) => [
//           ...prevMessages,
//           { text: botMessage, sender: "bot" },
//         ]);
//       }
//     } catch (error) {
//       setLoading(false);
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { text: "An error occurred. Please try again.", sender: "bot" },
//       ]);
//       console.error("Error:", error);
//     }
//   };
//   return (
//     <div className="w-full max-w-4xl mx-auto p-6 bg-gradient-to-r from-indigo-600 to-purple-500 rounded-xl shadow-xl mt-10">
//       {/* Heading */}
//       <div className="text-center text-3xl font-semibold text-white mb-4">
//         Social Media Performance Analyser
//       </div>

//       {/* Caption */}
//       <div className="text-center text-xl text-white font-light mb-6">
//         SuperMind Hackathon Assignment by Hitesh Choudhary
//       </div>

//       <div className="bg-white p-8 rounded-lg shadow-lg max-h-[70vh] overflow-y-auto animate__animated animate__fadeIn">
//         {/* Messages Display */}
//         <div className="flex flex-col space-y-4 overflow-y-auto">
//           {messages.map((msg, idx) => (
//             <div
//               key={idx}
//               className={`p-4 rounded-lg transition-all duration-300 ease-in-out transform ${
//                 msg.sender === "user"
//                   ? "bg-indigo-500 text-white self-end"
//                   : "bg-gray-200 text-gray-900 self-start"
//               }`}
//             >
//               <p>{msg.text}</p>
//             </div>
//           ))}
//         </div>

//         {/* Select and Submit Form */}
//         <div className="flex flex-col space-y-4 mt-6">
//           <select
//             value={selectedType}
//             onChange={(e) => setSelectedType(e.target.value)}
//             className="w-full p-3 bg-gray-100 text-gray-700 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300"
//           >
//             <option value="">Select Content Type</option>
//             <option value="static_img">Static Image</option>
//             <option value="reels">Reels</option>
//             <option value="carousel">Carousel</option>
//           </select>

//           <div className="flex space-x-4 justify-between items-center">
//             <input
//               type="text"
//               value={selectedType}
//               onChange={(e) => setSelectedType(e.target.value)}
//               placeholder="Type your message"
//               className="w-full p-3 bg-gray-100 text-gray-700 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//             />
//             <button
//               onClick={handleSubmit}
//               disabled={loading}
//               className="px-6 py-3 bg-indigo-500 text-white rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 disabled:bg-gray-400"
//             >
//               {loading ? "Sending..." : "Send"}
//             </button>
//           </div>
//         </div>

//         {/* Error Handling */}
//         {error && (
//           <div className="mt-4 text-red-500 text-sm font-semibold">{error}</div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default ChatComponent;

//   // const handleSubmit = async () => {
//   //   if (!selectedType) {
//   //     setError("Please select a content type.");
//   //     return;
//   //   }

//   //   setMessages((prevMessages) => [
//   //     ...prevMessages,
//   //     { text: `You asked about ${selectedType}`, sender: "user" },
//   //   ]);
//   //   setLoading(true);

//   //   try {
//   //     const response = await fetch("http://localhost:3000/runFlow", {
//   //       method: "POST",
//   //       headers: {
//   //         "Content-Type": "application/json",
//   //       },
//   //       body: JSON.stringify({ inputValue: selectedType }), // send selectedType as inputValue
//   //     });

//   //     const data = await response.json(); // Assuming the backend sends back the message
//   //     console.log("Backend Response:", data);

//   //     setLoading(false);

//   //     const botMessage = data?.message || "No message found.";
//   //     console.log("Bot message:", botMessage); // Log the bot message for debugging

//   //     setMessages((prevMessages) => [
//   //       ...prevMessages,
//   //       { text: botMessage, sender: "bot" },
//   //     ]);
//   //   } catch (error) {
//   //     setLoading(false);
//   //     setMessages((prevMessages) => [
//   //       ...prevMessages,
//   //       { text: "An error occurred. Please try again.", sender: "bot" },
//   //     ]);
//   //     console.error("Error:", error);
//   //   }
//   // };
