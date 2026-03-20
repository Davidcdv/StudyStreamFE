import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Outlet } from "react-router-dom";
import LeftSidebar from "./components/LeftSidebar";
import FriendsActivity from "./components/FriendsActivity";
import { PlaybackControls } from "./components/PlaybackControls";
import { useEffect, useState } from "react";

const MainLayout = () => {
	const [windowWidth, setWindowWidth] = useState(1280);

	useEffect(() => {
		const updateWidth = () => {
			setWindowWidth(window.innerWidth);
		};

		updateWidth();
		window.addEventListener("resize", updateWidth);
		return () => window.removeEventListener("resize", updateWidth);
	}, []);

	const isMobile = windowWidth < 768;
	const isTablet = windowWidth >= 768 && windowWidth < 1280;

	if (isMobile) {
		return (
			<div className='h-screen bg-black text-white flex flex-col'>
				<div className='flex-1 overflow-hidden p-2'>
					<div className='grid h-full grid-rows-[auto_1fr] gap-2'>
						<LeftSidebar compact />
						<div className='min-h-0'>
							<Outlet />
						</div>
					</div>
				</div>

				<PlaybackControls />
			</div>
		);
	}

	if (isTablet) {
		return (
			<div className='h-screen bg-black text-white flex flex-col'>
				<div className='flex-1 overflow-hidden p-2'>
					<div className='grid h-full grid-cols-[260px_1fr] gap-2'>
						<div className='min-h-0'>
							<LeftSidebar />
						</div>
						<div className='grid min-h-0 grid-rows-[1fr_280px] gap-2'>
							<div className='min-h-0'>
								<Outlet />
							</div>
							<div className='min-h-0'>
								<FriendsActivity />
							</div>
						</div>
					</div>
				</div>

				<PlaybackControls />
			</div>
		);
	}

	return (
		<div className='h-screen bg-black text-white flex flex-col'>
			<ResizablePanelGroup direction='horizontal' className='flex-1 flex h-full overflow-hidden p-2'>
				{/* left sidebar */}
				<ResizablePanel defaultSize={20} minSize={isMobile ? 0 : 10} maxSize={30}>
					<LeftSidebar />
				</ResizablePanel>

				<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

				{/* Main content */}
				<ResizablePanel defaultSize={isMobile ? 80 : 60}>
					<Outlet />
				</ResizablePanel>

				{!isMobile && (
					<>
						<ResizableHandle className='w-2 bg-black rounded-lg transition-colors' />

						{/* right sidebar */}
						<ResizablePanel defaultSize={20} minSize={0} maxSize={25} collapsedSize={0}>
							<FriendsActivity />
						</ResizablePanel>
					</>
				)}
			</ResizablePanelGroup>

			<PlaybackControls />
		</div>
	);
};
export default MainLayout;
