import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "@/components/ui/button";
import Header from "./components/Header";
import DashboardStats from "./components/DashboardStats";
import { Album, Loader2, Music, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SongsTabContent from "./components/SongsTabContent";
import AlbumsTabContent from "./components/AlbumsTabContent";
import { useEffect } from "react";
import { useMusicStore } from "@/stores/useMusicStore";

const AdminPage = () => {
	const { isAdmin, isLoading: isCheckingAdmin } = useAuthStore();

	const { loadAdminData, isLoading, error, songs, albums, stats } = useMusicStore();

	useEffect(() => {
		if (!isAdmin) return;
		void loadAdminData();
	}, [isAdmin, loadAdminData]);

	if (isCheckingAdmin) {
		return (
			<div className='min-h-screen bg-black text-zinc-100 flex items-center justify-center'>
				<Loader2 className='size-8 animate-spin text-emerald-500' />
			</div>
		);
	}

	if (!isAdmin) return <div>Unauthorized</div>;

	const hasNoAdminData =
		songs.length === 0 &&
		albums.length === 0 &&
		stats.totalSongs === 0 &&
		stats.totalAlbums === 0 &&
		stats.totalArtists === 0 &&
		stats.totalUsers === 0;

	if (isLoading && hasNoAdminData) {
		return (
			<div className='min-h-screen bg-black text-zinc-100 flex items-center justify-center'>
				<div className='flex items-center gap-3 rounded-2xl border border-white/10 bg-zinc-900/80 px-5 py-4'>
					<Loader2 className='size-5 animate-spin text-emerald-500' />
					<span>Loading admin dashboard...</span>
				</div>
			</div>
		);
	}

	if (error && hasNoAdminData) {
		return (
			<div className='min-h-screen bg-black text-zinc-100 flex items-center justify-center p-6'>
				<div className='max-w-md rounded-3xl border border-red-500/20 bg-zinc-900/80 p-6 text-center'>
					<h2 className='text-xl font-semibold'>Admin data failed to load</h2>
					<p className='mt-2 text-sm text-zinc-400'>{error}</p>
					<Button className='mt-4 bg-white text-black hover:bg-zinc-200' onClick={() => void loadAdminData()}>
						<RefreshCw className='mr-2 size-4' />
						Try again
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div
			className='min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900
   to-black text-zinc-100 p-4 sm:p-6 lg:p-8'
		>
			<Header />

			<DashboardStats />

			<Tabs defaultValue='songs' className='space-y-6'>
				<TabsList className='grid w-full grid-cols-2 p-1 bg-zinc-800/50 sm:inline-flex sm:w-auto'>
					<TabsTrigger value='songs' className='data-[state=active]:bg-zinc-700'>
						<Music className='mr-2 size-4' />
						Songs
					</TabsTrigger>
					<TabsTrigger value='albums' className='data-[state=active]:bg-zinc-700'>
						<Album className='mr-2 size-4' />
						Albums
					</TabsTrigger>
				</TabsList>

				<TabsContent value='songs'>
					<SongsTabContent />
				</TabsContent>
				<TabsContent value='albums'>
					<AlbumsTabContent />
				</TabsContent>
			</Tabs>
		</div>
	);
};
export default AdminPage;
