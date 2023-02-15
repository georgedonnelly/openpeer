interface LoadingParams {
	big?: boolean;
}

const Loading = ({ big = true }: LoadingParams) => {
	return (
		<div className={`flex mb-2 ${big && 'h-screen'}`}>
			<div className="m-auto flex flex-row justify-center justify-items-center content-center text-center">
				<svg className="animate-spin h-7 w-5 mr-3" viewBox="0 0 55 61">
					<path
						fillRule="evenodd"
						clipRule="evenodd"
						d="M16.8014 4.35124C22.9082 1.08711 29.9578 0.0413949 36.7492 1.39228C43.5405 2.74316 49.6533 6.40705 54.0461 11.7597L47.862 16.8348C44.6434 12.9129 40.1645 10.2284 35.1884 9.23856C30.2124 8.24876 25.0471 9.01496 20.5726 11.4066C16.0981 13.7983 12.5913 17.6674 10.6498 22.3547C8.70821 27.0421 8.45199 32.2576 9.92476 37.1127C11.3975 41.9678 14.5082 46.162 18.7267 48.9807C22.9452 51.7995 28.0105 53.0683 33.0596 52.571C38.1088 52.0737 42.8293 49.841 46.4168 46.2535L52.0736 51.9104C47.1774 56.8066 40.7348 59.8537 33.8438 60.5324C26.9527 61.2112 20.0395 59.4795 14.2821 55.6325C8.5247 51.7855 4.27928 46.0612 2.26924 39.435C0.259194 32.8088 0.608889 25.6906 3.25874 19.2933C5.90859 12.896 10.6946 7.61538 16.8014 4.35124Z"
						fill="#3C9AAA"
					/>
				</svg>
				<span className={`${big && 'text-xl'}`}>Loading...</span>
			</div>
		</div>
	);
};

export default Loading;
