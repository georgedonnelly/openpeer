// components/Listing/Details.tsx

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAccount, useUserProfile, useConfirmationSignMessage } from 'hooks';
import snakecaseKeys from 'snakecase-keys';
import { Token, User } from 'models/types';
import Checkbox from 'components/Checkbox/Checkbox';
import { useContractRead } from 'wagmi';
import { DEPLOYER_CONTRACTS } from 'models/networks';
import { OpenPeerDeployer, OpenPeerEscrow } from 'abis';
import { parseUnits } from 'viem';
import { ethers, constants } from 'ethers';
import { listToMessage } from 'utils';
import dynamic from 'next/dynamic';
import Label from 'components/Label/Label';
import Selector from 'components/Selector';
import FriendlySelector from 'components/FriendlySelector';
import { ListStepProps } from 'components/Listing/Listing.types';
import StepLayout from 'components/Listing/StepLayout';
import FundEscrow from 'components/Listing/FundEscrow';
import 'react-quill/dist/quill.snow.css';
import TrustedUsers from 'components/TrustedUsers';
import BlockedUsers from 'components/BlockedUsers';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';
import FriendlyTime from 'components/FriendlyTime';

const QuillEditor = dynamic(() => import('react-quill'), { ssr: false });

const Details = ({ list, updateList }: ListStepProps) => {
	if (!list) {
		return <div>Loading...</div>;
	}

	const {
		terms,
		depositTimeLimit,
		paymentTimeLimit,
		type,
		chainId,
		token,
		acceptOnlyVerified,
		acceptOnlyTrusted,
		escrowType
	} = list;

	const { address } = useAccount();
	const router = useRouter();
	const { user, fetchUserProfile } = useUserProfile({});
	const [lastVersion, setLastVersion] = useState(0);
	const [selectedTrustedUsers, setSelectedTrustedUsers] = useState<User[]>([]);
	const [acceptOnlyTrustedState, setAcceptOnlyTrustedState] = useState(list.acceptOnlyTrusted);
	const [acceptOnlyBlocked, setAcceptOnlyBlocked] = useState(false);

	const { signMessage } = useConfirmationSignMessage({
		onSuccess: async (data) => {
			console.log('acceptOnlyTrusted state:', acceptOnlyTrusted);
			const body = snakecaseKeys(
				{
					list: {
						...list,
						bankIds: (list.banks || []).map((b) => b.id),
						accept_only_trusted: acceptOnlyTrusted
					},
					data,
					address
				},
				{ deep: true }
			);

			console.log('Updating list with payload:', body); // Add logging

			const result = await fetch(list.id ? `/api/lists/${list.id}` : '/api/lists', {
				method: list.id ? 'PUT' : 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${getAuthToken()}`
				},
				body: JSON.stringify(body)
			});

			const { id } = await result.json();

			if (id) {
				router.push(`/${address}`);
			}
		}
	});

	useEffect(() => {
		updateList({ ...list, acceptOnlyTrusted: acceptOnlyTrustedState });
	}, [acceptOnlyTrustedState]);

	const onTermsChange = (value: string) => {
		updateList({ ...list, terms: value });
	};

	const { data: sellerContract } = useContractRead({
		address: DEPLOYER_CONTRACTS[chainId],
		abi: OpenPeerDeployer,
		functionName: 'sellerContracts',
		args: [address],
		enabled: !!address && escrowType === 'instant',
		chainId,
		watch: true
	});

	const { data: balance } = useContractRead({
		address: sellerContract as `0x${string}`,
		abi: OpenPeerEscrow,
		functionName: 'balances',
		args: [(token as Token).address],
		enabled: !!sellerContract && sellerContract !== constants.AddressZero,
		chainId,
		watch: true
	});

	const contracts = (user?.contracts || []).filter((c) => c.chain_id === chainId && Number(c.version) >= 2);
	const lastDeployedVersion = contracts.reduce((acc, c) => Math.max(acc, Number(c.version)), 0);
	const outdatedContract = contracts.length === 0 || lastDeployedVersion < lastVersion;
	const lastDeployedContract = sellerContract as `0x${string}` | undefined;
	const needToDeploy = !sellerContract || sellerContract === constants.AddressZero || outdatedContract;
	const needToFund =
		!balance ||
		(balance as bigint) < parseUnits(String((list.totalAvailableAmount || 0) / 4), (token as Token)!.decimals);

	const needToDeployOrFund = escrowType === 'instant' && (needToDeploy || needToFund);

	const onProceed = () => {
		if (!needToDeployOrFund) {
			const updatedList = {
				...list,
				accept_only_trusted: acceptOnlyTrustedState
			};
			const message = listToMessage(updatedList);
			signMessage({ message });
		}
	};

	// Move all useEffect Hooks before any return statements
	useEffect(() => {
		if (lastDeployedContract && contracts.length > 0) {
			const deployed = contracts.find(
				(cont) => cont.address.toLowerCase() === lastDeployedContract.toLowerCase()
			);
			if (!deployed) {
				fetchUserProfile();
			}
		}
	}, [lastDeployedContract, contracts]);

	useEffect(() => {
		const fetchSettings = async () => {
			const response = await fetch('/api/settings');
			const settings: { [key: string]: string } = await response.json();
			setLastVersion(Number(settings.contract_version || 0));
		};
		fetchSettings();
	}, []);

	useEffect(() => {
		setAcceptOnlyTrustedState(acceptOnlyTrusted);
	}, [acceptOnlyTrusted]);

	if (needToDeployOrFund) {
		return (
			<FundEscrow
				token={token as Token}
				sellerContract={needToDeploy ? undefined : (sellerContract as `0x${string}` | undefined)}
				chainId={chainId}
				balance={(balance || BigInt(0)) as bigint}
				totalAvailableAmount={list.totalAvailableAmount!}
			/>
		);
	}

	const buttonText = !needToDeployOrFund
		? 'Sign and Finish'
		: needToDeploy
		? 'Create Escrow Account'
		: 'Deposit in the Escrow Account';

	return (
		<StepLayout onProceed={onProceed} buttonText={buttonText}>
			<div className="my-8">
				{list.escrowType === 'manual' && (
					<>
						<Label title="Deposit Time Limit" />
						<div className="mb-4">
							<span className="text-sm text-gray-600">
								<div>
									Your order will be cancelled if {type === 'SellList' ? 'you' : 'the seller'} don't
									deposit after <FriendlyTime timeInMinutes={Number(depositTimeLimit)} />.{' '}
								</div>
							</span>
						</div>
						<FriendlySelector
							value={depositTimeLimit}
							updateValue={(n) => updateList({ ...list, depositTimeLimit: n })}
							error={depositTimeLimit < 15 ? 'Minimum time is 15 mins' : undefined}
						/>
					</>
				)}

				<Label title="Payment Time Limit" />
				<div className="mb-4">
					<span className="text-sm text-gray-600">
						{paymentTimeLimit > 0 ? (
							<div>
								Your order can be cancelled if {type === 'SellList' ? 'the buyer' : 'you'} don't pay
								after <FriendlyTime timeInMinutes={Number(paymentTimeLimit)} />.{' '}
								<strong>Minimum 15 minutes. Maximum 72 hours.</strong>
							</div>
						) : (
							<div>Your orders will not be cancelled automatically.</div>
						)}
					</span>
				</div>
				<FriendlySelector
					value={paymentTimeLimit}
					updateValue={(n) => updateList({ ...list, paymentTimeLimit: n })}
					error={paymentTimeLimit < 15 ? 'Minimum time is 15 mins' : undefined}
				/>

				<div className="mb-[-2]">
					<Checkbox
						content={`Accept only verified ${type === 'SellList' ? 'buyers' : 'sellers'} (KYC)`}
						id="verified"
						name="verified"
						checked={acceptOnlyVerified}
						onChange={() =>
							updateList({
								...list,
								acceptOnlyVerified: !acceptOnlyVerified
							})
						}
					/>
				</div>

				<TrustedUsers
					acceptOnlyTrusted={acceptOnlyTrustedState}
					setAcceptOnlyTrusted={setAcceptOnlyTrustedState}
					selectedTrustedUsers={selectedTrustedUsers}
					setSelectedTrustedUsers={setSelectedTrustedUsers}
					context="trade"
				/>

				<BlockedUsers
					acceptOnlyBlocked={acceptOnlyBlocked}
					setAcceptOnlyBlocked={setAcceptOnlyBlocked}
					context="profile"
				/>

				<Label title="Order Terms" />
				<QuillEditor
					value={terms}
					onChange={onTermsChange}
					placeholder="Write the terms and conditions for your listing here"
				/>
			</div>
		</StepLayout>
	);
};

export default Details;
