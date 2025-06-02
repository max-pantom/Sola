"use client"

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
  browser?: string;
}

export default function Dashboard() {
  const [id, setId] = useState('');
  const [url, setUrl] = useState('');
  const [data, setData] = useState<AnalyticsEntry[]>([]);
  const [fetchedData, setFetchedData] = useState<AnalyticsEntry[]>([]);
  const [scriptTag, setScriptTag] = useState('');
  const [topIds, setTopIds] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const savedId = localStorage.getItem('sola-last-id');
    if (savedId) {
      setId(savedId);
      fetch(`/api/analytics/${savedId}`)
        .then((res) => res.json())
        .then(setFetchedData);
    } else {
      fetchData();
    }

    fetch("/api/top-ids")
      .then(res => res.json())
      .then(setTopIds);
  }, []);

  const fetchData = async () => {
    const response = await fetch('/api/analytics');
    if (response.ok) {
      const analyticsData = await response.json();
      setData(analyticsData);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const response = await fetch('/api/collect', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        path: url,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
      }),
    });

    if (response.ok) {
      setScriptTag(`<script>window.SOLA_SITE_ID=\"${id}\"</script>\n<script src=\"https://yourdomain.com/sola.js\" defer></script>`);
      setId('');
      setUrl('');
      fetchData();
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

  const handleRefresh = () => {
    fetchData();
    fetch("/api/top-ids")
      .then(res => res.json())
      .then(setTopIds);
  };

  const handleClickDetails = async (clickedId: string) => {
    setId(clickedId);
    localStorage.setItem('sola-last-id', clickedId);
    const res = await fetch(`/api/analytics/${clickedId}`);
    const data = await res.json();
    setFetchedData(data);
  };

  const filteredData = (fetchedData.length > 0 ? fetchedData : data).filter(entry =>
    entry.path.toLowerCase().includes(filter.toLowerCase()) ||
    entry.country?.toLowerCase().includes(filter.toLowerCase()) ||
    entry.device?.toLowerCase().includes(filter.toLowerCase()) ||
    entry.browser?.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sola Analytics Dashboard</h1>
        <button
          onClick={handleRefresh}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-xl shadow"
        >
          Refresh
        </button>
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="col-span-2">
          <h2 className="text-lg font-semibold mb-4">🖱️ Clicks by Site ID</h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topIds.map((item: any, i) => (
              <li
                key={i}
                onClick={() => handleClickDetails(item.id)}
                className="bg-zinc-800 hover:bg-zinc-700 hover:shadow-xl transition-all cursor-pointer p-4 rounded-2xl shadow"
              >
                <div className="text-xl font-bold">{item.id}</div>
                <div className="text-zinc-400">{item.clicks} Clicks</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-zinc-900 p-4 rounded-2xl shadow h-fit">
          <h3 className="text-lg font-semibold mb-3">📎 Embed Tracker</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Site ID"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-zinc-800 text-white border border-zinc-700"
              required
            />
            <input
              type="text"
              placeholder="Page Path"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 rounded-xl bg-zinc-800 text-white border border-zinc-700"
              required
            />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-xl font-semibold">
              Generate Script
            </button>
          </form>

          {scriptTag && (
            <div className="mt-4">
              <textarea
                readOnly
                value={scriptTag}
                className="w-full h-24 p-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
              />
              <button
                onClick={handleCopyScript}
                className="w-full mt-2 bg-green-600 hover:bg-green-500 px-4 py-2 rounded-xl font-semibold"
              >
                Copy Script Tag
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Filter by path, device, country, browser..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded-xl bg-zinc-800 text-white border border-zinc-700"
        />
      </div>

      <h2 className="text-lg font-semibold mb-4">📊 Click Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((entry, i) => (
          <div key={i} className="bg-zinc-900 p-5 rounded-2xl shadow hover:shadow-2xl transition-all">
            <div className="text-sm text-zinc-400 mb-2">{new Date(entry.timestamp).toLocaleString()}</div>
            <div><strong>ID:</strong> {entry.id}</div>
            <div><strong>Path:</strong> {entry.path}</div>
            <div><strong>Referrer:</strong> {entry.referrer}</div>
            <div><strong>Browser:</strong> {entry.browser}</div>
            <div><strong>Device:</strong> {entry.device}</div>
            <div><strong>Country:</strong> {entry.country}</div>
            <div><strong>IP:</strong> {entry.ip}</div>
            <div><strong>Clicks:</strong> {entry.clicks ?? 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
