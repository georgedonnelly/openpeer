/* eslint-disable @typescript-eslint/indent */
/* eslint-disable no-mixed-spaces-and-tabs */
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { MessageContext } from 'contexts/MessageContext';
import React, { useContext } from 'react';
// import { WalletChatProvider, WalletChatWidget } from 'react-wallet-chat-sso';
import { useConfig } from 'wagmi';
import { useCombinedAccount } from 'hooks';

interface ChatProviderProps {
	children: React.ReactNode;
}

const ChatProvider = ({ children }: ChatProviderProps) => {
	const { address: account } = useCombinedAccount();
	const config = useConfig();
	const { messageToSign, signedMessage } = useContext(MessageContext);
	const { isAuthenticated } = useDynamicContext();
	const signInformation = signedMessage && messageToSign;

	// Get the current chain
	const chainId = config.state.current ? config.state.connections.get(config.state.current)?.chainId : undefined;

	// Get the current connector
	const connector = config.state.current ? config.state.connections.get(config.state.current)?.connector : undefined;

	return (
		// 	<WalletChatProvider>
		// 		<div className={isAuthenticated && signInformation ? '' : 'hidden'}>
		// 			<WalletChatWidget
		// 				connectUrl="https://sso-fe.walletchat.fun"
		// 				requestSignature={!signInformation}
		// 				connectedWallet={
		// 					account && chain ? { walletName: connector?.name || '', account, chainId: chain.id } : undefined
		// 				}
		// 				signedMessageData={
		// 					signedMessage && messageToSign
		// 						? {
		// 								signature: signedMessage,
		// 								msgToSign: messageToSign
		// 						  }
		// 						: undefined
		// 				}
		// 			/>
		// 		</div>
		// 		{children}
		// 	</WalletChatProvider>
		// );
		// };
		<p>Chat returning soon</p>
	);
};

export default ChatProvider;
