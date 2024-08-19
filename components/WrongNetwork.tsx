// components/WrongNetwork.tsx
import { allChains } from 'models/networks';
import React from 'react';
import { useSwitchChain, useConfig } from 'wagmi';

import Button from './Button/Button';

const WrongNetwork = ({ desiredChainId }: { desiredChainId: number }) => {
	const { switchChain } = useSwitchChain();
	const config = useConfig();

	let chainName = '';
	if (desiredChainId) {
		const chain =
			config.chains.find((c) => c.id === desiredChainId) || allChains.find((c) => c.id === desiredChainId);
		if (chain?.name) {
			chainName = chain.name;
		}
	}

	const handleSwitchNetwork = async () => {
		try {
			await switchChain({ chainId: desiredChainId });
		} catch (error) {
			console.error('Failed to switch chain:', error);
		}
	};

	return (
		<div className="flex h-screen">
			<div className="px-6 m-auto flex flex-col justify-items-center content-center text-center">
				<span className="mb-6 text-xl">Looks like you are connected to the wrong network</span>
				<span className="mb-4 m-auto">
					<Button title={`Switch to ${chainName}`} onClick={handleSwitchNetwork} />
				</span>
			</div>
		</div>
	);
};

export default WrongNetwork;
