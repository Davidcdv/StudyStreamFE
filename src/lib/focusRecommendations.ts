import { Song } from "@/types";

type SongBuckets = {
	featuredSongs: Song[];
	madeForYouSongs: Song[];
	trendingSongs: Song[];
};

export type StudyRecommendation = {
	id: string;
	title: string;
	description: string;
	reason: string;
	songs: Song[];
	accentClass: string;
	bestFor: string;
};

const dedupeSongs = (songs: Song[]) => {
	const seen = new Set<string>();

	return songs.filter((song) => {
		if (seen.has(song._id)) return false;
		seen.add(song._id);
		return true;
	});
};

const buildPlaylist = (primary: Song[], secondary: Song[], fallback: Song[]) => {
	return dedupeSongs([...primary, ...secondary, ...fallback]).slice(0, 6);
};

export const buildStudyRecommendations = ({ featuredSongs, madeForYouSongs, trendingSongs }: SongBuckets) => {
	const now = new Date();
	const hour = now.getHours();
	const isLateNight = hour >= 22 || hour < 5;

	const deepFocusSongs = buildPlaylist(madeForYouSongs, featuredSongs, trendingSongs);
	const revisionSongs = buildPlaylist(featuredSongs, trendingSongs, madeForYouSongs);
	const lateNightSongs = buildPlaylist(madeForYouSongs.slice().reverse(), featuredSongs, trendingSongs);

	const recommendations: StudyRecommendation[] = [
		{
			id: "deep-focus",
			title: "Deep Focus",
			description: "Steady tracks for long reading sessions, coding blocks, and essay writing.",
			reason: "Best when you need long, uninterrupted concentration.",
			songs: deepFocusSongs,
			accentClass: "from-emerald-500/20 via-emerald-500/5 to-transparent",
			bestFor: "Long study blocks",
		},
		{
			id: "revision-mode",
			title: "Revision Mode",
			description: "A balanced study mix for reviewing notes, flashcards, and practice questions.",
			reason: "Great for medium-energy revision and repeated review cycles.",
			songs: revisionSongs,
			accentClass: "from-sky-500/20 via-sky-500/5 to-transparent",
			bestFor: "Review and recall",
		},
		{
			id: "late-night-study",
			title: "Late Night Study",
			description: isLateNight
				? "It is late, so the app shifts toward calmer tracks for a lower-pressure session."
				: "Saved for evening sessions, but available anytime if you want a calmer atmosphere.",
			reason: isLateNight
				? "Recommended now because it is after 10pm."
				: "Usually best after 10pm when you want something softer.",
			songs: lateNightSongs,
			accentClass: "from-violet-500/20 via-violet-500/5 to-transparent",
			bestFor: "Late sessions and wind-down study",
		},
	];

	return recommendations.filter((recommendation) => recommendation.songs.length > 0);
};

export const getPrimaryRecommendation = (recommendations: StudyRecommendation[]) => {
	if (recommendations.length === 0) return null;

	const hour = new Date().getHours();
	if (hour >= 22 || hour < 5) {
		return recommendations.find((recommendation) => recommendation.id === "late-night-study") ?? recommendations[0];
	}

	return recommendations[0];
};
