import { Button, Modal } from 'components';
import TransactionLink from 'components/TransactionLink';
import { useTransactionFeedback } from 'hooks';
import { useEscrowFunds } from 'hooks/transactions';
import React, { useEffect, useState } from 'react';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';

import { EscrowFundsButtonProps } from './EscrowButton.types';

const EscrowFundsButton = ({ uuid, buyer, token, tokenAmount, fee, contract }: EscrowFundsButtonProps) => {
	const { isConnected } = useAccount();
	const amount = parseUnits(String(tokenAmount), token.decimals);
	const [modalOpen, setModalOpen] = useState(false);
	const [escrowConfirmed, setEscrowConfirmed] = useState(false);

	const { isLoading, isSuccess, data, escrowFunds, isFetching } = useEscrowFunds({
		orderID: uuid!,
		amount,
		buyer,
		fee,
		token,
		contract
	});

	const escrow = () => {
		if (!isConnected) return;

		if (!escrowConfirmed) {
			setModalOpen(true);
			return;
		}
		escrowFunds?.();
	};

	useEffect(() => {
		if (escrowConfirmed) {
			escrow();
		}
	}, [escrowConfirmed]);

	useTransactionFeedback({
		hash: data?.hash,
		isSuccess,
		Link: <TransactionLink hash={data?.hash} />,
		description: 'Escrowed funds'
	});

	return (
		<>
			<Button
				title={isLoading ? 'Processing...' : isSuccess ? 'Done' : 'Escrow funds'}
				onClick={escrow}
				processing={isLoading || isFetching}
				disabled={isSuccess || isFetching}
			/>
			<Modal
				actionButtonTitle="Yes, confirm"
				title="Escrow funds?"
				content={`The funds will be sent to your escrow contract (${contract}).`}
				type="confirmation"
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onAction={() => setEscrowConfirmed(true)}
			/>
		</>
	);
};

export default EscrowFundsButton;
