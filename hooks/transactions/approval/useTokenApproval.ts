// hooks/transactions/approval/useTokenApproval.ts
import { useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi';
import { erc20Abi } from 'viem';

interface UseTokenApprovalParams {
	address: `0x${string}`;
	spender: `0x${string}`;
	amount: bigint;
}

type UseTokenApprovalReturn = {
	isLoading: boolean;
	isSuccess: boolean;
	isFetching: boolean;
	approve: () => void;
	data: ReturnType<typeof useWriteContract>['data'];
};

const useTokenApproval = ({ address, spender, amount }: UseTokenApprovalParams): UseTokenApprovalReturn => {
	const maxAllowance = amount === BigInt(0) ? BigInt(0) : BigInt(2 ** 256) - BigInt(1);
	const { data: simulateData } = useSimulateContract({
		address,
		abi: erc20Abi,
		functionName: 'approve',
		args: [spender, maxAllowance]
	});

	const { writeContract, data } = useWriteContract();

	const { isLoading, isSuccess, isFetching } = useWaitForTransactionReceipt({
		hash: data
	});

	const approve = () => {
		if (simulateData?.request) {
			writeContract(simulateData.request);
		}
	};

	return { isLoading, isSuccess, isFetching, approve, data };
};

export default useTokenApproval;
