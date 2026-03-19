import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useChatStore } from "./useChatStore";

export type AmbientSound = "none" | "rain" | "white-noise" | "cafe";

export type FocusHistoryEntry = {
	date: string;
	minutes: number;
	sessions: number;
};

interface FocusStore {
	sessionDurationMinutes: number;
	remainingSeconds: number;
	isSessionActive: boolean;
	isSessionPaused: boolean;
	sessionStartedAt: string | null;
	completedSessions: number;
	totalFocusMinutes: number;
	history: FocusHistoryEntry[];
	selectedAmbientSound: AmbientSound;
	distractionFree: boolean;
	activeRecommendationId: string | null;
	isLoading: boolean;

	startSession: (recommendationId?: string) => void;
	pauseSession: () => void;
	resumeSession: () => void;
	resetSession: () => void;
	tick: () => void;
	completeSession: () => Promise<void>;
	loadFocusData: () => Promise<void>;
	setSelectedAmbientSound: (sound: AmbientSound) => void;
	setDistractionFree: (enabled: boolean) => void;
	setActiveRecommendation: (id: string) => void;
}

const SESSION_DURATION_MINUTES = 25;

const getTodayKey = () => new Date().toISOString().slice(0, 10);

const buildLocalHistory = (history: FocusHistoryEntry[], sessionDurationMinutes: number) => {
	const today = getTodayKey();
	const existingEntry = history.find((entry) => entry.date === today);

	return existingEntry
		? history.map((entry) =>
				entry.date === today
					? {
							...entry,
							minutes: entry.minutes + sessionDurationMinutes,
							sessions: entry.sessions + 1,
					  }
					: entry
		  )
		: [
				...history,
				{
					date: today,
					minutes: sessionDurationMinutes,
					sessions: 1,
				},
		  ];
};

export const useFocusStore = create<FocusStore>()(
	persist(
		(set, get) => ({
			sessionDurationMinutes: SESSION_DURATION_MINUTES,
			remainingSeconds: SESSION_DURATION_MINUTES * 60,
			isSessionActive: false,
			isSessionPaused: false,
			sessionStartedAt: null,
			completedSessions: 0,
			totalFocusMinutes: 0,
			history: [],
			selectedAmbientSound: "rain",
			distractionFree: true,
			activeRecommendationId: null,
			isLoading: false,

			startSession: (recommendationId) =>
				set((state) => ({
					isSessionActive: true,
					isSessionPaused: false,
					remainingSeconds: state.sessionDurationMinutes * 60,
					sessionStartedAt: new Date().toISOString(),
					activeRecommendationId: recommendationId ?? state.activeRecommendationId,
				})),

			pauseSession: () => set({ isSessionPaused: true }),
			resumeSession: () => set({ isSessionPaused: false }),

			resetSession: () =>
				set((state) => ({
					isSessionActive: false,
					isSessionPaused: false,
					remainingSeconds: state.sessionDurationMinutes * 60,
					sessionStartedAt: null,
				})),

			tick: () => {
				const { isSessionActive, isSessionPaused, remainingSeconds } = get();
				if (!isSessionActive || isSessionPaused) return;

				if (remainingSeconds <= 1) {
					void get().completeSession();
					return;
				}

				set({ remainingSeconds: remainingSeconds - 1 });
			},

			completeSession: async () => {
				const state = get();
				const localHistory = buildLocalHistory(state.history, state.sessionDurationMinutes);
				const resetState = {
					isSessionActive: false,
					isSessionPaused: false,
					remainingSeconds: state.sessionDurationMinutes * 60,
					sessionStartedAt: null,
				};

				try {
					await axiosInstance.post("/focus/sessions", {
						durationMinutes: state.sessionDurationMinutes,
						mode: state.activeRecommendationId ?? "deep-focus",
						ambientSound: state.selectedAmbientSound,
						startedAt: state.sessionStartedAt,
						completedAt: new Date().toISOString(),
					});

					set(resetState);
					useChatStore.getState().updateActivity("Idle");
					await get().loadFocusData();
				} catch (error) {
					set({
						...resetState,
						completedSessions: state.completedSessions + 1,
						totalFocusMinutes: state.totalFocusMinutes + state.sessionDurationMinutes,
						history: localHistory,
					});
					useChatStore.getState().updateActivity("Idle");
				}
			},

			loadFocusData: async () => {
				set({ isLoading: true });

				try {
					const [statsResponse, historyResponse] = await Promise.all([
						axiosInstance.get("/focus/stats"),
						axiosInstance.get("/focus/history", {
							params: { days: 7 },
						}),
					]);

					set({
						completedSessions: statsResponse.data.completedSessions ?? 0,
						totalFocusMinutes: statsResponse.data.totalFocusMinutes ?? 0,
						history: Array.isArray(historyResponse.data) ? historyResponse.data : [],
					});
				} catch (error) {
					// Keep the locally persisted values if the user is not signed in or the local backend is unavailable.
				} finally {
					set({ isLoading: false });
				}
			},

			setSelectedAmbientSound: (sound) => set({ selectedAmbientSound: sound }),
			setDistractionFree: (enabled) => set({ distractionFree: enabled }),
			setActiveRecommendation: (id) => set({ activeRecommendationId: id }),
		}),
		{
			name: "focus-mode-storage",
			partialize: (state) => ({
				sessionDurationMinutes: state.sessionDurationMinutes,
				remainingSeconds: state.remainingSeconds,
				isSessionActive: state.isSessionActive,
				isSessionPaused: state.isSessionPaused,
				sessionStartedAt: state.sessionStartedAt,
				completedSessions: state.completedSessions,
				totalFocusMinutes: state.totalFocusMinutes,
				history: state.history,
				selectedAmbientSound: state.selectedAmbientSound,
				distractionFree: state.distractionFree,
				activeRecommendationId: state.activeRecommendationId,
			}),
		}
	)
);
