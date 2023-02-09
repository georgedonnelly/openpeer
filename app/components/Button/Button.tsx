interface ButtonProps {
	title: string | JSX.Element;
	onClick?: () => void;
	minimal?: boolean;
	outlined?: boolean;
	rounded?: boolean;
	link?: boolean;
	disabled?: boolean;
	processing?: boolean;
}

const Button = ({
	title,
	onClick,
	minimal = false,
	outlined = false,
	rounded = false,
	link = false,
	disabled = false,
	processing = false
}: ButtonProps) => {
	return (
		<button
			className={
				minimal
					? 'text-xl font-bold w-8'
					: outlined
					? 'w-full px-2 py-2.5 rounded border border-[#3C9AAA] text-base text-[#3C9AAA] my-8'
					: processing
					? 'flex flex-row items-center justify-center w-full px-5 py-2.5 rounded bg-[#3C9AAA] text-base text-white'
					: disabled
					? 'w-full px-5 py-2.5 rounded bg-gray-400 text-base text-white opacity-50 cursor-not-allowed'
					: rounded
					? 'w-full px-4 py-2 rounded-full bg-[#3C9AAA] text-sm md:text-base text-white'
					: link
					? 'w-auto'
					: 'w-full px-5 py-2.5 rounded bg-[#3C9AAA] text-base text-white'
			}
			onClick={onClick}
		>
			{!!processing && (
				<svg
					className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
				>
					<circle
						className="opacity-25"
						cx="12"
						cy="12"
						r="10"
						stroke="currentColor"
						stroke-width="4"
					></circle>
					<path
						className="opacity-75"
						fill="currentColor"
						d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
					></path>
				</svg>
			)}
			{title}
		</button>
	);
};

export default Button;
