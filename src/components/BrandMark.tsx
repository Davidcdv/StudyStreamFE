import { BrainCircuit, Waves } from "lucide-react";

type BrandMarkProps = {
	showText?: boolean;
	size?: "sm" | "md" | "lg";
	className?: string;
};

const sizeClasses = {
	sm: {
		wrapper: "gap-2",
		badge: "size-9",
		brain: "size-4",
		waves: "size-3",
		title: "text-base",
		subtitle: "text-[10px]",
	},
	md: {
		wrapper: "gap-3",
		badge: "size-11",
		brain: "size-5",
		waves: "size-4",
		title: "text-lg",
		subtitle: "text-[11px]",
	},
	lg: {
		wrapper: "gap-4",
		badge: "size-16",
		brain: "size-7",
		waves: "size-5",
		title: "text-2xl",
		subtitle: "text-xs",
	},
};

const BrandMark = ({ showText = true, size = "md", className = "" }: BrandMarkProps) => {
	const classes = sizeClasses[size];

	return (
		<div className={`flex items-center ${classes.wrapper} ${className}`.trim()}>
			<div className={`relative flex ${classes.badge} items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-400 to-violet-500 shadow-lg shadow-emerald-500/20`}>
				<BrainCircuit className={`${classes.brain} text-black`} />
				<Waves className={`absolute bottom-1.5 right-1.5 ${classes.waves} text-white/80`} />
			</div>
			{showText && (
				<div className='leading-tight'>
					<div className={`${classes.title} font-semibold tracking-tight text-white`}>StudyStream</div>
					<div className={`${classes.subtitle} uppercase tracking-[0.28em] text-emerald-300`}>Focus Music</div>
				</div>
			)}
		</div>
	);
};

export default BrandMark;
