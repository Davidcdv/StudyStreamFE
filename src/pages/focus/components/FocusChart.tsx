import { FocusHistoryEntry } from "@/stores/useFocusStore";

type FocusChartProps = {
	history: FocusHistoryEntry[];
};

const getLastSevenDays = () => {
	return Array.from({ length: 7 }, (_, index) => {
		const date = new Date();
		date.setDate(date.getDate() - (6 - index));
		return date;
	});
};

const FocusChart = ({ history }: FocusChartProps) => {
	const days = getLastSevenDays().map((date) => {
		const key = date.toISOString().slice(0, 10);
		const entry = history.find((item) => item.date === key);

		return {
			key,
			label: date.toLocaleDateString("en-GB", { weekday: "short" }),
			minutes: entry?.minutes ?? 0,
		};
	});

	const maxMinutes = Math.max(...days.map((day) => day.minutes), 25);

	return (
		<div className='rounded-2xl border border-white/10 bg-zinc-900/80 p-5'>
			<div className='mb-4 flex items-center justify-between'>
				<div>
					<h3 className='text-lg font-semibold text-white'>Weekly focus trend</h3>
					<p className='text-sm text-zinc-400'>Minutes completed over the last 7 days.</p>
				</div>
				<div className='rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200'>
					Simple productivity chart
				</div>
			</div>

			<div className='flex h-52 items-end gap-3'>
				{days.map((day) => {
					const barHeight = `${Math.max((day.minutes / maxMinutes) * 100, day.minutes > 0 ? 12 : 4)}%`;

					return (
						<div key={day.key} className='flex flex-1 flex-col items-center gap-3'>
							<div className='flex h-full w-full items-end'>
								<div
									className='w-full rounded-t-xl bg-gradient-to-t from-emerald-500 to-emerald-300 transition-all'
									style={{ height: barHeight }}
									title={`${day.minutes} minutes`}
								/>
							</div>
							<div className='text-center'>
								<div className='text-sm font-medium text-white'>{day.minutes}m</div>
								<div className='text-xs text-zinc-400'>{day.label}</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default FocusChart;
