import Topbar from "@/components/Topbar";
import { Button } from "@/components/ui/button";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect, useMemo } from "react";
import FeaturedSection from "./components/FeaturedSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Brain, Clock3, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { buildStudyRecommendations } from "@/lib/focusRecommendations";
import { useFocusStore } from "@/stores/useFocusStore";

const HomePage = () => {
	const {
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchTrendingSongs,
		isLoading,
		madeForYouSongs,
		featuredSongs,
		trendingSongs,
	} = useMusicStore();

	const { initializeQueue } = usePlayerStore();
	const { totalFocusMinutes, completedSessions } = useFocusStore();

	useEffect(() => {
		fetchFeaturedSongs();
		fetchMadeForYouSongs();
		fetchTrendingSongs();
	}, [fetchFeaturedSongs, fetchMadeForYouSongs, fetchTrendingSongs]);

	useEffect(() => {
		if (madeForYouSongs.length > 0 && featuredSongs.length > 0 && trendingSongs.length > 0) {
			const allSongs = [...featuredSongs, ...madeForYouSongs, ...trendingSongs];
			initializeQueue(allSongs);
		}
	}, [initializeQueue, madeForYouSongs, trendingSongs, featuredSongs]);

	const recommendations = useMemo(
		() => buildStudyRecommendations({ featuredSongs, madeForYouSongs, trendingSongs }).slice(0, 3),
		[featuredSongs, madeForYouSongs, trendingSongs]
	);

	return (
		<main className='rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900 flex flex-col'>
			<Topbar />
			<ScrollArea className='flex-1 min-h-0'>
				<div className='p-4 sm:p-6'>
					<h1 className='text-2xl sm:text-3xl font-bold mb-6'>Good afternoon</h1>

					<section className='mb-8 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/15 via-zinc-900 to-zinc-900 p-5'>
						<div className='flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between'>
							<div className='max-w-2xl'>
								<div className='mb-2 flex items-center gap-2 text-emerald-300'>
									<Brain className='size-5' />
									<span className='text-sm font-medium uppercase tracking-[0.3em]'>Student Focus Toolkit</span>
								</div>
								<h2 className='text-2xl font-bold'>Turn your music app into a study companion</h2>
								<p className='mt-2 text-sm text-zinc-300 sm:text-base'>
									Use Focus Mode for Pomodoro sessions, background sounds, smart recommendations, and productivity tracking.
								</p>
							</div>

							<div className='flex flex-wrap gap-3'>
								<Button asChild className='bg-emerald-500 text-black hover:bg-emerald-400'>
									<Link to='/focus'>Open Focus Mode</Link>
								</Button>
								<div className='rounded-2xl border border-white/10 bg-black/20 px-4 py-3'>
									<div className='text-xs text-zinc-400'>Focus time</div>
									<div className='text-xl font-semibold'>{totalFocusMinutes} min</div>
								</div>
								<div className='rounded-2xl border border-white/10 bg-black/20 px-4 py-3'>
									<div className='text-xs text-zinc-400'>Sessions</div>
									<div className='text-xl font-semibold'>{completedSessions}</div>
								</div>
							</div>
						</div>
					</section>

					<section className='mb-8'>
						<div className='mb-4 flex items-center justify-between'>
							<div>
								<h2 className='text-xl sm:text-2xl font-bold'>Smart recommendations</h2>
								<p className='text-sm text-zinc-400'>Rule-based study playlists tailored for your current session.</p>
							</div>
							<Button asChild variant='link' className='text-sm text-zinc-400 hover:text-white'>
								<Link to='/focus'>See Focus Mode</Link>
							</Button>
						</div>

						<div className='grid gap-4 lg:grid-cols-3'>
							{recommendations.map((recommendation) => (
								<div key={recommendation.id} className='rounded-3xl border border-white/10 bg-zinc-900/60 p-5'>
									<div className='mb-3 flex items-center gap-2 text-emerald-300'>
										<Sparkles className='size-4' />
										<span className='text-xs uppercase tracking-[0.3em]'>{recommendation.bestFor}</span>
									</div>
									<h3 className='text-lg font-semibold'>{recommendation.title}</h3>
									<p className='mt-2 text-sm text-zinc-400'>{recommendation.reason}</p>
									<div className='mt-4 flex items-center gap-2 text-sm text-zinc-300'>
										<Clock3 className='size-4 text-zinc-400' />
										{recommendation.songs.length} songs ready to start
									</div>
								</div>
							))}
						</div>
					</section>

					<FeaturedSection />

					<div className='space-y-8'>
						<SectionGrid title='Made For You' songs={madeForYouSongs} isLoading={isLoading} />
						<SectionGrid title='Trending' songs={trendingSongs} isLoading={isLoading} />
					</div>
				</div>
			</ScrollArea>
		</main>
	);
};
export default HomePage;
