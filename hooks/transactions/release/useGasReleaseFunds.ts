// hooks/transactions/release/useGasReleaseFunds.ts
import { OpenPeerEscrow } from 'abis';
import { useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi';

import { UseEscrowTransactionProps } from '../types';

const useGasReleaseFunds = ({ contract, orderID, buyer, token, amount }: UseEscrowTransactionProps) => {
	const { data: simulateData } = useSimulateContract({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: 'release',
		args: [orderID, buyer, token.address, amount]
	});

	const { writeContract, data } = useWriteContract();

	const { isLoading, isSuccess } = useWaitForTransactionReceipt({
		hash: data
	});

	const releaseFunds = () => {
		if (simulateData?.request) {
			writeContract(simulateData.request);
		}
	};

	return { isLoading, isSuccess, releaseFunds, data, isFetching: false };
};

export default useGasReleaseFunds;
