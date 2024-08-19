//models/networks.ts

import { EvmNetwork } from '@dynamic-labs/sdk-react-core';
import { defineChain } from 'viem';
import { arbitrum, avalanche, bsc, gnosis, mainnet, optimism, polygon, polygonMumbai } from 'wagmi/chains';

export const blastEvmNetwork: EvmNetwork = {
	chainId: 81457,
	networkId: 81457,
	name: 'Blast',
	iconUrls: [
		'https://assets-global.website-files.com/65a6baa1a3f8ed336f415cb4/65a6cc95aae1066cf96d497d_Logo%20Black%20on%20Yellow%20Background%402x-p-500.png'
	],
	nativeCurrency: { decimals: 18, name: 'Ether', symbol: 'ETH' },
	privateCustomerRpcUrls: [process.env.NEXT_PUBLIC_BLAST_RPC_URL!],
	rpcUrls: ['https://rpc.blast.io', process.env.NEXT_PUBLIC_BLAST_RPC_URL!],
	vanityName: 'Blast',
	blockExplorerUrls: ['https://blastscan.io/'],
	chainName: 'Blast'
};

export const blast = defineChain({
	id: 81457,
	name: 'Blast',
	network: 'blast',
	networkId: 81457,
	chainId: 81457,
	blockExplorerUrls: ['https://blastscan.io'] as readonly string[],
	iconUrls: [
		'https://assets-global.website-files.com/65a6baa1a3f8ed336f415cb4/65a6cc95aae1066cf96d497d_Logo%20Black%20on%20Yellow%20Background%402x-p-500.png'
	] as readonly string[],
	nativeCurrency: {
		name: 'Ether',
		symbol: 'ETH',
		decimals: 18
	},
	rpcUrls: {
		default: {
			http: ['https://rpc.blast.io']
		},
		public: {
			http: ['https://rpc.blast.io']
		}
	},
	blockExplorers: {
		default: {
			name: 'BlastScan',
			url: 'https://blastscan.io'
		},
		etherscan: {
			name: 'BlastScan',
			url: 'https://blastscan.io'
		}
	},
	contracts: {
		multicall3: {
			address: '0xcA11bde05977b3631167028862bE2a173976CA11',
			blockCreated: 88189
		}
	},
	testnet: false
});

export const DEPLOYER_V1_CONTRACTS: { [key: number]: `0x${string}` } = {
	[polygon.id]: process.env.NEXT_PUBLIC_POLYGON_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`,
	[avalanche.id]: process.env.NEXT_PUBLIC_AVAX_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`,
	[polygonMumbai.id]: process.env.NEXT_PUBLIC_MUMBAI_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`,
	[arbitrum.id]: process.env.NEXT_PUBLIC_ARBITRUM_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`,
	[optimism.id]: process.env.NEXT_PUBLIC_OPTIMISM_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`,
	[mainnet.id]: process.env.NEXT_PUBLIC_ETHEREUM_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`,
	[bsc.id]: process.env.NEXT_PUBLIC_BSC_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`
	// [gnosis.id]: process.env.NEXT_PUBLIC_GNOSIS_DEPLOYER_CONTRACT_ADDRESS! as `0x${string}`
};

export const DEPLOYER_CONTRACTS: { [key: number]: `0x${string}` } = {
	[polygonMumbai.id]: '0xc2D26E2C9C7f0a3D0A6B4458E5f4A7f999567CDC',
	[polygon.id]: '0x8E62e95E91eB6b650D4137b6CA687AaaC5B5F8E0',
	[mainnet.id]: '0xEa13b6fA1b1Ac3b0951E943fCA37cC29Ed5703Aa',
	[avalanche.id]: '0xE76Ea4d3E63ae8552fb582E8a58Ff353eB2F5434',
	[arbitrum.id]: '0xEa13b6fA1b1Ac3b0951E943fCA37cC29Ed5703Aa',
	[optimism.id]: '0xEa13b6fA1b1Ac3b0951E943fCA37cC29Ed5703Aa',
	[bsc.id]: '0xEa13b6fA1b1Ac3b0951E943fCA37cC29Ed5703Aa',
	[gnosis.id]: '0x491A140c185Feb0C0BbF90Fa4bBF6b0A3CF019D1',
	[blast.id]: '0x491A140c185Feb0C0BbF90Fa4bBF6b0A3CF019D1'
};

export const networkApiKeys: { [key: number]: string } = {
	[polygon.id]: process.env.NEXT_PUBLIC_BICONOMY_MATIC_API_KEY!,
	[polygonMumbai.id]: process.env.NEXT_PUBLIC_BICONOMY_MATICMUM_API_KEY!,
	[mainnet.id]: process.env.NEXT_PUBLIC_BICONOMY_ETHEREUM_API_KEY!,
	[avalanche.id]: process.env.NEXT_PUBLIC_BICONOMY_AVALANCHE_API_KEY!,
	[arbitrum.id]: process.env.NEXT_PUBLIC_BICONOMY_ARBITRUM_API_KEY!,
	[optimism.id]: process.env.NEXT_PUBLIC_BICONOMY_OPTIMISM_API_KEY!,
	[bsc.id]: process.env.NEXT_PUBLIC_BICONOMY_BSC_API_KEY!,
	[gnosis.id]: process.env.NEXT_PUBLIC_BICONOMY_GNOSIS_API_KEY!
};

export const quadrataPassportContracts: { [key: number]: `0x${string}` } = {
	[polygon.id]: '0x2e779749c40CC4Ba1cAB4c57eF84d90755CC017d',
	[avalanche.id]: '0x97058A9B7D0ce525009083F9b2C219336ce97736',
	[polygonMumbai.id]: '0x185cc335175B1E7E29e04A321E1873932379a4a0',
	[mainnet.id]: '0x2e779749c40CC4Ba1cAB4c57eF84d90755CC017d'
};

export const productionChains = [polygon, mainnet, arbitrum, optimism, bsc, avalanche, gnosis, blast];

const devChains = [polygonMumbai];

export const allChains = process.env.NODE_ENV === 'production' ? productionChains : [...productionChains, ...devChains];

export const FULL_GASLESS_CHAINS: number[] = [
	polygon.id,
	polygonMumbai.id,
	arbitrum.id,
	optimism.id,
	bsc.id,
	avalanche.id,
	gnosis.id
];
export const HARDCODED_GAS_CHAINS: number[] = [polygon.id, polygonMumbai.id];
