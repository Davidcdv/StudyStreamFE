import { SignedOut, UserButton } from "@clerk/clerk-react";
import { Brain, LayoutDashboardIcon } from "lucide-react";
import { Link } from "react-router-dom";
import SignInOAuthButtons from "./SignInOAuthButtons";
import { useAuthStore } from "@/stores/useAuthStore";
import { cn } from "@/lib/utils";
import { buttonVariants } from "./ui/button";
import BrandMark from "./BrandMark";

const Topbar = () => {
	const { isAdmin } = useAuthStore();

	return (
		<div
			className='flex items-center justify-between p-4 sticky top-0 bg-zinc-900/75 
      backdrop-blur-md z-10
    '
		>
			<Link to='/app' className='min-w-0'>
				<BrandMark size='sm' />
			</Link>
			<div className='flex items-center gap-4'>
				<Link to={"/focus"} className={cn(buttonVariants({ variant: "outline" }))}>
					<Brain className='size-4 mr-2' />
					Focus Mode
				</Link>

				{isAdmin && (
					<Link to={"/admin"} className={cn(buttonVariants({ variant: "outline" }))}>
						<LayoutDashboardIcon className='size-4  mr-2' />
						Admin Dashboard
					</Link>
				)}

				<SignedOut>
					<SignInOAuthButtons />
				</SignedOut>

				<UserButton />
			</div>
		</div>
	);
};
export default Topbar;
