// hooks/transactions/escrow/useEscrowWithGas.ts
import { OpenPeerEscrow } from 'abis';
import { constants } from 'ethers';
import { useWriteContract, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi';
import { arbitrum } from 'wagmi/chains';

import { UseEscrowFundsProps } from '../types';

const useEscrowWithGas = ({
	orderID,
	buyer,
	amount,
	token,
	fee,
	contract,
	instantEscrow,
	sellerWaitingTime
}: UseEscrowFundsProps) => {
	const { address } = token;
	const nativeToken = address === constants.AddressZero;
	const partner = constants.AddressZero;

	const { data: simulateData } = useSimulateContract({
		address: contract,
		abi: OpenPeerEscrow,
		functionName: nativeToken ? 'createNativeEscrow' : 'createERC20Escrow',
		args: nativeToken
			? [orderID, buyer, amount, partner, sellerWaitingTime, instantEscrow]
			: [orderID, buyer, address, amount, partner, sellerWaitingTime, instantEscrow],
		gas: token.chain_id === arbitrum.id ? undefined : instantEscrow ? BigInt('200000') : BigInt('400000'),
		value: nativeToken && !instantEscrow ? amount + fee : undefined
	});

	const { writeContract, data } = useWriteContract();

	const { isLoading, isSuccess } = useWaitForTransactionReceipt({
		hash: data
	});

	const escrowFunds = () => {
		if (simulateData?.request) {
			writeContract(simulateData.request);
		}
	};

	return { isLoading, isSuccess, escrowFunds, data, isFetching: false };
};

export default useEscrowWithGas;
