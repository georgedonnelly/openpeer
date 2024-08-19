// hooks/transactions/cancel/useEscrowCancel.ts
import { FULL_GASLESS_CHAINS } from 'models/networks';
import { useConfig } from 'wagmi';
import { UseEscrowCancelProps } from '../types';
import useGasEscrowCancel from './useGasEscrowCancel';
import useGaslessEscrowCancel from './useGaslessEscrowCancel';

type UseEscrowCancelReturn = {
	isLoading: boolean;
	isSuccess: boolean;
	isFetching: boolean;
	data?: unknown; // Replace 'unknown' with the actual type of 'data'
	cancelOrder?: () => void;
};

const useEscrowCancel = ({
	contract,
	orderID,
	buyer,
	token,
	amount,
	isBuyer
}: UseEscrowCancelProps): UseEscrowCancelReturn => {
	const config = useConfig();
	const chainId = config.state.current
		? config.state.connections.get(config.state.current)?.chainId
		: undefined ?? config.chains[0]?.id;

	const withGasCall = useGasEscrowCancel({
		contract,
		orderID,
		buyer,
		token,
		amount,
		isBuyer
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, cancelOrder } = useGaslessEscrowCancel({
		contract,
		orderID,
		buyer,
		token,
		amount,
		isBuyer
	});

	if (isFetching || !chainId) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (gaslessEnabled && (FULL_GASLESS_CHAINS.includes(chainId) || isBuyer)) {
		return { isLoading, isSuccess, data, cancelOrder, isFetching };
	}

	return withGasCall;
};

export default useEscrowCancel;
