import { getAccountByRiotId, getSummonerByPuuid } from "@/services/riotApi";
import Image from "next/image";
import Link from "next/link";

interface ProfilePageProps {
  params: {
    riotId: string;
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  // Decode parameters: GameName-Tag -> GameName, Tag
  // "GameName-Tag" format is assumed from SearchForm
  // TODO: Handle cases where GameName itself has hyphens if necessary (requires better delimiter or query params)
  // For this initial version, last index of hyphen is the separator?
  // Riot IDs can have spaces, handled by URL encoding.
  // Ideally, using a route like /profile/[gameName]/[tagLine] would be cleaner,
  // but let's parse the current convention.

  const decodedId = decodeURIComponent(params.riotId);
  const lastHyphenIndex = decodedId.lastIndexOf("-");

  const gameName = decodedId.substring(0, lastHyphenIndex);
  const tagLine = decodedId.substring(lastHyphenIndex + 1);

  let account = null;
  let summoner = null;
  let error = null;

  try {
    if (lastHyphenIndex === -1)
      throw new Error("Invalid URL format. Expected Name-Tag");

    console.log(`Fetching Account: ${gameName} #${tagLine}`);
    account = await getAccountByRiotId(gameName, tagLine);

    console.log(`Fetching Summoner by PUUID: ${account.puuid}`);
    summoner = await getSummonerByPuuid(account.puuid);
  } catch (err: any) {
    // eslint-disable-line @typescript-eslint/no-explicit-any
    console.error("Profile Load Error:", err);
    error = err.message || "Failed to load profile";
  }

  if (error) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24">
        <h1 className="text-2xl text-red-500 mb-4">Error</h1>
        <p>{error}</p>
        <Link href="/" className="mt-8 text-blue-500 hover:underline">
          Return Home
        </Link>
      </main>
    );
  }

  if (!account || !summoner) {
    return <div className="p-24 text-center">Loading...</div>;
  }

  // Profile Icon Logic
  // Using DataDragon for latest version. Ideally should fetch latest version or cache it.
  // Starting with a hardcoded version for initial verification.
  const ddragonVersion = "14.3.1";
  const iconUrl = `https://ddragon.leagueoflegends.com/cdn/${ddragonVersion}/img/profileicon/${summoner.profileIconId}.png`;

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <div className="w-full max-w-4xl">
        <Link
          href="/"
          className="text-zinc-500 hover:text-zinc-200 mb-8 inline-block"
        >
          &larr; Back to Search
        </Link>

        <div className="flex flex-col md:flex-row items-center gap-8 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800">
          <div className="relative">
            <Image
              src={iconUrl}
              alt="Profile Icon"
              width={128}
              height={128}
              className="rounded-full border-4 border-blue-500 shadow-lg"
              priority
              unoptimized // DataDragon URLs
            />
            <span className="absolute -bottom-2 -right-2 bg-zinc-800 text-white px-3 py-1 rounded-full text-sm font-bold border border-zinc-700">
              {summoner.summonerLevel}
            </span>
          </div>

          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-white mb-2">
              {account.gameName}
              <span className="text-zinc-500 text-2xl font-normal ml-2">
                #{account.tagLine}
              </span>
            </h1>
            <p className="text-zinc-400">
              PUUID: <span className="font-mono text-xs">{account.puuid}</span>
            </p>
          </div>
        </div>

        {/* Placeholder for Match History / Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 h-64 flex items-center justify-center text-zinc-600">
            Ranked Stats (Coming Soon)
          </div>
          <div className="bg-zinc-900/30 p-6 rounded-xl border border-zinc-800 h-64 md:col-span-2 flex items-center justify-center text-zinc-600">
            Match History (Coming Soon)
          </div>
        </div>
      </div>
    </main>
  );
}
