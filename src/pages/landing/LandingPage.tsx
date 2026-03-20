import BrandMark from "@/components/BrandMark";
import SignInOAuthButtons from "@/components/SignInOAuthButtons";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { BarChart3, Brain, Clock3, Volume2 } from "lucide-react";
import { Link } from "react-router-dom";

const featureCards = [
	{
		icon: Clock3,
		title: "Pomodoro Focus Mode",
		description: "Run 25-minute study blocks with a distraction-free timer and quick resume/reset controls.",
	},
	{
		icon: Volume2,
		title: "Ambient Study Sounds",
		description: "Layer rain, white noise, or cafe ambience under your playlist while you work.",
	},
	{
		icon: BarChart3,
		title: "Productivity Tracking",
		description: "See total focus time, completed sessions, and a simple weekly trend at a glance.",
	},
];

const LandingPage = () => {
	return (
		<main className='min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.15),_transparent_25%),linear-gradient(180deg,_#111113_0%,_#09090b_100%)] text-white'>
			<div className='mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8'>
				<header className='flex items-center justify-between gap-4'>
					<BrandMark size='md' />
					<div className='flex items-center gap-3'>
						<SignedOut>
							<div className='hidden min-w-[220px] sm:block'>
								<SignInOAuthButtons />
							</div>
						</SignedOut>
						<SignedIn>
							<Button asChild className='bg-emerald-500 text-black hover:bg-emerald-400'>
								<Link to='/app'>Open dashboard</Link>
							</Button>
						</SignedIn>
					</div>
				</header>

				<section className='flex flex-1 flex-col justify-center py-12'>
					<div className='grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center'>
						<div>
							<div className='mb-4 inline-flex items-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs uppercase tracking-[0.3em] text-emerald-200'>
								Study music, structured focus, better sessions
							</div>
							<h1 className='max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl'>
								A focus-first music app built for serious study sessions.
							</h1>
							<p className='mt-6 max-w-2xl text-lg leading-8 text-zinc-300'>
								StudyStream helps students stay on task with timed focus blocks, curated study playlists, ambient sound,
								and simple productivity insights that are tied to their own account.
							</p>

							<div className='mt-8 flex flex-wrap gap-4'>
								<SignedOut>
									<div className='w-full max-w-sm sm:hidden'>
										<SignInOAuthButtons />
									</div>
									<Button
										asChild
										size='lg'
										variant='outline'
										className='border-white/15 bg-white/5 text-white hover:bg-white/10'
									>
										<Link to='/#features'>See what is included</Link>
									</Button>
								</SignedOut>
								<SignedIn>
									<Button asChild size='lg' className='bg-emerald-500 text-black hover:bg-emerald-400'>
										<Link to='/app'>Go to dashboard</Link>
									</Button>
									<Button
										asChild
										size='lg'
										variant='outline'
										className='border-white/15 bg-white/5 text-white hover:bg-white/10'
									>
										<Link to='/focus'>Open Focus Mode</Link>
									</Button>
								</SignedIn>
							</div>
						</div>

						<div className='rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30 backdrop-blur-md'>
							<div className='mb-5 flex items-center justify-between'>
								<div>
									<div className='text-xs uppercase tracking-[0.3em] text-emerald-300'>Account benefits</div>
									<h2 className='mt-2 text-2xl font-semibold'>Why sign in?</h2>
								</div>
								<Brain className='size-6 text-emerald-300' />
							</div>

							<div className='space-y-4'>
								<div className='rounded-2xl bg-black/20 p-4'>
									<div className='font-medium text-white'>Personal focus history</div>
									<p className='mt-1 text-sm text-zinc-400'>Keep your completed sessions, total focus time, and weekly chart tied to your own account.</p>
								</div>
								<div className='rounded-2xl bg-black/20 p-4'>
									<div className='font-medium text-white'>Your own study setup</div>
									<p className='mt-1 text-sm text-zinc-400'>Return to your preferred focus mode, ambient sound, and study rhythm each time you log in.</p>
								</div>
								<div className='rounded-2xl bg-black/20 p-4'>
									<div className='font-medium text-white'>Protected dashboard access</div>
									<p className='mt-1 text-sm text-zinc-400'>The study dashboard, albums, and focus tools are only available after authentication.</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section id='features' className='grid gap-4 pb-8 md:grid-cols-3'>
					{featureCards.map((feature) => {
						const Icon = feature.icon;

						return (
							<div key={feature.title} className='rounded-3xl border border-white/10 bg-white/5 p-5'>
								<div className='mb-4 inline-flex rounded-2xl bg-black/20 p-3'>
									<Icon className='size-5 text-emerald-300' />
								</div>
								<h3 className='text-lg font-semibold'>{feature.title}</h3>
								<p className='mt-2 text-sm leading-6 text-zinc-400'>{feature.description}</p>
							</div>
						);
					})}
				</section>
			</div>
		</main>
	);
};

export default LandingPage;
