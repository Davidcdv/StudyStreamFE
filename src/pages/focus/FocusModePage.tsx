import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { buildStudyRecommendations, getPrimaryRecommendation } from "@/lib/focusRecommendations";
import AmbientSoundEngine from "@/pages/focus/components/AmbientSoundEngine";
import FocusChart from "@/pages/focus/components/FocusChart";
import { useChatStore } from "@/stores/useChatStore";
import { useMusicStore } from "@/stores/useMusicStore";
import { AmbientSound, useFocusStore } from "@/stores/useFocusStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import toast from "react-hot-toast";
import {
	ArrowLeft,
	BarChart3,
	Brain,
	CirclePause,
	CirclePlay,
	CloudRain,
	Coffee,
	MoonStar,
	Shield,
	ShieldOff,
	SkipBack,
	SkipForward,
	Sparkles,
	TimerReset,
	VolumeX,
	Waves,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";

const ambientOptions: { id: AmbientSound; label: string; description: string; icon: typeof CloudRain }[] = [
	{
		id: "none",
		label: "Off",
		description: "Play only your music playlist without an ambient layer.",
		icon: VolumeX,
	},
	{
		id: "rain",
		label: "Rain",
		description: "Soft rain texture for deep concentration.",
		icon: CloudRain,
	},
	{
		id: "white-noise",
		label: "White Noise",
		description: "A steady neutral layer to mask distractions.",
		icon: Waves,
	},
	{
		id: "cafe",
		label: "Cafe",
		description: "A warm study-room ambience with a gentle hum.",
		icon: Coffee,
	},
];

const formatTimer = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const formatRecommendationStatus = (recommendationId: string | null) => {
	switch (recommendationId) {
		case "revision-mode":
			return "Revision Mode";
		case "late-night-study":
			return "Late Night Study";
		case "deep-focus":
		default:
			return "Deep Focus";
	}
};

const FocusModePage = () => {
	const {
		featuredSongs,
		madeForYouSongs,
		trendingSongs,
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchTrendingSongs,
		isLoading,
	} = useMusicStore();

	const { currentSong, isPlaying, playAlbum, togglePlay, playNext, playPrevious } = usePlayerStore();
	const { updateActivity } = useChatStore();
	const {
		sessionDurationMinutes,
		remainingSeconds,
		isSessionActive,
		isSessionPaused,
		completedSessions,
		totalFocusMinutes,
		history,
		selectedAmbientSound,
		distractionFree,
		activeRecommendationId,
		isLoading: isFocusLoading,
		startSession,
		pauseSession,
		resumeSession,
		resetSession,
		tick,
		loadFocusData,
		setSelectedAmbientSound,
		setDistractionFree,
		setActiveRecommendation,
	} = useFocusStore();

	useEffect(() => {
		if (featuredSongs.length === 0) {
			void fetchFeaturedSongs();
		}

		if (madeForYouSongs.length === 0) {
			void fetchMadeForYouSongs();
		}

		if (trendingSongs.length === 0) {
			void fetchTrendingSongs();
		}
	}, [
		featuredSongs.length,
		madeForYouSongs.length,
		trendingSongs.length,
		fetchFeaturedSongs,
		fetchMadeForYouSongs,
		fetchTrendingSongs,
	]);

	const recommendations = useMemo(
		() => buildStudyRecommendations({ featuredSongs, madeForYouSongs, trendingSongs }),
		[featuredSongs, madeForYouSongs, trendingSongs]
	);

	const selectedRecommendation = useMemo(() => {
		if (recommendations.length === 0) return null;

		return (
			recommendations.find((recommendation) => recommendation.id === activeRecommendationId) ??
			getPrimaryRecommendation(recommendations)
		);
	}, [activeRecommendationId, recommendations]);

	useEffect(() => {
		if (!selectedRecommendation) return;
		if (!activeRecommendationId) {
			setActiveRecommendation(selectedRecommendation.id);
		}
	}, [activeRecommendationId, selectedRecommendation, setActiveRecommendation]);

	useEffect(() => {
		if (!isSessionActive || isSessionPaused) return;

		const timer = window.setInterval(() => {
			tick();
		}, 1000);

		return () => window.clearInterval(timer);
	}, [isSessionActive, isSessionPaused, tick]);

	useEffect(() => {
		void loadFocusData();
	}, [loadFocusData]);

	const remainingMinutes = Math.ceil(remainingSeconds / 60);

	useEffect(() => {
		if (!isSessionActive) return;

		const focusState = isSessionPaused ? "Paused" : "Live";
		const modeLabel = formatRecommendationStatus(activeRecommendationId);
		const ambientLabel = ambientOptions.find((option) => option.id === selectedAmbientSound)?.label ?? "Off";

		updateActivity(`FOCUS|${focusState}|${modeLabel}|${ambientLabel}|${remainingMinutes} min left`);
	}, [activeRecommendationId, isSessionActive, isSessionPaused, remainingMinutes, selectedAmbientSound, updateActivity]);

	const handleStartSession = () => {
		if (!selectedRecommendation || selectedRecommendation.songs.length === 0) {
			toast.error("Load songs first so Focus Mode can auto-play a study playlist.");
			return;
		}

		playAlbum(selectedRecommendation.songs, 0);
		startSession(selectedRecommendation.id);
		toast.success(`Focus Mode started with ${selectedRecommendation.title}.`);
	};

	const handleRecommendationSelect = (recommendationId: string) => {
		setActiveRecommendation(recommendationId);
		const recommendation = recommendations.find((item) => item.id === recommendationId);
		if (recommendation && recommendation.songs.length > 0) {
			playAlbum(recommendation.songs, 0);
			toast.success(`${recommendation.title} playlist is ready.`);
		}
	};

	const hideSecondaryPanels = distractionFree && isSessionActive;

	return (
		<main className='h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18),_transparent_35%),linear-gradient(180deg,_#18181b_0%,_#09090b_100%)] text-white'>
			<AmbientSoundEngine sound={selectedAmbientSound} enabled={isSessionActive} />

			<ScrollArea className='h-full'>
				<div className='mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8'>
					<div className='flex flex-col gap-4 rounded-3xl border border-white/10 bg-black/30 p-5 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between'>
						<div>
							<div className='mb-2 flex items-center gap-2 text-emerald-300'>
								<Brain className='size-5' />
								<span className='text-sm font-medium uppercase tracking-[0.3em]'>Focus Mode</span>
							</div>
							<h1 className='text-3xl font-bold sm:text-4xl'>Study with fewer distractions</h1>
							<p className='mt-2 max-w-2xl text-sm text-zinc-300 sm:text-base'>
								Start a 25-minute Pomodoro, auto-play focus music, and track your study progress.
							</p>
						</div>

						<div className='flex flex-wrap items-center gap-3'>
							<Button asChild variant='outline' className='border-white/15 bg-white/5 text-white hover:bg-white/10'>
								<Link to='/app'>
									<ArrowLeft className='mr-2 size-4' />
									Back to Dashboard
								</Link>
							</Button>
							<Button
								variant='outline'
								className='border-white/15 bg-white/5 text-white hover:bg-white/10'
								onClick={() => setDistractionFree(!distractionFree)}
							>
								{distractionFree ? (
									<>
										<Shield className='mr-2 size-4' />
										Distraction shield on
									</>
								) : (
									<>
										<ShieldOff className='mr-2 size-4' />
										Distraction shield off
									</>
								)}
							</Button>
						</div>
					</div>

					<div className={`grid gap-6 ${hideSecondaryPanels ? "lg:grid-cols-1" : "lg:grid-cols-[1.2fr_0.8fr]"}`}>
						<section className='rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30'>
							<div className='flex flex-col gap-6'>
								<div className='flex flex-wrap items-start justify-between gap-4'>
									<div>
										<div className='mb-2 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-200'>
											{selectedRecommendation?.title ?? "Preparing recommendations"}
										</div>
										<h2 className='text-2xl font-semibold'>Current focus session</h2>
										<p className='mt-2 max-w-xl text-sm text-zinc-400'>
											{selectedRecommendation?.description ??
												"Focus Mode will recommend a playlist once the homepage songs finish loading."}
										</p>
									</div>

									<div className='rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right'>
										<div className='text-xs uppercase tracking-[0.3em] text-zinc-400'>Pomodoro</div>
										<div className='mt-1 text-lg font-semibold'>{sessionDurationMinutes} minutes</div>
									</div>
								</div>

								<div className='rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/15 via-transparent to-transparent p-6'>
									<div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
										<div>
											<div className='text-sm uppercase tracking-[0.3em] text-emerald-200'>Session timer</div>
											<div className='mt-3 text-6xl font-bold tracking-tight sm:text-7xl'>
												{formatTimer(remainingSeconds)}
											</div>
											<p className='mt-3 text-sm text-zinc-300'>
												{isSessionActive
													? isSessionPaused
														? "Paused. Resume whenever you are ready."
														: "Session is live. Extra panels are hidden while you focus."
													: "Press start to begin a focused 25-minute study session."}
											</p>
										</div>

										<div className='flex flex-wrap gap-3'>
											{!isSessionActive ? (
												<Button className='bg-emerald-500 text-black hover:bg-emerald-400' onClick={handleStartSession}>
													<CirclePlay className='mr-2 size-5' />
													Start session
												</Button>
											) : isSessionPaused ? (
												<Button className='bg-emerald-500 text-black hover:bg-emerald-400' onClick={resumeSession}>
													<CirclePlay className='mr-2 size-5' />
													Resume
												</Button>
											) : (
												<Button className='bg-white text-black hover:bg-zinc-200' onClick={pauseSession}>
													<CirclePause className='mr-2 size-5' />
													Pause
												</Button>
											)}

											<Button
												variant='outline'
												className='border-white/15 bg-white/5 text-white hover:bg-white/10'
												onClick={() => {
													resetSession();
													updateActivity("Idle");
												}}
											>
												<TimerReset className='mr-2 size-4' />
												Reset
											</Button>
										</div>
									</div>
								</div>

								<div className='grid gap-4 md:grid-cols-2'>
									<div className='rounded-2xl border border-white/10 bg-white/5 p-5'>
										<div className='mb-4 flex items-center justify-between'>
											<div>
												<h3 className='font-semibold'>Background sound</h3>
												<p className='text-sm text-zinc-400'>Layer ambient audio under your playlist.</p>
											</div>
											<Sparkles className='size-4 text-emerald-300' />
										</div>

										<div className='grid gap-3'>
											{ambientOptions.map((option) => {
												const Icon = option.icon;
												const isSelected = selectedAmbientSound === option.id;

												return (
													<button
														key={option.id}
														type='button'
														onClick={() => setSelectedAmbientSound(option.id)}
														className={`rounded-2xl border p-4 text-left transition ${
															isSelected
																? "border-emerald-400 bg-emerald-500/10"
																: "border-white/10 bg-zinc-900/70 hover:border-white/20 hover:bg-zinc-900"
														}`}
													>
														<div className='flex items-start gap-3'>
															<div className='rounded-xl bg-white/5 p-2'>
																<Icon className='size-4 text-emerald-200' />
															</div>
															<div>
																<div className='font-medium'>{option.label}</div>
																<div className='mt-1 text-sm text-zinc-400'>{option.description}</div>
															</div>
														</div>
													</button>
												);
											})}
										</div>
									</div>

									<div className='rounded-2xl border border-white/10 bg-white/5 p-5'>
										<div className='mb-4 flex items-center justify-between'>
											<div>
												<h3 className='font-semibold'>Now playing</h3>
												<p className='text-sm text-zinc-400'>Music auto-plays when your focus session starts.</p>
											</div>
											<MoonStar className='size-4 text-violet-300' />
										</div>

										{currentSong ? (
											<div className='space-y-4'>
												<div className='flex items-center gap-4'>
													<img
														src={currentSong.imageUrl}
														alt={currentSong.title}
														className='size-16 rounded-2xl object-cover'
													/>
													<div className='min-w-0'>
														<div className='truncate text-lg font-semibold'>{currentSong.title}</div>
														<div className='truncate text-sm text-zinc-400'>{currentSong.artist}</div>
													</div>
												</div>

												<div className='flex gap-2'>
													<Button
														size='icon'
														variant='outline'
														className='border-white/15 bg-white/5 text-white hover:bg-white/10'
														onClick={playPrevious}
													>
														<SkipBack className='size-4' />
													</Button>
													<Button className='bg-emerald-500 text-black hover:bg-emerald-400' onClick={togglePlay}>
														{isPlaying ? (
															<>
																<CirclePause className='mr-2 size-4' />
																Pause music
															</>
														) : (
															<>
																<CirclePlay className='mr-2 size-4' />
																Play music
															</>
														)}
													</Button>
													<Button
														size='icon'
														variant='outline'
														className='border-white/15 bg-white/5 text-white hover:bg-white/10'
														onClick={playNext}
													>
														<SkipForward className='size-4' />
													</Button>
												</div>
											</div>
										) : (
											<div className='rounded-2xl border border-dashed border-white/10 bg-zinc-900/70 p-5 text-sm text-zinc-400'>
												Start a focus session to automatically queue a study playlist here.
											</div>
										)}
									</div>
								</div>
							</div>
						</section>

						{!hideSecondaryPanels && (
							<aside className='grid gap-4'>
								<div className='rounded-3xl border border-white/10 bg-zinc-950/80 p-5'>
									<div className='mb-4 flex items-center gap-2'>
										<BarChart3 className='size-4 text-emerald-300' />
										<h3 className='font-semibold'>Productivity tracking</h3>
									</div>

									<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-1'>
										<div className='rounded-2xl bg-white/5 p-4'>
											<div className='text-sm text-zinc-400'>Total focus time</div>
											<div className='mt-2 text-3xl font-bold'>{totalFocusMinutes} min</div>
											<div className='mt-1 text-sm text-zinc-500'>All completed Pomodoro sessions.</div>
										</div>

										<div className='rounded-2xl bg-white/5 p-4'>
											<div className='text-sm text-zinc-400'>Sessions completed</div>
											<div className='mt-2 text-3xl font-bold'>{completedSessions}</div>
											<div className='mt-1 text-sm text-zinc-500'>Every finished 25-minute block is counted.</div>
										</div>
									</div>
								</div>

								<div className='rounded-3xl border border-white/10 bg-zinc-950/80 p-5'>
									<div className='mb-4 flex items-center gap-2'>
										<Shield className='size-4 text-emerald-300' />
										<h3 className='font-semibold'>Distraction control</h3>
									</div>
									<p className='text-sm leading-6 text-zinc-400'>
										When the distraction shield is on, this page hides the extra recommendation and analytics panels during
										active focus sessions so the timer and music stay center stage.
									</p>
								</div>
							</aside>
						)}
					</div>

					{hideSecondaryPanels ? (
						<div className='rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-5 text-sm text-emerald-100'>
							Minimal focus view is active. Secondary recommendation and chart panels are hidden until you pause or finish the
							session.
						</div>
					) : (
						<>
							<section className='rounded-3xl border border-white/10 bg-zinc-950/80 p-6'>
								<div className='mb-5 flex items-center gap-2'>
									<Sparkles className='size-5 text-emerald-300' />
									<div>
										<h2 className='text-xl font-semibold'>Smart study recommendations</h2>
										<p className='text-sm text-zinc-400'>
											Rule-based playlists adapt to your study mood and time of day.
										</p>
									</div>
								</div>

								{(isLoading || isFocusLoading) && recommendations.length === 0 ? (
									<div className='rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-sm text-zinc-400'>
										Loading songs so recommendations can be assembled.
									</div>
								) : (
									<div className='grid gap-4 lg:grid-cols-3'>
										{recommendations.map((recommendation) => (
											<div
												key={recommendation.id}
												className={`rounded-3xl border p-5 transition ${
													recommendation.id === selectedRecommendation?.id
														? "border-emerald-400 bg-emerald-500/10"
														: "border-white/10 bg-white/5"
												}`}
											>
												<div className={`mb-4 rounded-2xl bg-gradient-to-br ${recommendation.accentClass} p-4`}>
													<div className='mb-2 text-xs uppercase tracking-[0.3em] text-zinc-300'>{recommendation.bestFor}</div>
													<h3 className='text-xl font-semibold'>{recommendation.title}</h3>
													<p className='mt-2 text-sm text-zinc-300'>{recommendation.description}</p>
												</div>

												<p className='text-sm text-zinc-400'>{recommendation.reason}</p>

												<div className='mt-4 space-y-2'>
													{recommendation.songs.slice(0, 3).map((song) => (
														<div key={song._id} className='rounded-2xl bg-zinc-900/80 px-3 py-2 text-sm'>
															<div className='truncate font-medium text-white'>{song.title}</div>
															<div className='truncate text-zinc-400'>{song.artist}</div>
														</div>
													))}
												</div>

												<Button
													className='mt-4 w-full bg-white text-black hover:bg-zinc-200'
													onClick={() => handleRecommendationSelect(recommendation.id)}
												>
													Use this playlist
												</Button>
											</div>
										))}
									</div>
								)}
							</section>

							<FocusChart history={history} />
						</>
					)}
				</div>
			</ScrollArea>
		</main>
	);
};

export default FocusModePage;
