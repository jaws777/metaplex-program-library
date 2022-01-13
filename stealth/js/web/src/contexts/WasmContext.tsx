import * as React from "react";

import init, {
  elgamal_keypair_from_signature,
  elgamal_decrypt,
  transfer_chunk_txs,
  transfer_buffer_len,
} from '../utils/stealth/stealth_js';

export interface WasmConfig {
  elgamalKeypairFromSignature: (signature: any) => any;
  elgamalDecrypt: (elgamalKeypair: any, ciphertext: any) => any;
  transferChunkTxs: (
    elgamal_keypair: any,
    recipient_elgamal_pubkey: any,
    ciphertext: any,
    cipherkey: any,
    accounts: any,
  ) => any;
  transferBufferLen: () => any;
}

const WasmContext = React.createContext<WasmConfig | undefined>(undefined);

export function WasmProvider({ children }: { children: any }) {
  const [contextValue, setContextValue] = React.useState<WasmConfig | null>(null);

  React.useEffect(() => {
    const wrap = async () => {
      // TODO: figure out why reading functions of output don't work here...
      const bindings = await init();
      setContextValue({
        elgamalKeypairFromSignature: elgamal_keypair_from_signature,
        elgamalDecrypt: elgamal_decrypt,
        transferChunkTxs: transfer_chunk_txs,
        transferBufferLen: transfer_buffer_len,
      });
    };
    wrap();
  }, []);

  return (
    <WasmContext.Provider value={contextValue}>
      {children}
    </WasmContext.Provider>
  );
}

export function useWasmConfig() {
  const context = React.useContext(WasmContext);
  if (context === undefined) {
    throw new Error('WasmContext must be used with a WasmProvider');
  }
  return context;
}