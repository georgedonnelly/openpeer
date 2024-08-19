//hooks/transactions/cancel/useGasEscrowCancel.ts
import { OpenPeerEscrow } from 'abis';
import { useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi';

import { UseEscrowCancelProps } from '../types';

const useGasEscrowCancel = ({ contract, isBuyer, orderID, buyer, token, amount }: UseEscrowCancelProps) => {
	const { data: simulateData } = useSimulateContract({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: isBuyer ? 'buyerCancel' : 'sellerCancel',
		args: [orderID, buyer, token.address, amount]
	});

	const { writeContract, data } = useWriteContract();

	const { isLoading, isSuccess } = useWaitForTransactionReceipt({
		hash: data
	});

	const cancelOrder: () => void = () => {
		if (simulateData?.request) {
			writeContract(simulateData.request);
		}
	};

	return { isLoading, isSuccess, cancelOrder, data, isFetching: false };
};

export default useGasEscrowCancel;
