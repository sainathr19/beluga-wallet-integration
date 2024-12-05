'use client'

import * as React from 'react';
import { Connector, useChainId, useConnect, useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Connect() {
  const chainId = useChainId();
  const { connectors, connect } = useConnect();
  const { isConnected } = useAccount();
  const router = useRouter();

  React.useEffect(() => {
    if (isConnected) {
      router.push('/');
    }
  }, [isConnected, router]);

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-lg p-8">
        <div className="text-center mb-8">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <Image
              src="/beluga.png"
              alt="Beluga Token"
              fill
              className="rounded-full object-cover shadow-md"
              priority
            />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome to Beluga Token</h1>
          <p className="text-slate-600">Connect your wallet to continue</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
          <div className="space-y-4">
            {connectors.map((connector) => (
              <ConnectorButton
                key={connector.uid}
                connector={connector}
                onClick={async () => {
                  await connect({ connector, chainId });
                  router.push('/');
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConnectorButton({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <Button
      className="w-full h-12 text-lg font-medium bg-slate-800 hover:bg-slate-700 transition-colors"
      disabled={!ready}
      onClick={onClick}
      type="button"
    >
      Connect {connector.name}
    </Button>
  );
}
