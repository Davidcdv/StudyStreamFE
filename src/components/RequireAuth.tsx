import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const RequireAuth = () => {
	const { isLoaded, userId } = useAuth();
	const location = useLocation();

	if (!isLoaded) {
		return (
			<div className='flex h-screen w-full items-center justify-center bg-black'>
				<Loader className='size-8 animate-spin text-emerald-500' />
			</div>
		);
	}

	if (!userId) {
		return <Navigate to='/' replace state={{ from: location.pathname }} />;
	}

	return <Outlet />;
};

export default RequireAuth;
