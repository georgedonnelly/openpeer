import { Button, Modal } from 'components';
import { verifyMessage } from 'ethers/lib/utils.js';
import { Order } from 'models/types';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAccount, useSignMessage } from 'wagmi';

import BlockchainCancelButton from './BlockchainCancelButton';

interface CancelOrderButtonParams {
	order: Order;
	outlined?: boolean;
	title?: string;
}

const CancelOrderButton = ({ order, outlined = true, title = 'Cancel Order' }: CancelOrderButtonParams) => {
	const {
		list: { seller },
		buyer,
		uuid
	} = order;

	const { address } = useAccount();

	const isBuyer = buyer.address === address;
	const isSeller = seller.address === address;
	const message = `Cancel order ${uuid}`;

	const [modalOpen, setModalOpen] = useState(false);
	const [cancelConfirmed, setCancelConfirmed] = useState(false);

	const { signMessage } = useSignMessage({
		onSuccess: async (data, variables) => {
			const signingAddress = verifyMessage(variables.message, data);
			if (signingAddress === address) {
				const result = await fetch(`/api/orders/${uuid}/cancel`, {
					method: 'PATCH',
					body: message
				});
				const order = await result.json();
				if (!order.uuid) {
					toast.error('Error cancelling the order', {
						theme: 'dark',
						position: 'top-right',
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: false,
						progress: undefined
					});
				}
			}
		}
	});

	const cancelIsNotAvailable = ['cancelled', 'closed'].includes(order.status);
	const simpleCancel: boolean = !order.escrow && order.status === 'created'; // no need to talk to the blockchain

	const onCancelOrder = () => {
		if (cancelIsNotAvailable) return;

		if (!cancelConfirmed) {
			setModalOpen(true);
			return;
		}

		if (simpleCancel) {
			signMessage({ message });
		}
	};

	useEffect(() => {
		if (cancelConfirmed) {
			onCancelOrder();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [cancelConfirmed]);

	if ((!isBuyer && !isSeller) || cancelIsNotAvailable) return <></>;

	return simpleCancel ? (
		<>
			<Button title={title} onClick={onCancelOrder} outlined={outlined} />
			<Modal
				actionButtonTitle="Yes, confirm"
				title="Cancel Order?"
				content="The order will be cancelled"
				type="alert"
				open={modalOpen}
				onClose={() => setModalOpen(false)}
				onAction={() => setCancelConfirmed(true)}
			/>
		</>
	) : (
		<BlockchainCancelButton order={order} title={title} outlined={outlined} />
	);
};

export default CancelOrderButton;