import PlaylistSkeleton from "@/components/skeletons/PlaylistSkeleton";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMusicStore } from "@/stores/useMusicStore";
import { Brain, LayoutDashboard, Library } from "lucide-react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

const LeftSidebar = ({ compact = false }: { compact?: boolean }) => {
	const { albums, fetchAlbums, isLoading } = useMusicStore();

	useEffect(() => {
		fetchAlbums();
	}, [fetchAlbums]);

	if (compact) {
		return (
			<div className='rounded-lg bg-zinc-900 p-3'>
				<div className='grid grid-cols-2 gap-2'>
					<Link
						to={"/app"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "justify-start text-white hover:bg-zinc-800",
							})
						)}
					>
						<LayoutDashboard className='mr-2 size-5' />
						Dashboard
					</Link>

					<Link
						to={"/focus"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "justify-start text-white hover:bg-zinc-800",
							})
						)}
					>
						<Brain className='mr-2 size-5' />
						Focus Mode
					</Link>
				</div>

				<div className='mt-3'>
					<div className='mb-2 flex items-center text-white px-1'>
						<Library className='size-4 mr-2' />
						<span className='text-sm font-medium'>Playlists</span>
					</div>
					<div className='-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
						{isLoading
							? Array.from({ length: 3 }, (_, index) => (
									<div
										key={`playlist-skeleton-${index}`}
										className='min-w-[160px] snap-start animate-pulse rounded-xl bg-zinc-800 p-3'
									>
										<div className='mb-2 h-20 rounded-lg bg-zinc-700' />
										<div className='h-3 rounded bg-zinc-700' />
									</div>
							  ))
							: albums.map((album) => (
									<Link
										to={`/albums/${album._id}`}
										key={album._id}
										className='min-w-[170px] snap-start rounded-xl border border-white/10 bg-zinc-800/60 p-3'
									>
										<img
											src={album.imageUrl}
											alt={album.title}
											className='mb-3 h-24 w-full rounded-lg object-cover'
										/>
										<p className='truncate text-sm font-medium text-white'>{album.title}</p>
										<p className='truncate text-xs text-zinc-400'>{album.artist}</p>
									</Link>
							  ))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className='h-full flex flex-col gap-2'>
			{/* Navigation menu */}

			<div className='rounded-lg bg-zinc-900 p-4'>
				<div className='space-y-2'>
					<Link
						to={"/app"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-start text-white hover:bg-zinc-800",
							})
						)}
					>
						<LayoutDashboard className='mr-2 size-5' />
						<span className='hidden md:inline'>Dashboard</span>
					</Link>

					<Link
						to={"/focus"}
						className={cn(
							buttonVariants({
								variant: "ghost",
								className: "w-full justify-start text-white hover:bg-zinc-800",
							})
						)}
					>
						<Brain className='mr-2 size-5' />
						<span className='hidden md:inline'>Focus Mode</span>
					</Link>
				</div>
			</div>

			{/* Library section */}
			<div className='flex-1 rounded-lg bg-zinc-900 p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center text-white px-2'>
						<Library className='size-5 mr-2' />
						<span className='hidden md:inline'>Playlists</span>
					</div>
				</div>

				<ScrollArea className='h-[calc(100vh-300px)]'>
					<div className='space-y-2'>
						{isLoading ? (
							<PlaylistSkeleton />
						) : (
							albums.map((album) => (
								<Link
									to={`/albums/${album._id}`}
									key={album._id}
									className='p-2 hover:bg-zinc-800 rounded-md flex items-center gap-3 group cursor-pointer'
								>
									<img
										src={album.imageUrl}
										alt='Playlist img'
										className='size-12 rounded-md flex-shrink-0 object-cover'
									/>

									<div className='flex-1 min-w-0 hidden md:block'>
										<p className='font-medium truncate'>{album.title}</p>
										<p className='text-sm text-zinc-400 truncate'>Album • {album.artist}</p>
									</div>
								</Link>
							))
						)}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};
export default LeftSidebar;
