import { ScrollArea } from "@/components/ui/scroll-area";
import { useFocusStore } from "@/stores/useFocusStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { BarChart3, Brain, Clock3, Lightbulb, MoonStar, Sparkles, Volume2 } from "lucide-react";

const formatRecommendationLabel = (recommendationId: string | null) => {
	switch (recommendationId) {
		case "revision-mode":
			return "Revision Mode";
		case "late-night-study":
			return "Late Night Study";
		case "deep-focus":
			return "Deep Focus";
		default:
			return "Ready to choose";
	}
};

const getAmbientLabel = (ambientSound: string) => {
	switch (ambientSound) {
		case "white-noise":
			return "White Noise";
		case "cafe":
			return "Cafe";
		case "rain":
			return "Rain";
		default:
			return "Off";
	}
};

const getStudyTip = (completedSessions: number, totalFocusMinutes: number, isSessionActive: boolean) => {
	if (isSessionActive) {
		return "Stay with one task until the timer ends. Context switching is the biggest focus killer.";
	}

	if (completedSessions >= 4) {
		return "You have done a solid amount of focused work today. Take a proper longer break before your next block.";
	}

	if (totalFocusMinutes >= 50) {
		return "You are building momentum. Pair the next session with a short recap before you start.";
	}

	return "Start with just one 25-minute block. Small, repeatable sessions beat long unstructured study.";
};

const FriendsActivity = () => {
	const {
		totalFocusMinutes,
		completedSessions,
		remainingSeconds,
		isSessionActive,
		isSessionPaused,
		selectedAmbientSound,
		activeRecommendationId,
		history,
	} = useFocusStore();
	const { currentSong, isPlaying } = usePlayerStore();

	const todayKey = new Date().toISOString().slice(0, 10);
	const todaysHistory = history.find((entry) => entry.date === todayKey);
	const todaysMinutes = todaysHistory?.minutes ?? 0;
	const todaysSessions = todaysHistory?.sessions ?? 0;
	const remainingMinutes = Math.ceil(remainingSeconds / 60);
	const currentMode = formatRecommendationLabel(activeRecommendationId);
	const ambientLabel = getAmbientLabel(selectedAmbientSound);
	const studyTip = getStudyTip(completedSessions, totalFocusMinutes, isSessionActive);
	const currentStatus = isSessionActive ? (isSessionPaused ? "Paused" : "In Focus Session") : "Ready for next session";

	return (
		<div className='h-full bg-zinc-900 rounded-lg flex flex-col'>
			<div className='p-4 flex justify-between items-center border-b border-zinc-800'>
				<div className='flex items-center gap-2'>
					<Brain className='size-5 shrink-0 text-emerald-300' />
					<div>
						<h2 className='font-semibold'>Focus Insights</h2>
						<p className='text-xs text-zinc-400'>Your live study snapshot and quick productivity cues</p>
					</div>
				</div>
			</div>

			<ScrollArea className='flex-1'>
				<div className='p-4 space-y-4'>
					<div className='rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/15 via-transparent to-transparent p-4'>
						<div className='flex items-center justify-between gap-3'>
							<div>
								<div className='text-[11px] uppercase tracking-[0.28em] text-emerald-300'>Current Status</div>
								<div className='mt-2 text-lg font-semibold text-white'>{currentStatus}</div>
								<div className='mt-1 text-sm text-zinc-400'>
									{isSessionActive ? `${currentMode} • ${remainingMinutes} min left` : "Start Focus Mode to begin a Pomodoro block"}
								</div>
							</div>
							<div className='rounded-2xl border border-white/10 bg-black/20 px-3 py-2 text-right'>
								<div className='text-xs text-zinc-400'>Today</div>
								<div className='text-xl font-semibold text-white'>{todaysMinutes} min</div>
							</div>
						</div>
					</div>

					<div className='grid gap-3'>
						<div className='rounded-2xl border border-white/10 bg-zinc-800/60 p-4'>
							<div className='flex items-center gap-2 text-zinc-300'>
								<BarChart3 className='size-4 text-emerald-300' />
								<span className='text-sm font-medium'>Productivity</span>
							</div>
							<div className='mt-3 grid grid-cols-2 gap-3'>
								<div className='rounded-xl bg-black/20 p-3'>
									<div className='text-xs text-zinc-400'>Sessions today</div>
									<div className='mt-1 text-2xl font-semibold text-white'>{todaysSessions}</div>
								</div>
								<div className='rounded-xl bg-black/20 p-3'>
									<div className='text-xs text-zinc-400'>Total minutes</div>
									<div className='mt-1 text-2xl font-semibold text-white'>{totalFocusMinutes}</div>
								</div>
							</div>
						</div>

						<div className='rounded-2xl border border-white/10 bg-zinc-800/60 p-4'>
							<div className='flex items-center gap-2 text-zinc-300'>
								<Sparkles className='size-4 text-violet-300' />
								<span className='text-sm font-medium'>Study setup</span>
							</div>
							<div className='mt-3 space-y-3'>
								<div className='flex items-center justify-between rounded-xl bg-black/20 p-3'>
									<div className='flex items-center gap-2 text-sm text-zinc-300'>
										<Brain className='size-4 text-emerald-300' />
										Current mode
									</div>
									<div className='text-sm font-medium text-white'>{currentMode}</div>
								</div>
								<div className='flex items-center justify-between rounded-xl bg-black/20 p-3'>
									<div className='flex items-center gap-2 text-sm text-zinc-300'>
										<Volume2 className='size-4 text-sky-300' />
										Ambient sound
									</div>
									<div className='text-sm font-medium text-white'>{ambientLabel}</div>
								</div>
								<div className='flex items-center justify-between rounded-xl bg-black/20 p-3'>
									<div className='flex items-center gap-2 text-sm text-zinc-300'>
										<Clock3 className='size-4 text-amber-300' />
										Pomodoro length
									</div>
									<div className='text-sm font-medium text-white'>25 min</div>
								</div>
							</div>
						</div>

						<div className='rounded-2xl border border-white/10 bg-zinc-800/60 p-4'>
							<div className='flex items-center gap-2 text-zinc-300'>
								<MoonStar className='size-4 text-sky-300' />
								<span className='text-sm font-medium'>Now playing</span>
							</div>
							<div className='mt-3 rounded-xl bg-black/20 p-3'>
								{currentSong ? (
									<>
										<div className='text-sm font-medium text-white truncate'>{currentSong.title}</div>
										<div className='mt-1 text-xs text-zinc-400 truncate'>{currentSong.artist}</div>
										<div className='mt-2 text-[11px] uppercase tracking-[0.24em] text-emerald-300'>
											{isPlaying ? "Playing" : "Paused"}
										</div>
									</>
								) : (
									<>
										<div className='text-sm font-medium text-white'>No track selected</div>
										<div className='mt-1 text-xs text-zinc-400'>Choose a study playlist or start Focus Mode to auto-play music</div>
									</>
								)}
							</div>
						</div>

						<div className='rounded-2xl border border-white/10 bg-zinc-800/60 p-4'>
							<div className='flex items-center gap-2 text-zinc-300'>
								<Lightbulb className='size-4 text-amber-300' />
								<span className='text-sm font-medium'>Focus tip</span>
							</div>
							<p className='mt-3 text-sm leading-6 text-zinc-300'>{studyTip}</p>
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};
export default FriendsActivity;
