import { useEffect, useRef, useState } from 'react';

export default function Transcript({ transcript }) {
  const [isAtBottom, setIsAtBottom] = useState(true); // Tracks whether we're at the bottom
  const scrollRef = useRef(null); // Reference to the scrollable div

  // Scroll to the bottom whenever the transcript updates
  useEffect(() => {
    if (isAtBottom && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [transcript, isAtBottom]); // Run when the transcript updates

  // Check if user is at the bottom or not
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // If scroll is near the bottom, enable auto-scroll, otherwise disable
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Transcript
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          A record of your adventure
        </p>
      </div>

      {/* Scrollable Transcript Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="max-h-96 overflow-y-auto border-t border-gray-200"
      >
        {transcript.map((text, i) => (
          <dl key={i.toString()}>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">{text.type}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                {text.text}
              </dd>
            </div>
          </dl>
        ))}
      </div>
    </div>
  );
}
