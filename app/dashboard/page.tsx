'use client';

import { useState, useEffect } from 'react';

interface AnalyticsEntry {
  id?: string;
  path: string;
  referrer: string;
  userAgent: string;
  timestamp: string;
  clicks?: number;
  ip?: string;
  country?: string;
  device?: string;
}

export default function Dashboard() {
  const [id, setId] = useState('');
  const [url, setUrl] = useState('');
  const [data, setData] = useState<AnalyticsEntry[]>([]);
  const [fetchedData, setFetchedData] = useState<AnalyticsEntry[]>([]);
  const [scriptTag, setScriptTag] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch('/api/analytics');
    if (response.ok) {
      const analyticsData = await response.json();
      setData(analyticsData);
    } else {
      console.error('Failed to fetch analytics data');
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch('/api/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id, // store as id
        path: url,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    });

    if (response.ok) {
      console.log('Tracked!');
      setScriptTag(`<script>window.SOLA_SITE_ID="${id}"</script>\n<script src="https://yourdomain.com/sola.js" defer></script>`);
      setId('');
      setUrl('');
      fetchData();
    } else {
      console.error('Tracking failed');
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptTag);
    alert('Script tag copied to clipboard!');
  };

  const handleFetchAnalytics = async (e: any) => {
    e.preventDefault();
    const match = data.filter(entry => entry.id === id);
    setFetchedData(match.length > 0 ? match : []);
  };

  const handleRefresh = fetchData;

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
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="bg-zinc-900 text-white border border-zinc-700 rounded-[14px] px-4 py-2 focus:outline-none"
          required
        />
        <button type="submit" className="bg-blue-600 hover:bg-blue-500 transition rounded-[14px] px-4 py-2">
          Track
        </button>
      </form>

      {/* Script Tag Display */}
      {scriptTag && (
        <div className="mb-4 w-full">
          <p className="text-white mb-2">Embed this into your site:</p>
          <textarea
            readOnly
            value={scriptTag}
            className="bg-zinc-900 text-white border border-zinc-700 rounded-[14px] px-4 py-2 w-full"
            rows={3}
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
          placeholder="Enter ID to filter"
          value={id}
          onChange={(e) => setId(e.target.value)}
          className="bg-zinc-900 text-white border border-zinc-700 rounded-[14px] px-4 py-2"
        />
        <button type="submit" className="bg-green-600 hover:bg-green-500 transition rounded-[14px] px-4 py-2">
          Filter
        </button>
        <button onClick={handleRefresh} type="button" className="bg-yellow-500 hover:bg-yellow-400 transition rounded-[14px] px-4 py-2">
          Refresh
        </button>
      </form>

      {/* Analytics List */}
      <ul className="space-y-4 mt-6">
        {(fetchedData.length > 0 ? fetchedData : data).map((entry, i) => (
          <li key={i} className="bg-white bg-opacity-5 text-zinc-200 rounded-[20px] p-6 shadow-lg">
            <p><strong>ID:</strong> {entry.id}</p>
            <p><strong>Path:</strong> {entry.path}</p>
            <p><strong>Referrer:</strong> {entry.referrer}</p>
            <p><strong>User Agent:</strong> {entry.userAgent}</p>
            <p><strong>IP:</strong> {entry.ip || 'N/A'}</p>
            <p><strong>Device:</strong> {entry.device}</p>
            <p><strong>Country:</strong> {entry.country}</p>
            <p><strong>Clicks:</strong> {entry.clicks ?? 0}</p>
            <p><strong>Time:</strong> {entry.timestamp}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
