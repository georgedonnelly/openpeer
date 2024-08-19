// hooks/transactions/release/useReleaseFunds.ts
import { useConfig } from 'wagmi';
import { FULL_GASLESS_CHAINS } from 'models/networks';
import { UseEscrowTransactionProps } from '../types';
import useGaslessReleaseFunds from './useGaslessReleaseFunds';
import useGasReleaseFunds from './useGasReleaseFunds';

const useReleaseFunds = ({ contract, orderID, buyer, token, amount }: UseEscrowTransactionProps) => {
	const config = useConfig();
	const chainId = config.state.current
		? config.state.connections.get(config.state.current)?.chainId
		: undefined ?? config.chains[0]?.id;

	const withGasCall = useGasReleaseFunds({ contract, orderID, buyer, token, amount });

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, releaseFunds } = useGaslessReleaseFunds({
		contract,
		orderID,
		buyer,
		token,
		amount
	});

	if (isFetching || !chainId) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (gaslessEnabled && FULL_GASLESS_CHAINS.includes(chainId)) {
		return { isLoading, isSuccess, data, releaseFunds, isFetching };
	}

	return withGasCall;
};

export default useReleaseFunds;
