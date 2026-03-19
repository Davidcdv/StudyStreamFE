import { UserButton } from "@clerk/clerk-react";
import BrandMark from "@/components/BrandMark";
import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className='flex items-center justify-between'>
			<div className='flex items-center gap-3 mb-8'>
				<Link to='/' className='rounded-lg'>
					<BrandMark size='sm' showText={false} />
				</Link>
				<div>
					<h1 className='text-3xl font-bold'>StudyStream Admin</h1>
					<p className='text-zinc-400 mt-1'>Manage your focus music catalog</p>
				</div>
			</div>
			<UserButton />
		</div>
	);
};
export default Header;
