import { AmbientSound } from "@/stores/useFocusStore";
import { useEffect } from "react";

type AmbientSoundEngineProps = {
	sound: AmbientSound;
	enabled: boolean;
	volume: number;
};

type AmbientNodes = {
	source: AudioBufferSourceNode;
	filter?: BiquadFilterNode;
	gain: GainNode;
	humOscillator?: OscillatorNode;
	humGain?: GainNode;
};

const createNoiseSource = (audioContext: AudioContext) => {
	const bufferSize = audioContext.sampleRate * 2;
	const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
	const data = buffer.getChannelData(0);

	for (let index = 0; index < bufferSize; index += 1) {
		data[index] = Math.random() * 2 - 1;
	}

	const source = audioContext.createBufferSource();
	source.buffer = buffer;
	source.loop = true;

	return source;
};

const stopNodes = (nodes: AmbientNodes | null) => {
	if (!nodes) return;

	nodes.source.stop();
	nodes.source.disconnect();
	nodes.filter?.disconnect();
	nodes.gain.disconnect();
	nodes.humOscillator?.stop();
	nodes.humOscillator?.disconnect();
	nodes.humGain?.disconnect();
};

const AmbientSoundEngine = ({ sound, enabled, volume }: AmbientSoundEngineProps) => {
	useEffect(() => {
		if (!enabled || sound === "none") return;

		const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
		if (!AudioContextClass) return;

		const audioContext = new AudioContextClass();
		let currentNodes: AmbientNodes | null = null;

		const buildNodes = () => {
			const source = createNoiseSource(audioContext);
			const gain = audioContext.createGain();
			const volumeMultiplier = Math.max(volume, 0) / 100;
			gain.gain.value = 0.03 * volumeMultiplier;

			if (sound === "white-noise") {
				source.connect(gain);
				gain.connect(audioContext.destination);
				source.start();
				return { source, gain };
			}

			if (sound === "rain") {
				const filter = audioContext.createBiquadFilter();
				filter.type = "highpass";
				filter.frequency.value = 900;
				gain.gain.value = 0.025 * volumeMultiplier;

				source.connect(filter);
				filter.connect(gain);
				gain.connect(audioContext.destination);
				source.start();

				return { source, filter, gain };
			}

			const filter = audioContext.createBiquadFilter();
			filter.type = "bandpass";
			filter.frequency.value = 400;
			filter.Q.value = 0.7;

			const humOscillator = audioContext.createOscillator();
			humOscillator.type = "triangle";
			humOscillator.frequency.value = 180;

			const humGain = audioContext.createGain();
			humGain.gain.value = 0.008 * volumeMultiplier;
			gain.gain.value = 0.018 * volumeMultiplier;

			source.connect(filter);
			filter.connect(gain);
			gain.connect(audioContext.destination);

			humOscillator.connect(humGain);
			humGain.connect(audioContext.destination);

			source.start();
			humOscillator.start();

			return { source, filter, gain, humOscillator, humGain };
		};

		void audioContext.resume().then(() => {
			currentNodes = buildNodes();
		});

		return () => {
			stopNodes(currentNodes);
			void audioContext.close();
		};
	}, [enabled, sound, volume]);

	return null;
};

export default AmbientSoundEngine;
