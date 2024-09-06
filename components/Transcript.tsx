import { useEffect, useRef, useState } from 'react';

export default function Transcript({ transcript }: { transcript: any[] }) {
  const [isAtBottom, setIsAtBottom] = useState(true); // Tracks whether we're at the bottom
  const scrollRef = useRef<HTMLDivElement>(null); // Reference to the scrollable div

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
    <div className="bg-rsPanel border-rsGold border-4 shadow-md rounded-rs mb-4">
      <div className="px-4 py-5 border-b border-rsGold">
        <h3 className="text-lg font-medium text-rsGold font-rsFont">
          Transcript
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-rsText font-rsFont">
          A record of your adventure
        </p>
      </div>

      {/* Scrollable Transcript Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="max-h-96 overflow-y-auto p-4"
      >
        {transcript.map((text, i) => (
          <dl key={i.toString()} className="bg-gray-800 p-3 rounded-md mb-2">
            <div className="flex flex-col">
              <dt className="text-sm font-medium text-rsGold">{text.type}</dt>
              <dd className="mt-1 text-sm text-rsText">{text.text}</dd>
            </div>
          </dl>
        ))}
      </div>
    </div>
  );
}
