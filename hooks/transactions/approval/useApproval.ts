//hooks/transactions/approval/useApproval.ts
import { Token } from 'models/types';
import { useAccount, useConfig } from 'wagmi';

import useGaslessApproval from './useGaslessApproval';
import useTokenApproval from './useTokenApproval';

interface UseTokenApprovalProps {
	token: Token;
	spender: `0x${string}`;
	amount: bigint;
}

const useApproval = ({ token, spender, amount }: UseTokenApprovalProps) => {
	const { gasless } = token;
	const { address } = useAccount();
	const config = useConfig();
	const chainId = config.state.current
		? config.state.connections.get(config.state.current)?.chainId
		: undefined ?? config.chains[0]?.id;
	const chain = config.chains.find((c) => c.id === chainId) || config.chains[0];

	const withGasCall = useTokenApproval({
		address: token.address,
		spender,
		amount
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, approve } = useGaslessApproval({
		amount,
		chain,
		spender,
		tokenAddress: token.address,
		userAddress: address!
	});

	if (isFetching) {
		return { isLoading: false, isSuccess: false, isFetching };
	}
	if (gasless && gaslessEnabled) {
		return { isLoading, isSuccess, data, approve, isFetching };
	}

	return withGasCall;
};
export default useApproval;
