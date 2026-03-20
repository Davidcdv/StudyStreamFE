import { create } from "zustand";
import { Song } from "@/types";
import { useChatStore } from "./useChatStore";

interface PlayerStore {
	currentSong: Song | null;
	isPlaying: boolean;
	queue: Song[];
	currentIndex: number;
	isShuffleEnabled: boolean;
	isRepeatEnabled: boolean;

	initializeQueue: (songs: Song[]) => void;
	playAlbum: (songs: Song[], startIndex?: number) => void;
	setCurrentSong: (song: Song | null) => void;
	togglePlay: () => void;
	toggleShuffle: () => void;
	toggleRepeat: () => void;
	playNext: () => void;
	playPrevious: () => void;
}

export const usePlayerStore = create<PlayerStore>((set, get) => ({
	currentSong: null,
	isPlaying: false,
	queue: [],
	currentIndex: -1,
	isShuffleEnabled: false,
	isRepeatEnabled: false,

	initializeQueue: (songs: Song[]) => {
		set({
			queue: songs,
			currentSong: get().currentSong || songs[0],
			currentIndex: get().currentIndex === -1 ? 0 : get().currentIndex,
		});
	},

	playAlbum: (songs: Song[], startIndex = 0) => {
		if (songs.length === 0) return;

		const song = songs[startIndex];

		useChatStore.getState().updateActivity(`MUSIC|${song.title}|${song.artist}`);
		set({
			queue: songs,
			currentSong: song,
			currentIndex: startIndex,
			isPlaying: true,
		});
	},

	setCurrentSong: (song: Song | null) => {
		if (!song) return;

		useChatStore.getState().updateActivity(`MUSIC|${song.title}|${song.artist}`);

		const songIndex = get().queue.findIndex((s) => s._id === song._id);
		set({
			currentSong: song,
			isPlaying: true,
			currentIndex: songIndex !== -1 ? songIndex : get().currentIndex,
		});
	},

	togglePlay: () => {
		const willStartPlaying = !get().isPlaying;

		const currentSong = get().currentSong;
		useChatStore
			.getState()
			.updateActivity(willStartPlaying && currentSong ? `MUSIC|${currentSong.title}|${currentSong.artist}` : "Idle");

		set({
			isPlaying: willStartPlaying,
		});
	},

	toggleShuffle: () => {
		set((state) => ({
			isShuffleEnabled: !state.isShuffleEnabled,
		}));
	},

	toggleRepeat: () => {
		set((state) => ({
			isRepeatEnabled: !state.isRepeatEnabled,
		}));
	},

	playNext: () => {
		const { currentIndex, queue, isShuffleEnabled } = get();
		if (queue.length === 0) return;

		let nextIndex = currentIndex + 1;

		if (isShuffleEnabled && queue.length > 1) {
			do {
				nextIndex = Math.floor(Math.random() * queue.length);
			} while (nextIndex === currentIndex);
		}

		// if there is a next song to play, let's play it
		if (nextIndex < queue.length) {
			const nextSong = queue[nextIndex];

			useChatStore.getState().updateActivity(`MUSIC|${nextSong.title}|${nextSong.artist}`);

			set({
				currentSong: nextSong,
				currentIndex: nextIndex,
				isPlaying: true,
			});
		} else {
			// no next song
			set({ isPlaying: false });

			useChatStore.getState().updateActivity("Idle");
		}
	},
	playPrevious: () => {
		const { currentIndex, queue } = get();
		const prevIndex = currentIndex - 1;

		// theres a prev song
		if (prevIndex >= 0) {
			const prevSong = queue[prevIndex];

			useChatStore.getState().updateActivity(`MUSIC|${prevSong.title}|${prevSong.artist}`);

			set({
				currentSong: prevSong,
				currentIndex: prevIndex,
				isPlaying: true,
			});
		} else {
			// no prev song
			set({ isPlaying: false });

			useChatStore.getState().updateActivity("Idle");
		}
	},
}));
