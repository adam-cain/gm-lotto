import { Chain as RainbowKitChain } from "@rainbow-me/rainbowkit";
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
import { Address } from "@/types";

const nativeCurrency = { name: "Ether", symbol: "ETH", decimals: 18 };

export type NetworkStatus = "regular" | "hot" | "new";

export interface Chain extends RainbowKitChain {
  status?: NetworkStatus;
  managerAddress?: Address;
  tokenAddress?: Address;
}

export const chains: readonly [Chain, ...Chain[]] = [
  {
    ...optimismSepolia,
    name: "Optimism Sepolia",
    iconUrl: "/chains/optimism.svg",
    managerAddress: "0x5Cf6F21600AA0e5ED62ad7ad611c36155ac4fB99" as Address,
    tokenAddress: "0xB0b7D5Ee5eD459F81D24c5ba6E177986AB3fE68C" as Address,
    status: "hot",
  },
  ...(process.env.NODE_ENV === 'development' ? [] : []),
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
    nativeCurrency,
    iconUrl: "/chains/automata.png",
    iconBackground: "#F3E4CD",
  },
  {
    ...bob,
    iconUrl: "/chains/bob.webp",
    iconBackground: "#F25D00",
  },
  {
    ...base,
    iconUrl: "/chains/base.svg",
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
    nativeCurrency,
    iconUrl: "/chains/binary.png",
  },
  {
    ...cyber,
    iconUrl: "/chains/cyber.svg",
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
    iconUrl: "/chains/epic.png",
    iconBackground: "#5945EE",
  },
  {
    ...funkiMainnet,
    iconUrl: "/chains/funki.png",
  },
  {
    ...hashkey,
    iconUrl: "/chains/hashkey.png",iconBackground: "#0173E5",
  },
  {
    ...ink,
    iconUrl: "/chains/ink.png",iconBackground: "#7A2DFD",
  },
  {
    ...lisk,
    iconUrl: "/chains/lisk.svg",
  },
  {
    ...metalL2,
    iconUrl: "/chains/metal.png",
    iconBackground: "#6B35EA",
  },
  {
    ...mint,
    name: "Mint",
    iconUrl: "/chains/mint.png",
    iconBackground: "#30BF54",
  },
  {
    ...mode,
    name: "Mode",
    iconUrl: "/chains/mode.png",iconBackground: "#D8FF00",
  },
  {
    ...optimism,
    name: "Optimism",
    iconUrl: "/chains/op.png",
    iconBackground: "#FE0521",
  },
  {
    ...orderly,
    iconUrl: "/chains/orderly.png",iconBackground: "#8B21CC",
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
    nativeCurrency,
    iconUrl: "/chains/polynomial.png",
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
    nativeCurrency,
    iconUrl: "/chains/race.png",
    iconBackground: "#0D1824",
  },
  {
    ...redstone,
    iconUrl: "/chains/redstone.png",
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
    nativeCurrency,
    iconUrl: "/chains/settlus.png",iconBackground: "#025952",
  },
  {
    ...shape,
    iconUrl: "/chains/shape.png",
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
    nativeCurrency,
    iconUrl: "/chains/derive.png",
    iconBackground: "#F15C4B",
  },
  {
    ...celo,
    iconUrl: "/chains/celo.png",
    iconBackground: "#FEFD54",
  },
  {
    ...soneium,
    name: "Soneium",
    iconUrl: "/chains/soneium.jpeg",
    iconBackground: "#000000",
  },
  {
    ...superseed,
    iconUrl: "/chains/superseed.png",
    iconBackground: "#90D3D1",
  },
  {
    ...swan,
    name: "Swan Chain",
    iconUrl: "/chains/swan.png",
  },
  {
    ...swellchain,
    iconUrl: "/chains/swell.png",iconBackground: "#2E61EC",
  },
  {
    ...unichain,
    iconUrl: "/chains/unichain.jpg",iconBackground: "#F521C1",
  },
  {
    ...worldchain,
    iconUrl: "/chains/world.svg",
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
    nativeCurrency,
    iconUrl: "/chains/xterio.png",
  },
  {
    ...zora,
    iconUrl: "/chains/zora.svg",
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
    nativeCurrency,iconUrl: "/chains/arena-z.png",iconBackground: "#070730",
  },
] as const satisfies Chain[];

// Create a map of chains by ID for direct access
export const chainsById: Record<number, Chain> = Object.fromEntries(
  chains.map((chain) => [chain.id, chain])
) as Record<number, Chain>;
