import {
  optimism,
  base,
  celo,
  zora,
  unichain,
  soneium,
  ink,
  superseed,
  mode,
  lisk,
  mint,
  worldchain,
  swellchain,
  cyber,
  funkiMainnet,
  hashkey,
  ethernity,
  redstone,
  metalL2,
  swan,
  shape,
  orderly,
  bob,
  optimismSepolia,
} from "wagmi/chains";
import { Chain as RainbowKitChain } from "@rainbow-me/rainbowkit";

type NativeCurrency = {
  decimals: number;
  name: string;
  symbol: string;
};

export interface Chain extends RainbowKitChain {
  superchainLevel?: number;
  governedByOptimism?: boolean;
  dataAvailabilityType?: string;
  parent?: {
    type: string;
    chain: string;
  };
  gasPayingToken?: string;
  status: string;
}

const nativeCurrency: Readonly<NativeCurrency> = {
  decimals: 18,
  name: 'ETH',
  symbol: 'ETH',
}

export const chains: Readonly<Chain>[] = [
  ...(process.env.NODE_ENV === 'development' ? [{
    ...optimismSepolia,
    name: "Optimism Sepolia",
    iconUrl: "/chains/optimism.svg",
    status: "regular",
  }] : []),
  {
    
      name: "Automata",
      id: 65536,
      rpcUrls: {
          default: {
              http: ["https://rpc.ata.network"],
          },
      },
      blockExplorers: {
          default: {
              name: "Automata Explorer",
              url: "https://explorer.ata.network",
          },
      },
      superchainLevel: 0,
      governedByOptimism: false,
      dataAvailabilityType: "alt-da",
      parent: {
          type: "L2",
          chain: "mainnet",
      },
      gasPayingToken: "0xA2120b9e674d3fC3875f415A7DF52e382F141225",
      iconUrl: "/chains/automata.png",
      status: "regular",
      nativeCurrency,
      iconBackground: "#F3E4CD",
  },
  {
    ...bob,
    superchainLevel: 0,
    governedByOptimism: false,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/bob.webp",
    status: "hot",
    iconBackground: "#F25D00",
  },
  {
    ...base,
    superchainLevel: 1,
    governedByOptimism: false,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/base.svg",
    status: "regular",
    iconBackground: "#2050F5",
  },
  {
    name: "Binary",
    id: 624,
    rpcUrls: {
      default: {
        http: ["https://rpc.zero.thebinaryholdings.com"],
      },
    },
    blockExplorers: {
      default: {
        name: "Binary Explorer",
        url: "https://explorer.thebinaryholdings.com",
      },
    },
    superchainLevel: 0,
    governedByOptimism: false,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    gasPayingToken: "0x04E9D7e336f79Cdab911b06133D3Ca2Cd0721ce3",
    iconUrl: "/chains/binary.png",
    status: "regular",
    nativeCurrency

  },
  {
    ...cyber,
    superchainLevel: 0,
    governedByOptimism: false,
    dataAvailabilityType: "alt-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/cyber.svg",
    status: "regular",
    // iconBackground: "#09DC0E",
    iconBackground: "#0A9B01",
  },
  {
    ...ethernity,
    // Changed name to Epic Chain
    name: "Epic Chain",
    rpcUrls: {
      default: {
        http: ["https://mainnet.ethernitychain.io"],
      },
    },
    blockExplorers: {
      default: {
        name: "Epic Explorer",
        url: "https://ernscan.io",
      },
    },
    superchainLevel: 1,
    governedByOptimism: false,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/epic.png",
    status: "regular",
    iconBackground: "#5945EE",
  },
  {
    ...funkiMainnet,
    superchainLevel: 0,
    governedByOptimism: false,
    dataAvailabilityType: "alt-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/funki.png",
    status: "regular",
  },
  {
    ...hashkey,
    superchainLevel: 0,
    governedByOptimism: false,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    gasPayingToken: "0xE7C6BF469e97eEB0bFB74C8dbFF5BD47D4C1C98a",
    iconUrl: "/chains/hashkey.png",
    status: "regular",
    iconBackground: "#0173E5",
  },
  {
    ...ink,
    superchainLevel: 1,
    governedByOptimism: true,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/ink.png",
    status: "new",
    iconBackground: "#7A2DFD",
  },
  {
    ...lisk,
    superchainLevel: 1,
    governedByOptimism: false,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/lisk.svg",
    status: "regular",
  },
  {
    ...metalL2,
    superchainLevel: 1,
    governedByOptimism: true,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/metal.png",
    status: "regular",
    iconBackground: "#6B35EA",
  },
  {
    ...mint,
    superchainLevel: 0,
    governedByOptimism: false,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/mint.png",
    status: "regular",
    iconBackground: "#30BF54",
  },
  {
    ...mode,
    superchainLevel: 1,
    governedByOptimism: true,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/mode.png",
    status: "regular",
    iconBackground: "#D8FF00",
  },
  {
    ...optimism,
    name: "Optimism",
    superchainLevel: 2,
    governedByOptimism: true,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/op.png",
    status: "regular",
    iconBackground: "#FE0521",
  },
  {
    ...orderly,
    superchainLevel: 0,
    governedByOptimism: false,
    dataAvailabilityType: "alt-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/orderly.png",
    status: "regular",
    iconBackground: "#8B21CC",
  },
  {
    name: "Polynomial",
    id: 8008,
    rpcUrls: {
      default: {
        http: ["https://rpc.polynomial.fi"],
      },
    },
    blockExplorers: {
      default: {
        name: "Polynomial Explorer",
        url: "https://polynomialscan.io",
      },
    },
    superchainLevel: 1,
    governedByOptimism: false,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/polynomial.png",
    status: "regular",
    nativeCurrency,
    iconBackground: "#D0E568",
  },
  {
    name: "RACE",
    id: 6805,
    rpcUrls: {
      default: {
        http: ["https://racemainnet.io"],
      },
    },
    blockExplorers: {
      default: {
        name: "RACE Explorer",
        url: "https://racescan.io/",
      },
    },
    superchainLevel: 0,
    governedByOptimism: false,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/race.png",
    status: "regular",
    iconBackground: "#0D1824",
    nativeCurrency
  },
  {
    ...redstone,
    superchainLevel: 0,
    governedByOptimism: false,
    dataAvailabilityType: "alt-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/redstone.png",
    status: "regular",
    iconBackground: "#F34242",
  },
  {
    name: "Settlus",
    id: 5371,
    rpcUrls: {
      default: {
        http: ["https://settlus-mainnet.g.alchemy.com/public"],
      },
    },
    blockExplorers: {
      default: {
        name: "Settlus Explorer",
        url: "https://mainnet.settlus.network",
      },
    },
    superchainLevel: 0,
    governedByOptimism: false,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/settlus.png",
    status: "regular",
    nativeCurrency,
    iconBackground: "#025952",
  },
  {
    ...shape,
    superchainLevel: 1,
    governedByOptimism: false,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/shape.png",
    status: "regular",
  },
  {
    name: "Derive Chain",
    id: 957,
    rpcUrls: {
      default: {
        http: ["https://rpc.lyra.finance"],
      },
    },
    blockExplorers: {
      default: {
        name: "Derive Explorer",
        url: "https://explorer.lyra.finance",
      },
    },
    // Not sure, new chain not in registry
    // "superchainLevel": 1,
    // "governedByOptimism": true,
    // "dataAvailabilityType": "eth-da",
    // "parent": {
    //     "type": "L2",
    //     "chain": "mainnet"
    // },
    iconUrl: "/chains/derive.png",
    status: "regular",
    nativeCurrency,
    iconBackground: "#F15C4B",
  },
  {
    ...celo,
    // Not sure, new chain not in registry
    //    "superchainLevel": 1,
    //    "governedByOptimism": true,
    //    "dataAvailabilityType": "eth-da",
    //    "parent": {
    //     "type": "L2",
    //     "chain": "mainnet"
    //    },
    iconUrl: "/chains/celo.png",
    status: "regular",
    iconBackground: "#FEFD54",
  },
  {
    ...soneium,
    superchainLevel: 1,
    governedByOptimism: true,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/soneium.jpeg",
    status: "hot",
    iconBackground: "#000000",
  },
  {
    ...superseed,
    superchainLevel: 1,
    governedByOptimism: false,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/superseed.png",
    status: "new",
    iconBackground: "#90D3D1",
  },
  {
    ...swan,
    superchainLevel: 0,
    governedByOptimism: false,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/swan.png",
    status: "regular",
  },
  {
    ...swellchain,
    superchainLevel: 1,
    governedByOptimism: true,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/swell.png",
    status: "regular",
    iconBackground: "#2E61EC",
  },
  {
    ...unichain,
    superchainLevel: 1,
    governedByOptimism: true,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/unichain.jpg",
    status: "regular",
    iconBackground: "#F521C1",
  },
  {
    ...worldchain,
    superchainLevel: 1,
    governedByOptimism: false,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/world.svg",
    status: "regular",
  },
  {
    name: "Xterio Chain",
    id: 2702128,
    rpcUrls: {
      default: {
        http: ["https://xterio-eth.alt.technology/"],
      },
    },
    blockExplorers: {
      default: {
        name: "Xterio Explorer",
        url: "https://eth.xterscan.io/",
      },
    },
    superchainLevel: 0,
    governedByOptimism: false,
    dataAvailabilityType: "alt-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/xterio.png",
    status: "regular",
    nativeCurrency
  },
  {
    ...zora,
    superchainLevel: 1,
    governedByOptimism: true,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/zora.svg",
    status: "new",
  },
  {
    name: "Arena-Z",
    id: 7897,
    rpcUrls: {
      default: {
        http: ["https://rpc.arena-z.gg"],
      },
    },
    blockExplorers: {
      default: {
        name: "Arena-Z Explorer",
        url: "https://explorer.arena-z.gg",
      },
    },
    superchainLevel: 1,
    governedByOptimism: true,
    dataAvailabilityType: "eth-da",
    parent: {
      type: "L2",
      chain: "mainnet",
    },
    iconUrl: "/chains/arena-z.png",
    status: "regular",
    nativeCurrency,
    iconBackground: "#070730",
  },
] as const satisfies Chain[];
