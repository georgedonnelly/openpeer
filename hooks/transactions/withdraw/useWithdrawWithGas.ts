// hooks/transactions/withdraw/useWithdrawWithGas.ts
import { OpenPeerEscrow } from 'abis';
import { useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi';

import { HARDCODED_GAS_CHAINS } from 'models/networks';
import { UseWithdrawFundsProps } from '../types';

const useWithdrawWithGas = ({ amount, token, contract }: UseWithdrawFundsProps) => {
	const { data: simulateData } = useSimulateContract({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: 'withdrawBalance',
		args: [token.address, amount],
		gas: HARDCODED_GAS_CHAINS.includes(token.chain_id) ? BigInt('300000') : undefined
	});

	const { writeContract, data: writeData } = useWriteContract();

	const { isLoading, isSuccess } = useWaitForTransactionReceipt({
		hash: writeData
	});

	const withdrawFunds = () => {
		if (simulateData?.request) {
			writeContract(simulateData.request);
		}
	};

	return {
		isLoading,
		isSuccess,
		withdrawFunds,
		data: writeData,
		isFetching: false
	};
};

export default useWithdrawWithGas;
