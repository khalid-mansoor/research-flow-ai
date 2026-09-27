"use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [research, setResearch] = useState(null);
  const [streamedText, setStreamedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function researchTopic() {
    if (!topic.trim()) {
      setError("Please enter a research topic.");
      return;
    }

    setLoading(true);
    setError("");
    setResearch(null);
    setStreamedText("");

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate research.");
      }

      if (!response.body) {
        throw new Error("No response stream received.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let result = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true,
        });

        console.log("STREAM CHUNK:", chunk);

        result += chunk;

        setStreamedText((previous) => previous + chunk);
      }

      console.log("FINAL STREAM:", result);
    } catch (error) {
      console.error(error);
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold">
            ResearchFlow AI
          </h1>

          <p className="mt-2 text-gray-600">
            AI-powered research and intelligence platform
          </p>
        </div>

        {/* Research Input */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow">
          <label className="font-medium">
            Research Topic
          </label>

          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) {
                researchTopic();
              }
            }}
            placeholder="Enter a research topic..."
            className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-black"
          />

          <button
            onClick={researchTopic}
            disabled={loading}
            className="mt-4 rounded-lg bg-black px-5 py-3 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Researching..." : "Start Research"}
          </button>

          {error && (
            <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-600">
              {error}
            </p>
          )}
        </div>

        {/* Streaming Response */}
        {streamedText && (
          <section className="mt-8 rounded-xl bg-white p-6 shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                AI Research
              </h2>

              {loading && (
                <span className="text-sm text-gray-500">
                  Generating...
                </span>
              )}
            </div>

            <pre className="mt-4 whitespace-pre-wrap break-words text-sm leading-7 text-gray-700">
              {streamedText}
            </pre>
          </section>
        )}

        {/* Final Structured Research */}
        {research && (
          <div className="mt-8 space-y-6">
            {/* Title */}
            <section className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-2xl font-bold">
                {research.title}
              </h2>
            </section>

            {/* Overview */}
            <section className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold">
                Overview
              </h2>

              <p className="mt-3 text-gray-700">
                {research.overview}
              </p>
            </section>

            {/* Why It Matters */}
            <section className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold">
                Why It Matters
              </h2>

              <p className="mt-3 text-gray-700">
                {research.whyItMatters}
              </p>
            </section>

            {/* Developments */}
            <section className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold">
                Important Developments
              </h2>

              <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
                {research.developments.map(
                  (development, index) => (
                    <li key={index}>
                      {development}
                    </li>
                  )
                )}
              </ul>
            </section>

            {/* Challenges */}
            <section className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold">
                Potential Challenges
              </h2>

              <ul className="mt-3 list-disc space-y-2 pl-6 text-gray-700">
                {research.challenges.map(
                  (challenge, index) => (
                    <li key={index}>
                      {challenge}
                    </li>
                  )
                )}
              </ul>
            </section>

            {/* Sources */}
            <section className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-xl font-semibold">
                Sources
              </h2>

              <ul className="mt-3 space-y-3">
                {research.sources.map((source, index) => (
                  <li key={index}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {source.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}