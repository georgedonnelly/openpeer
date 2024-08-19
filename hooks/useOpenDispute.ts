// hooks/useOpenDispute.ts
import { OpenPeerEscrow } from 'abis';
import { useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi';

import { UseOpenDisputeProps } from './transactions/types';

const useOpenDispute = ({ contract, orderID, buyer, token, amount, disputeFee }: UseOpenDisputeProps) => {
	const { data: simulateData } = useSimulateContract({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: 'openDispute',
		args: [orderID, buyer, token.address, amount],
		value: disputeFee,
		query: {
			enabled: disputeFee !== undefined
		}
	});

	const { writeContract, data: writeData } = useWriteContract();

	const { isLoading, isSuccess } = useWaitForTransactionReceipt({
		hash: writeData ? writeData : undefined
	});

	return {
		isLoading,
		isSuccess,
		openDispute: () => {
			if (simulateData?.request) {
				writeContract(simulateData.request);
			}
		},
		data: writeData
	};
};

export default useOpenDispute;
