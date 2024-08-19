// components/TransactionLink.tsx
import { blast } from 'models/networks';
import React from 'react';
import { useConfig } from 'wagmi';

const TransactionLink = ({ hash }: { hash: `0x${string}` | undefined }) => {
	const config = useConfig();
	const chainId = config.state.current
		? config.state.connections.get(config.state.current)?.chainId
		: undefined ?? config.chains[0]?.id;
	const chain = config.chains.find((c) => c.id === chainId);

	if (!chain || !hash) return <>Done</>;

	const blockExplorers = chain.id === blast.id ? blast.blockExplorers : chain.blockExplorers;

	const {
		default: { url, name },
		etherscan
	} = blockExplorers!;

	return (
		<a target="_blank" rel="noreferrer" href={`${etherscan?.url || url}/tx/${hash}`}>
			<>Done. View on {etherscan?.name || name}</>
		</a>
	);
};

export default TransactionLink;
