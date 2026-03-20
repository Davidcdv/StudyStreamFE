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
			className='flex flex-wrap items-center justify-between gap-3 p-4 sticky top-0 bg-zinc-900/75 
      backdrop-blur-md z-10
    '
		>
			<Link to='/app' className='min-w-0'>
				<BrandMark size='sm' />
			</Link>
			<div className='flex flex-wrap items-center gap-2 sm:gap-4'>
				<Link
					to={"/focus"}
					className={cn(
						buttonVariants({
							variant: "outline",
							className: "px-3 sm:px-4",
						})
					)}
				>
					<Brain className='size-4 sm:mr-2' />
					<span className='hidden sm:inline'>Focus Mode</span>
				</Link>

				{isAdmin && (
					<Link
						to={"/admin"}
						className={cn(
							buttonVariants({
								variant: "outline",
								className: "px-3 sm:px-4",
							})
						)}
					>
						<LayoutDashboardIcon className='size-4 sm:mr-2' />
						<span className='hidden sm:inline'>Admin Dashboard</span>
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
