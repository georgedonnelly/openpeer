// hooks/transactions/withdraw/useWithdrawFunds.ts
import { constants } from 'ethers';

import { FULL_GASLESS_CHAINS } from 'models/networks';
import { useConfig } from 'wagmi';
import { UseWithdrawFundsProps } from '../types';
import useWithdrawWithGas from './useWithdrawWithGas';
import useGaslessWithdrawFunds from './useGaslessWithdrawFunds';

const useWithdrawFunds = ({ amount, token, contract }: UseWithdrawFundsProps) => {
	const nativeToken = token.address === constants.AddressZero;
	const config = useConfig();
	const chainId = config.state.current
		? config.state.connections.get(config.state.current)?.chainId
		: undefined ?? config.chains[0]?.id;

	const withGasCall = useWithdrawWithGas({
		contract,
		amount,
		token
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, withdrawFunds } = useGaslessWithdrawFunds({
		amount,
		contract,
		token
	});

	if (isFetching || !chainId) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (!nativeToken && gaslessEnabled && FULL_GASLESS_CHAINS.includes(chainId)) {
		return { isLoading, isSuccess, data, withdrawFunds };
	}

	return withGasCall;
};

export default useWithdrawFunds;
