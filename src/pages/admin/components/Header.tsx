import { UserButton } from "@clerk/clerk-react";
import BrandMark from "@/components/BrandMark";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
			<div className='flex items-center gap-3'>
				<Link to='/app' className='rounded-lg'>
					<BrandMark size='sm' showText={false} />
				</Link>
				<div>
					<h1 className='text-2xl font-bold sm:text-3xl'>StudyStream Admin</h1>
					<p className='text-zinc-400 mt-1'>Manage your focus music catalog</p>
				</div>
			</div>
			<div className='flex flex-wrap items-center gap-3'>
				<Button asChild variant='outline' className='border-white/15 bg-white/5 text-white hover:bg-white/10'>
					<Link to='/app'>
						<ArrowLeft className='mr-2 size-4' />
						Back to Dashboard
					</Link>
				</Button>
				<UserButton />
			</div>
		</div>
	);
};
export default Header;
