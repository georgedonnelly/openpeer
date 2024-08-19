// hooks/transactions/deposit/useDepositWithGas.ts
import { OpenPeerEscrow } from 'abis';
import { constants } from 'ethers';
import { useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi';

import { HARDCODED_GAS_CHAINS } from 'models/networks';
import { UseDepositFundsProps } from '../types';

const useDepositWithGas = ({ amount, token, contract }: UseDepositFundsProps) => {
	const { address } = token;
	const nativeToken = address === constants.AddressZero;

	const { data: simulateData } = useSimulateContract({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: 'deposit',
		args: [token.address, amount],
		value: nativeToken ? amount : undefined,
		gas: HARDCODED_GAS_CHAINS.includes(token.chain_id) ? BigInt('400000') : undefined
	});

	const { writeContract, data } = useWriteContract();

	const { isLoading, isSuccess } = useWaitForTransactionReceipt({
		hash: data
	});

	const depositFunds = () => {
		if (simulateData?.request) {
			writeContract(simulateData.request);
		}
	};

	return { isLoading, isSuccess, depositFunds, data, isFetching: false };
};

export default useDepositWithGas;
