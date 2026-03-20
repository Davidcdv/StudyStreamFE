import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMusicStore } from "@/stores/useMusicStore";
import { Calendar, Music, Trash2 } from "lucide-react";

const AlbumsTable = () => {
	const { albums, deleteAlbum, isLoading, error } = useMusicStore();

	if (isLoading && albums.length === 0) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-zinc-400'>Loading albums...</div>
			</div>
		);
	}

	if (error && albums.length === 0) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-red-400'>{error}</div>
			</div>
		);
	}

	if (albums.length === 0) {
		return (
			<div className='flex items-center justify-center py-8'>
				<div className='text-zinc-400'>No albums found yet.</div>
			</div>
		);
	}

	return (
		<>
			<div className='space-y-3 md:hidden'>
				{albums.map((album) => (
					<div key={album._id} className='rounded-2xl border border-zinc-700/50 bg-zinc-900/40 p-4'>
						<div className='flex items-start gap-3'>
							<img src={album.imageUrl} alt={album.title} className='h-12 w-12 rounded-lg object-cover' />
							<div className='min-w-0 flex-1'>
								<div className='truncate font-medium text-white'>{album.title}</div>
								<div className='truncate text-sm text-zinc-400'>{album.artist}</div>
								<div className='mt-2 flex flex-wrap items-center gap-3 text-xs text-zinc-500'>
									<span className='inline-flex items-center gap-1'>
										<Calendar className='h-3.5 w-3.5' />
										{album.releaseYear}
									</span>
									<span className='inline-flex items-center gap-1'>
										<Music className='h-3.5 w-3.5' />
										{album.songs.length} songs
									</span>
								</div>
							</div>
							<Button
								variant='ghost'
								size='sm'
								onClick={() => deleteAlbum(album._id)}
								className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
							>
								<Trash2 className='h-4 w-4' />
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
							<TableHead>Release Year</TableHead>
							<TableHead>Songs</TableHead>
							<TableHead className='text-right'>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{albums.map((album) => (
							<TableRow key={album._id} className='hover:bg-zinc-800/50'>
								<TableCell>
									<img src={album.imageUrl} alt={album.title} className='w-10 h-10 rounded object-cover' />
								</TableCell>
								<TableCell className='font-medium'>{album.title}</TableCell>
								<TableCell>{album.artist}</TableCell>
								<TableCell>
									<span className='inline-flex items-center gap-1 text-zinc-400'>
										<Calendar className='h-4 w-4' />
										{album.releaseYear}
									</span>
								</TableCell>
								<TableCell>
									<span className='inline-flex items-center gap-1 text-zinc-400'>
										<Music className='h-4 w-4' />
										{album.songs.length} songs
									</span>
								</TableCell>
								<TableCell className='text-right'>
									<div className='flex gap-2 justify-end'>
										<Button
											variant='ghost'
											size='sm'
											onClick={() => deleteAlbum(album._id)}
											className='text-red-400 hover:text-red-300 hover:bg-red-400/10'
										>
											<Trash2 className='h-4 w-4' />
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
export default AlbumsTable;
