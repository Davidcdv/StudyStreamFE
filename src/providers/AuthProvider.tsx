import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useFocusStore } from "@/stores/useFocusStore";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const updateApiToken = (token: string | null) => {
	if (token) axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	else delete axiosInstance.defaults.headers.common["Authorization"];
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
	const { getToken, userId } = useAuth();
	const { user } = useUser();
	const [loading, setLoading] = useState(true);
	const { checkAdminStatus } = useAuthStore();
	const { initSocket, disconnectSocket } = useChatStore();
	const { loadFocusData } = useFocusStore();
	const syncAttempted = useRef<string | null>(null);

	useEffect(() => {
		const initAuth = async () => {
			try {
				const token = await getToken();
				updateApiToken(token);
				if (token) {
					if (user && syncAttempted.current !== user.id) {
						await axiosInstance.post("/auth/callback", {
							id: user.id,
							firstName: user.firstName,
							lastName: user.lastName,
							imageUrl: user.imageUrl,
						});
						syncAttempted.current = user.id;
					}

					await checkAdminStatus();
					await loadFocusData();
					// init socket
					if (userId) initSocket(userId);
				}
			} catch (error: any) {
				updateApiToken(null);
				console.log("Error in auth provider", error);
			} finally {
				setLoading(false);
			}
		};

		initAuth();

		// clean up
		return () => disconnectSocket();
	}, [getToken, userId, user, checkAdminStatus, initSocket, disconnectSocket, loadFocusData]);

	if (loading)
		return (
			<div className='h-screen w-full flex items-center justify-center'>
				<Loader className='size-8 text-emerald-500 animate-spin' />
			</div>
		);

	return <>{children}</>;
};
export default AuthProvider;
