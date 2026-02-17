"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchForm() {
  const [riotId, setRiotId] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!riotId.includes("#")) {
      setError("Please use the format GameName#Tag");
      return;
    }

    const [gameName, tagLine] = riotId.split("#");
    if (!gameName || !tagLine) {
      setError("Invalid Riot ID format.");
      return;
    }

    // Redirect to profile page. encoding the parts to ensure URL safety
    // Using a hyphen as separator for the route param: /profile/GameName-Tag
    // Note: If GameName contains invalid URL chars, we might need more robust encoding,
    // but for now simple replacement or encoding is enough.
    // Let's use standard URL encoding for safety.
    const encodedId = `${encodeURIComponent(gameName)}-${encodeURIComponent(tagLine)}`;
    router.push(`/profile/${encodedId}`);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-full max-w-md"
    >
      <div className="flex flex-col gap-2">
        <label
          htmlFor="riot-id"
          className="text-sm font-medium text-zinc-700 dark:text-zinc-300"
        >
          Enter Riot ID
        </label>
        <div className="flex gap-2">
          <input
            id="riot-id"
            type="text"
            value={riotId}
            onChange={(e) => setRiotId(e.target.value)}
            placeholder="SummonerName#BR1"
            className="flex-1 rounded-md border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            Search
          </button>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </form>
  );
}
