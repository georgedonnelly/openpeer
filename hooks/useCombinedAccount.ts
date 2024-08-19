// hooks/useCombinedAccount.ts
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { useAccount as useWagmiAccount } from 'wagmi';

const useCombinedAccount = () => {
	const { address, isConnected, isConnecting, connector } = useWagmiAccount();
	const { primaryWallet } = useDynamicContext();

	return {
		address: address || (primaryWallet?.address as `0x${string}` | undefined),
		isConnected,
		isConnecting,
		connector
	};
};

export default useCombinedAccount;
