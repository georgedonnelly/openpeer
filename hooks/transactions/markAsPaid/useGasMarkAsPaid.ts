// hooks/transactions/markedAsPaid/useGasMarkAsPaid.ts
import { OpenPeerEscrow } from 'abis';
import { useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi';
import { UseEscrowTransactionProps } from '../types';

const useGasMarkAsPaid = ({ contract, orderID, buyer, token, amount }: UseEscrowTransactionProps) => {
	const { data: simulateData } = useSimulateContract({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: 'markAsPaid',
		args: [orderID, buyer, token.address, amount]
	});

	const { writeContract, data } = useWriteContract();

	const { isLoading, isSuccess } = useWaitForTransactionReceipt({
		hash: data
	});

	const markAsPaid = () => {
		if (simulateData?.request) {
			writeContract(simulateData.request);
		}
	};

	return { isLoading, isSuccess, markAsPaid, data, isFetching: false };
};

export default useGasMarkAsPaid;
