//components/QuadrataClient/Quadrata.tsx
import '@quadrata/core-react/lib/cjs/quadrata-ui.min.css';

import Loading from 'components/Loading/Loading';
import { quadrataPassportContracts } from 'models/networks';
import React, { useEffect, useState } from 'react';
import { useWriteContract, useConfig, useSimulateContract, useWaitForTransactionReceipt } from 'wagmi';

import {
	Page,
	QuadAttribute,
	QuadClient,
	QuadClientConfig,
	QuadClientEnvironment,
	QuadClientMintParamsReadyCallback,
	QuadMintParamsBigNumbers
} from '@quadrata/client-react';
import QUAD_PASSPORT_ABI from '@quadrata/contracts/abis/QuadPassport.json';
import { useConfirmationSignMessage, useCombinedAccount } from 'hooks';
import { getAuthToken } from '@dynamic-labs/sdk-react-core';

const quadConfig: QuadClientConfig = {
	environment:
		process.env.NODE_ENV === 'production' ? QuadClientEnvironment.PRODUCTION : QuadClientEnvironment.SANDBOX,
	protocolName: 'OpenPeer'
};

const Quadrata = ({ onFinish, open, onHide }: { onFinish: () => void; open: boolean; onHide: () => void }) => {
	// State
	const [signature, setSignature] = useState<string>();
	const [mintParams, setMintParams] = useState<QuadMintParamsBigNumbers>();
	const [mintComplete, setMintComplete] = useState(false);
	const [accessToken, setAccessToken] = useState('');

	// Hooks
	const config = useConfig();
	const chainId = config.state.current
		? config.state.connections.get(config.state.current)?.chainId
		: config.chains[0]?.id;
	const { address: account, isConnecting } = useCombinedAccount();
	const { data: signMessageData, signMessage, variables } = useConfirmationSignMessage({});

	const requiredAttributes = [QuadAttribute.DID, QuadAttribute.AML];

	useEffect(() => {
		// Fetching access token
		const getApiAccessToken = async () => {
			fetch('/api/quadrata')
				.then((res) => res.json())
				.then((response) => {
					setAccessToken(response.accessToken);
				});
		};

		getApiAccessToken();
	}, []);

	useEffect(() => {
		(async () => {
			if (variables?.message && signMessageData) {
				setSignature(signMessageData);
			}
		})();
	}, [signMessageData, variables?.message]);

	// Claim Passport on-chain
	const { data: simulateData } = useSimulateContract({
		abi: QUAD_PASSPORT_ABI,
		address: chainId ? quadrataPassportContracts[chainId] : undefined,
		functionName: 'setAttributesBulk',
		args: mintParams ? [mintParams.params, mintParams.signaturesIssuers, mintParams.signatures] : undefined,
		value: mintParams?.fee ? BigInt(mintParams.fee.toString()) : undefined,
		query: {
			enabled: Boolean(mintParams && chainId)
		}
	});

	const { writeContract, data: writeData } = useWriteContract();

	const { isLoading: isWaiting, isSuccess } = useWaitForTransactionReceipt({
		hash: writeData
	});

	// useWaitForTransaction({
	// 	hash: data?.hash,
	// 	onSuccess: async () => {
	// 		await fetch(`/api/user_profiles/${chainId}`, {
	// 			method: 'POST',
	// 			headers: {
	// 				Authorization: `Bearer ${getAuthToken()}`
	// 			}
	// 		});
	// 		setMintComplete(true);
	// 		setMintParams(undefined);
	// 		onFinish();
	// 	}
	// });

	useEffect(() => {
		if (isSuccess && chainId) {
			(async () => {
				await fetch(`/api/user_profiles/${chainId}`, {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${getAuthToken()}`
					}
				});
				setMintComplete(true);
				setMintParams(undefined);
				onFinish();
			})();
		}
	}, [isSuccess, chainId, onFinish]);

	// Handlers
	const handleSign = async (message: string) => {
		// User clicked the initial sign button
		// Signing the message and updating state.
		// Will navigate to the next step upon signature update
		if (account) {
			signMessage({ message });
		}
	};

	const handlePageChange = (page: Page) => {
		if (page === Page.INTRO && signature) {
			// Intro page navigation will get triggered when a different wallet is detected,
			// Resetting previous signature if present.
			setSignature(undefined);
		}
	};

	const handleMintParamsReady: QuadClientMintParamsReadyCallback = (params) => {
		// Setting mint params to prepare the write function
		setMintParams(params);
	};

	const handleMintClick = async () => {
		if (simulateData?.request) {
			writeContract(simulateData.request);
		}
	};

	if (!account) {
		return <></>;
	}

	if (isConnecting) {
		return <Loading />;
	}

	if (!open) {
		return <></>;
	}

	// User is missing at least one attribute,
	// Onboarding user
	return (
		<QuadClient
			account={account}
			config={quadConfig}
			accessToken={accessToken}
			chainId={chainId as number}
			onSign={handleSign}
			signature={signature}
			attributes={requiredAttributes}
			onMintClick={handleMintClick}
			mintComplete={mintComplete}
			onPageChange={handlePageChange}
			transactionHash={writeData}
			onMintParamsReady={handleMintParamsReady}
			darkMode={false}
			onHide={onHide}
		>
			<Loading />
		</QuadClient>
	);
};

export default Quadrata;
