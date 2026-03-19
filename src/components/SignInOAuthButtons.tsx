import { useSignIn } from "@clerk/clerk-react";
import { Button } from "./ui/button";

const SignInOAuthButtons = () => {
	const { signIn, isLoaded } = useSignIn();

	if (!isLoaded) {
		return null;
	}

	const signInWithGoogle = async () => {
		if (!signIn) return;

		const origin = window.location.origin;

		await signIn.authenticateWithRedirect({
			strategy: "oauth_google",
			redirectUrl: `${origin}/sso-callback`,
			redirectUrlComplete: `${origin}/auth-callback`,
		});
	};

	return (
		<Button onClick={signInWithGoogle} variant={"secondary"} className='w-full text-white border-zinc-200 h-11'>
			<img src='/google.png' alt='Google' className='size-5' />
			Continue with Google
		</Button>
	);
};
export default SignInOAuthButtons;
