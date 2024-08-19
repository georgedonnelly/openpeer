// components/Buy/EscrowButton/ApproveTokenButton.tsx
import Button from 'components/Button/Button';
import TransactionLink from 'components/TransactionLink';
import { useTransactionFeedback, useCombinedAccount } from 'hooks';
import { useApproval } from 'hooks/transactions';
import { Token } from 'models/types';
import React, { useEffect } from 'react';
import { erc20Abi } from 'viem';
import { useReadContract } from 'wagmi';

const ApproveTokenButton = ({
	token,
	spender,
	amount,
	onApprovalChange
}: {
	token: Token;
	spender: `0x${string}`;
	amount: bigint;
	onApprovalChange: (approved: boolean) => void;
}) => {
	const { address, isConnected } = useCombinedAccount();

	const { isFetching, isLoading, isSuccess, data, approve } = useApproval({
		token,
		spender,
		amount
	});

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />,
		description: 'Approved token spending'
	});

	const approveToken = async () => {
		if (!isConnected) return;

		approve?.();
	};

	const { data: allowance } = useReadContract({
		address: token.address,
		abi: erc20Abi,
		functionName: 'allowance',
		args: [address!, spender]
	});

	const approved = !!allowance && !!amount && allowance >= amount;

	useEffect(() => {
		onApprovalChange(isSuccess || approved);
	}, [isSuccess, approved, onApprovalChange]);

	return (
		<Button
			title={isLoading ? 'Processing...' : isSuccess ? 'Done' : `Approve ${token.symbol}`}
			onClick={approveToken}
			processing={isLoading || isFetching}
			disabled={isSuccess || isFetching || isLoading}
		/>
	);
};

export default ApproveTokenButton;
