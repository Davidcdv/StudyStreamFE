import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMusicStore } from "@/stores/useMusicStore";
import { usePlayerStore } from "@/stores/usePlayerStore";
import { Clock, Pause, Play } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export const formatDuration = (seconds: number) => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

const AlbumPage = () => {
	const { albumId } = useParams();
	const { fetchAlbumById, currentAlbum, isLoading } = useMusicStore();
	const { currentSong, isPlaying, playAlbum, togglePlay } = usePlayerStore();

	useEffect(() => {
		if (albumId) fetchAlbumById(albumId);
	}, [fetchAlbumById, albumId]);

	if (isLoading) return null;

	const handlePlayAlbum = () => {
		if (!currentAlbum) return;

		const isCurrentAlbumPlaying = currentAlbum?.songs.some((song) => song._id === currentSong?._id);
		if (isCurrentAlbumPlaying) togglePlay();
		else {
			// start playing the album from the beginning
			playAlbum(currentAlbum?.songs, 0);
		}
	};

	const handlePlaySong = (index: number) => {
		if (!currentAlbum) return;

		playAlbum(currentAlbum?.songs, index);
	};

	return (
		<div className='h-full'>
			<ScrollArea className='h-full rounded-md'>
				{/* Main Content */}
				<div className='relative min-h-full'>
					{/* bg gradient */}
					<div
						className='absolute inset-0 bg-gradient-to-b from-[#5038a0]/80 via-zinc-900/80
					 to-zinc-900 pointer-events-none'
						aria-hidden='true'
					/>

					{/* Content */}
					<div className='relative z-10'>
						<div className='flex flex-col p-4 gap-5 pb-6 sm:p-6 sm:gap-6 sm:pb-8 md:flex-row'>
							<img
								src={currentAlbum?.imageUrl}
								alt={currentAlbum?.title}
								className='h-[220px] w-[220px] self-center rounded shadow-xl sm:h-[240px] sm:w-[240px] md:self-auto'
							/>
							<div className='flex flex-col justify-end'>
								<p className='text-sm font-medium'>Album</p>
								<h1 className='my-3 text-3xl font-bold leading-tight sm:my-4 sm:text-5xl lg:text-7xl'>
									{currentAlbum?.title}
								</h1>
								<div className='flex flex-wrap items-center gap-2 text-sm text-zinc-100'>
									<span className='font-medium text-white'>{currentAlbum?.artist}</span>
									<span>• {currentAlbum?.songs.length} songs</span>
									<span>• {currentAlbum?.releaseYear}</span>
								</div>
							</div>
						</div>

						{/* play button */}
						<div className='flex items-center gap-6 px-4 pb-4 sm:px-6'>
							<Button
								onClick={handlePlayAlbum}
								size='icon'
								className='h-12 w-12 rounded-full bg-green-500 hover:bg-green-400 
								sm:h-14 sm:w-14
                hover:scale-105 transition-all'
							>
								{isPlaying && currentAlbum?.songs.some((song) => song._id === currentSong?._id) ? (
									<Pause className='h-6 w-6 text-black sm:h-7 sm:w-7' />
								) : (
									<Play className='h-6 w-6 text-black sm:h-7 sm:w-7' />
								)}
							</Button>
						</div>

						{/* Table Section */}
						<div className='bg-black/20 backdrop-blur-sm'>
							{/* table header */}
							<div
								className='hidden md:grid grid-cols-[16px_4fr_2fr_1fr] gap-4 px-10 py-2 text-sm 
            text-zinc-400 border-b border-white/5'
							>
								<div>#</div>
								<div>Title</div>
								<div>Released Date</div>
								<div>
									<Clock className='h-4 w-4' />
								</div>
							</div>

							{/* songs list */}

							<div className='px-3 sm:px-6'>
								<div className='space-y-2 py-4'>
									{currentAlbum?.songs.map((song, index) => {
										const isCurrentSong = currentSong?._id === song._id;
										return (
											<div
												key={song._id}
												onClick={() => handlePlaySong(index)}
												className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-xl px-3 py-3 text-sm
                      text-zinc-400 hover:bg-white/5 cursor-pointer md:grid-cols-[16px_4fr_2fr_1fr] md:gap-4 md:px-4 md:py-2 md:rounded-md
                      `}
											>
												<div className='flex items-center justify-center'>
													{isCurrentSong && isPlaying ? (
														<div className='size-4 text-green-500'>♫</div>
													) : (
														<span className='hidden md:inline'>{index + 1}</span>
													)}
													{!isCurrentSong && (
														<Play className='h-4 w-4 hidden group-hover:block' />
													)}
												</div>

												<div className='flex min-w-0 items-center gap-3'>
													<img src={song.imageUrl} alt={song.title} className='size-10 rounded object-cover' />

													<div className='min-w-0'>
														<div className={`font-medium text-white`}>{song.title}</div>
														<div className='truncate'>{song.artist}</div>
														<div className='mt-1 text-xs text-zinc-500 md:hidden'>
															{song.createdAt.split("T")[0]}
														</div>
													</div>
												</div>
												<div className='flex items-center text-xs text-zinc-300 md:hidden'>
													{formatDuration(song.duration)}
												</div>
												<div className='hidden md:flex items-center'>{song.createdAt.split("T")[0]}</div>
												<div className='hidden md:flex items-center'>{formatDuration(song.duration)}</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</ScrollArea>
		</div>
	);
};
export default AlbumPage;
