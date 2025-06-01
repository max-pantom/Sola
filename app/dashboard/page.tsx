'use client';

import { useState, useEffect } from 'react';

// Define the interface for analytics entries
interface AnalyticsEntry {
  id?: string; // Optional, since not all entries may have an ID
  path: string;
  referrer: string;
  userAgent: string;
  timestamp: string;
  clicks?: number; // Optional
  ip?: string; // Optional
  country?: string; // Optional
}

// Function to fetch country by IP (optional)
async function fetchCountryByIP(ip: string) {
  const response = await fetch(`https://ipapi.co/${ip}/json/`);
  if (response.ok) {
    const data = await response.json();
    return data.country_name; // or data.country for the country code
  }
  return null;
}

export default function Dashboard() {
  const [id, setId] = useState('');
  const [url, setUrl] = useState('');
  const [data, setData] = useState<AnalyticsEntry[]>([]);
  const [fetchedData, setFetchedData] = useState<AnalyticsEntry[]>([]);
  const [scriptTag, setScriptTag] = useState(''); // State for the script tag

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/analytics'); // Fetching analytics data from the new API
      if (response.ok) {
        const analyticsData = await response.json();
        setData(analyticsData);
      } else {
        console.error('Failed to fetch analytics data');
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch('/api/collect', {
      method: 'POST',
      body: JSON.stringify({
        id,
        path: url,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
      console.log('Analytics tracked successfully!');
      setId('');
      setUrl('');
      
      // Generate the script tag
      const newScriptTag = `<script src="https://yourdomain.com/sola.js?id=${id}"></script>`;
      setScriptTag(newScriptTag); // Set the script tag in state

      // Optionally, refetch the data after tracking
      const fetchData = async () => {
        const response = await fetch('/api/analytics');
        if (response.ok) {
          const analyticsData = await response.json();
          setData(analyticsData);
        }
      };
      fetchData();
    } else {
      console.error('Failed to track analytics.');
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptTag); // Copy the script tag to clipboard
    console.log('Script tag copied to clipboard!'); // Notify the user
  };

  const handleFetchAnalytics = async (e: any) => {
    e.preventDefault();
    const analyticsEntry = data.find(entry => entry.id === id);
    if (analyticsEntry) {
      setFetchedData([analyticsEntry]);
    } else {
      console.warn('No analytics found for this ID.');
    }
  };

  const handleRefresh = async () => {
    const response = await fetch('/api/analytics');
    if (response.ok) {
      const analyticsData = await response.json();
      setData(analyticsData);
      console.log('Analytics data refreshed!');
    } else {
      console.error('Failed to refresh analytics data');
    }
  };

  return (
    <main className="p-6 min-h-screen bg-black text-white font-sans">
      <h1 className="text-3xl font-semibold mb-6">Sola Analytics</h1>

      {/* Track Form */}
      <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Enter Short ID"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="bg-zinc-900 text-white border border-zinc-700 rounded-[14px] px-4 py-2 focus:outline-none"
          required
        />
        <input
          type="text"
          placeholder="Enter TargetURL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-zinc-900 text-white border border-zinc-700 rounded-[14px] px-4 py-2 focus:outline-none"
          required
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 transition rounded-[14px] px-4 py-2">
          Track
        </button>
      </form>

      {/* Copy Script Tag */}
      {scriptTag && (
        <div className="mb-4">
          <p className="text-white">Copy this script tag to include in your site:</p>
          <textarea
            readOnly
            value={scriptTag}
            className="bg-zinc-900 text-white border border-zinc-700 rounded-[14px] px-4 py-2 w-full"
          />
          <button onClick={handleCopyScript} className="bg-green-600 hover:bg-green-500 transition rounded-[14px] px-4 py-2 mt-2">
            Copy Script Tag
          </button>
        </div>
      )}

      {/* Fetch Form */}
      <form onSubmit={handleFetchAnalytics} className="mb-4 flex flex-wrap gap-2 items-center">
        <input
          type="text"
          placeholder="Enter Short ID to fetch"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="bg-zinc-900 text-white border border-zinc-700 rounded-[14px] px-4 py-2 focus:outline-none"
          required
        />
        <button type="submit" className="bg-green-600 hover:bg-green-500 transition rounded-[14px] px-4 py-2">
          Fetch
        </button>
        <button onClick={handleRefresh} type="button" className="bg-yellow-500 hover:bg-yellow-400 transition rounded-[14px] px-4 py-2">
          Refresh
        </button>
      </form>

      {/* Analytics Cards */}
      <ul className="space-y-4 mt-6">
        {(fetchedData.length > 0 ? fetchedData : data).map((entry, i) => (
          <li key={i} className="bg-white bg-opacity-5 text-zinc-200 rounded-[20px] p-6 shadow-lg">
            <p><strong>Short ID:</strong> {entry.id}</p>
            <p><strong>Path:</strong> {entry.path}</p>
            <p><strong>Referrer:</strong> {entry.referrer}</p>
            <p><strong>User Agent:</strong> {entry.userAgent}</p>
            <p><strong>IP:</strong> {entry.ip}</p>
            <p><strong>Country:</strong> {entry.country || 'N/A'}</p>
            <p><strong>Clicks:</strong> {entry.clicks}</p>
            <p><strong>Time:</strong> {entry.timestamp}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}