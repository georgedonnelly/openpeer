// hooks/transactions/deposit/useDepositFunds.ts
import { constants } from 'ethers';

import { FULL_GASLESS_CHAINS } from 'models/networks';
import { useConfig } from 'wagmi';
import { UseDepositFundsProps } from '../types';
import useDepositWithGas from './useDepositWithGas';
import useGaslessDepositFunds from './useGaslessDepositFunds';

const useDepositFunds = ({ amount, token, contract }: UseDepositFundsProps) => {
	const nativeToken = token.address === constants.AddressZero;
	const config = useConfig();
	const chainId = config.state.current
		? config.state.connections.get(config.state.current)?.chainId
		: undefined ?? config.chains[0]?.id;

	const withGasCall = useDepositWithGas({
		contract,
		amount,
		token
	});

	const { gaslessEnabled, isFetching, isLoading, isSuccess, data, depositFunds } = useGaslessDepositFunds({
		amount,
		contract,
		token
	});

	if (isFetching || !chainId) {
		return { isLoading: false, isSuccess: false, isFetching };
	}

	if (!nativeToken && gaslessEnabled && FULL_GASLESS_CHAINS.includes(chainId)) {
		return { isLoading, isSuccess, data, depositFunds };
	}

	return withGasCall;
};

export default useDepositFunds;
