import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  OrbisDB,
  type OrbisConnectResult,
  type SiwxAttestation,
} from "@useorbis/db-sdk";
import { OrbisEVMAuth } from "@useorbis/db-sdk/auth";
import { useWalletClient } from "wagmi";

type OrbisDBProps = {
  children: ReactNode;
};

const ENV_ID = process.env.NEXT_PUBLIC_ENV_ID ?? "";

declare global {
  interface Window {
    ethereum?: any;
  }
}

/**
 * Configure Orbis Client & create context.
 */

const orbis = new OrbisDB({
  ceramic: {
    gateway: "https://ceramic-orbisdb-mainnet-direct.hirenodes.io/",
  },
  nodes: [
    {
      gateway: "https://studio.useorbis.com",
      env: ENV_ID,
    },
  ],
});

let isAuthenticated = false;

const Context = createContext({ orbis, isAuthenticated });

export const ODB = ({ children }: OrbisDBProps) => {
  function StartAuth() {
    const { data: walletClient } = useWalletClient();
    const [isAuth, setAuth] = useState(false);

    useEffect(() => {
      const StartOrbisAuth = async (): Promise<
        OrbisConnectResult | undefined
      > => {
        const auth = new OrbisEVMAuth(window.ethereum!);
        // Authenticate - this option persists the session in local storage
        const authResult: OrbisConnectResult = await orbis.connectUser({
          auth,
        });
        if (authResult.session) {
          console.log("Orbis Auth'd:", authResult.session);
          return authResult;
        }

        return undefined;
      };

      // Only run this if the wallet client is available
      if (walletClient) {
        const address = walletClient.account.address;
        if (localStorage.getItem("orbis:session") && address) {
          const attestation = (
            JSON.parse(
              localStorage.getItem("orbis:session") ?? "{}",
            ) as OrbisConnectResult
          ).session.authAttestation as SiwxAttestation;
          const expTime = attestation.siwx.message.expirationTime;
          if (
            attestation.siwx.message.address.toLowerCase() !==
            address.toLowerCase()
          ) {
            localStorage.removeItem("orbis:session");
          }
          //@ts-expect-error - TS doesn't know about the expirationTime field
          else if (expTime > Date.now()) {
            localStorage.removeItem("orbis:session");
          } else {
            setAuth(true);
            isAuthenticated = true;
          }
        }
        if (!isAuthenticated) {
          StartOrbisAuth().then((authResult) => {
            if (authResult) {
              setAuth(true);
              isAuthenticated = true;
            }
          });
        }
        orbis.getConnectedUser().then((user) => {
          console.log("Connected User:", user);
        });
      } else {
        localStorage.removeItem("orbis:session");
      }
    }, [isAuth, walletClient]);

    return isAuth;
  }

  if (!isAuthenticated) {
    isAuthenticated = StartAuth();
  }

  return (
    <Context.Provider value={{ orbis, isAuthenticated }}>
      {children}
    </Context.Provider>
  );
};

export const useODB = () => useContext(Context);
