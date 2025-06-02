"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

interface RecentSite {
  id: string;
  path: string;
}

export default function Home() {
  const [trackingId, setTrackingId] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [script, setScript] = useState("");
  const [recentSites, setRecentSites] = useState<RecentSite[]>([]);
  const [device, setDevice] = useState("Unknown");
  const [country, setCountry] = useState("Unknown");

  useEffect(() => {
    const savedId = localStorage.getItem("sola-last-id");
    if (savedId) setTrackingId(savedId);

    // Fetch recent sites from local storage
    const savedSites = JSON.parse(localStorage.getItem("sola-recent-sites") || "[]");
    setRecentSites(savedSites);

    // Determine device type
    const userAgent = navigator.userAgent;
    if (/mobile/i.test(userAgent)) {
      setDevice("Mobile");
    } else if (/tablet/i.test(userAgent)) {
      setDevice("Tablet");
    } else {
      setDevice("Desktop");
    }

    // Fetch country based on IP
    const fetchCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        setCountry(data.country_name || "Unknown");
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    };

    fetchCountry();
  }, []);

  const generateScript = () => {
    const newScript = `<script>window.SOLA_SITE_ID = "${trackingId}"</script>\n<script src="https://sola.vercel.app/sola.js" defer></script>`;
    setScript(newScript);
    localStorage.setItem("sola-last-id", trackingId);

    // Update recent sites in local storage
    const updatedSites = [...recentSites, { id: trackingId, path: targetUrl }];
    setRecentSites(updatedSites);
    localStorage.setItem("sola-recent-sites", JSON.stringify(updatedSites));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white px-6 py-10 flex flex-col items-center gap-16 font-[var(--font-geist-sans)]">
      <main className="w-full max-w-xl flex flex-col gap-2">
        <section className="text-center border border-zinc-200 dark:border-zinc-700 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
          <h1 className="text-4xl font-bold mb-2 font-[var(--font-instrument-serif)]">Sola Analytics</h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-base">Track visits, clicks, and devices with a single embed.</p>
          <Link href="/dashboard">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg hover:bg-blue-400 transition mt-4">
              Go to Dashboard
            </button>
          </Link>
        </section>

        <section className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-5 rounded-3xl shadow hover:shadow-lg transition-shadow space-y-4">
          <h2 className="text-xl font-semibold">Quick Setup</h2>
          <input
            type="text"
            placeholder="Tracking ID"
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            className="w-full p-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Target URL"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            className="w-full p-3 rounded-2xl border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={generateScript}
            className="w-full bg-black dark:bg-white dark:text-black text-white py-3 rounded-2xl font-semibold hover:opacity-90 transition"
          >
            Generate Script
          </button>
          {script && (
            <div className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded-2xl mt-2">
              <h3 className="font-medium text-sm mb-2">Embed Code</h3>
              <pre className="text-xs font-mono whitespace-pre-wrap text-zinc-800 dark:text-zinc-100">{script}</pre>
              <button
                onClick={() => navigator.clipboard.writeText(script)}
                className="mt-2 bg-zinc-800 dark:bg-white dark:text-black text-white px-4 py-2 rounded-2xl text-sm hover:opacity-90"
              >
                Copy Script
              </button>
            </div>
          )}
        </section>

        <section className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-5 rounded-3xl shadow hover:shadow-lg transition-shadow space-y-2">
          <h2 className="text-xl font-semibold mb-1">Live Preview</h2>
          <div className="flex justify-between text-sm">
            <span>Page Path</span>
            <span>{targetUrl || "Not set"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Status</span>
            <span className="text-green-600">🟢 Active</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Device</span>
            <span>{device}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Country</span>
            <span>{country}</span>
          </div>
        </section>

        <section className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-950 p-5 rounded-3xl shadow hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-3">Recent Sites</h2>
          <ul className="space-y-2">
            {recentSites.map((site) => (
              <li key={site.id} className="flex justify-between text-sm items-center">
                <span>{site.id}</span>
                <button className="text-blue-600 hover:underline">View Analytics</button>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="text-xs text-zinc-500 dark:text-zinc-400 mt-12">
        Built with ❤️ by Max — Powered by Vercel & Neon
      </footer>
    </div>
  );
}