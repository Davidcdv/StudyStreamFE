import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Trash2 } from "lucide-react";

const SongsTable = () => {
	const { songs, isLoading, error, deleteSong } = useMusicStore();

	if (isLoading) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-zinc-400'>Loading songs...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-red-400'>{error}</div>
			</div>
		);
	}

	if (songs.length === 0) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-zinc-400'>No songs found yet.</div>
			</div>
		);
	}

	return (
		<>
			<div className='space-y-3 md:hidden'>
				{songs.map((song) => (
					<div key={song._id} className='rounded-2xl border border-zinc-700/50 bg-zinc-900/40 p-4'>
						<div className='flex items-start gap-3'>
							<img src={song.imageUrl} alt={song.title} className='size-12 rounded-lg object-cover' />
							<div className='min-w-0 flex-1'>
								<div className='truncate font-medium text-white'>{song.title}</div>
								<div className='truncate text-sm text-zinc-400'>{song.artist}</div>
								<div className='mt-2 inline-flex items-center gap-1 text-xs text-zinc-500'>
									<Calendar className='h-3.5 w-3.5' />
									{song.createdAt.split("T")[0]}
								</div>
							</div>
							<Button
								variant='ghost'
								size='sm'
								className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
								onClick={() => deleteSong(song._id)}
							>
								<Trash2 className='size-4' />
							</Button>
						</div>
					</div>
				))}
			</div>

			<div className='hidden md:block'>
				<Table>
					<TableHeader>
						<TableRow className='hover:bg-zinc-800/50'>
							<TableHead className='w-[50px]'></TableHead>
							<TableHead>Title</TableHead>
							<TableHead>Artist</TableHead>
							<TableHead>Release Date</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{songs.map((song) => (
							<TableRow key={song._id} className='hover:bg-zinc-800/50'>
								<TableCell>
									<img src={song.imageUrl} alt={song.title} className='size-10 rounded object-cover' />
								</TableCell>
								<TableCell className='font-medium'>{song.title}</TableCell>
								<TableCell>{song.artist}</TableCell>
								<TableCell>
									<span className='inline-flex items-center gap-1 text-zinc-400'>
										<Calendar className='h-4 w-4' />
										{song.createdAt.split("T")[0]}
									</span>
								</TableCell>

								<TableCell className='text-right'>
									<div className='flex gap-2 justify-end'>
										<Button
											variant={"ghost"}
											size={"sm"}
											className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
											onClick={() => deleteSong(song._id)}
										>
											<Trash2 className='size-4' />
										</Button>
									</div>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</>
	);
};
export default SongsTable;
