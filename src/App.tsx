import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/home/HomePage";
import LandingPage from "./pages/landing/LandingPage";
import AuthCallbackPage from "./pages/auth-callback/AuthCallbackPage";
import { AuthenticateWithRedirectCallback } from "@clerk/clerk-react";
import MainLayout from "./layout/MainLayout";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import AudioPlayer from "./layout/components/AudioPlayer";
import FocusModePage from "./pages/focus/FocusModePage";
import RequireAuth from "./components/RequireAuth";

import { Toaster } from "react-hot-toast";
import NotFoundPage from "./pages/404/NotFoundPage";

function App() {
	return (
		<>
			<AudioPlayer />
			<Routes>
				<Route
					path='/sso-callback'
					element={
						<AuthenticateWithRedirectCallback
							signInForceRedirectUrl={"/auth-callback"}
							signUpForceRedirectUrl={"/auth-callback"}
						/>
					}
				/>
				<Route path='/auth-callback' element={<AuthCallbackPage />} />
				<Route path='/' element={<LandingPage />} />

				<Route element={<RequireAuth />}>
					<Route path='/admin' element={<AdminPage />} />
					<Route path='/focus' element={<FocusModePage />} />
					<Route element={<MainLayout />}>
						<Route path='/app' element={<HomePage />} />
						<Route path='/albums/:albumId' element={<AlbumPage />} />
					</Route>
				</Route>

				<Route path='*' element={<NotFoundPage />} />
			</Routes>
			<Toaster />
		</>
	);
}

export default App;
