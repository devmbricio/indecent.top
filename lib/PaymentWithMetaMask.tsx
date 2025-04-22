"use client";

import { useState, useEffect } from "react";
import { Web3Provider } from "@ethersproject/providers";
import axios from "axios";
import { ethers } from "ethers";
import Image from "next/image";
import { GlobeLockIcon } from "lucide-react";

interface PaymentWithMetaMaskProps {
  userId?: string;
  amount: number; // Valor em BRL a ser convertido para ETH
}

const PaymentWithMetaMask = ({ userId, amount }: PaymentWithMetaMaskProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [status, setStatus] = useState<string>(""); // Mensagem de status amigável ao usuário
  const [errorDetails, setErrorDetails] = useState<string | null>(null); // Mensagem de erro técnico
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [ethToBrlRate, setEthToBrlRate] = useState<number>(0);

  // Obter taxa ETH para BRL
  const fetchEthToBrlRate = async () => {
    try {
      const response = await axios.get("/api/simple/price");
      setEthToBrlRate(response.data.ethToBrl);
    } catch (error) {
      console.error("Erro ao obter taxa ETH para BRL:", error);
      setStatus("Erro ao obter taxa de conversão ETH para BRL.");
      setErrorDetails(error instanceof Error ? error.message : String(error));
    }
  };

  // Conectar MetaMask
  const connectMetaMask = async () => {
    if (window.ethereum && !isConnecting) {
      setIsConnecting(true);
      try {
        const [address] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(address);
        setStatus("Conectado!");
        setErrorDetails(null); // Limpa erros anteriores
      } catch (err) {
        console.error("Erro ao conectar MetaMask:", err);
        setStatus("Erro ao conectar MetaMask.");
        setErrorDetails(err instanceof Error ? err.message : String(err));
      } finally {
        setIsConnecting(false);
      }
    } else if (!window.ethereum) {
      setStatus("MetaMask não detectado.");
    } else {
      setStatus("Aguarde a conexão com MetaMask.");
    }
  };

  // Processar pagamento com MetaMask
  const handlePayment = async () => {
    if (!account) {
      setStatus("Por favor, conecte sua MetaMask primeiro.");
      return;
    }

    if (ethToBrlRate === 0) {
      setStatus("Aguarde enquanto obtemos a taxa de conversão ETH para BRL.");
      return;
    }

    const provider = new Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    try {
      const amountInEther = ethers.utils.parseEther(
        (amount / ethToBrlRate).toFixed(18)
      );

      const receiverAddress = "0x275f2284a61ed15dc8a447b50034143e7d855492";

      const tx = await signer.sendTransaction({
        to: receiverAddress,
        value: amountInEther,
      });

      await tx.wait();

      const res = await axios.post("/api/metamask", {
        txHash: tx.hash,
        userId,
        amount,
      });

      if (res.data.success) {
        setStatus("Pagamento realizado com sucesso!");
        setErrorDetails(null); // Limpa erros anteriores
      } else {
        setStatus("Erro ao registrar pagamento.");
        setErrorDetails(res.data.message || "Erro desconhecido ao registrar.");
      }
    } catch (error) {
      console.error("Erro na transação:", error);
      setStatus("Erro ao realizar pagamento.");
      setErrorDetails(error instanceof Error ? error.message : String(error));
    }
  };

  // Carregar taxa ao montar o componente
  useEffect(() => {
    fetchEthToBrlRate();
  }, []);

  return (
    <div className="p-2 text-sm">
      {account ? (
        <p>Conectado como: {account}</p>
      ) : (
        <button
          onClick={connectMetaMask}
          disabled={isConnecting}
          className="flex items-center gap-2"
        >
          {isConnecting ? (
            <span>Conectando...</span>
          ) : (
            <>
              <GlobeLockIcon className="w-4 h-4 text-green-400" />
              Conectar MetaMask
            </>
          )}
        </button>
      )}

      <div className="mt-4">
        <button
          onClick={handlePayment}
          className="flex items-center gap-2"
          disabled={ethToBrlRate === 0 || isConnecting}
        >
          <Image
            src="/metamask-logo.png"
            alt="MetaMask Logo"
            width={20}
            height={20}
            style={{ marginRight: "10px" }}
          />
          Pagar com MetaMask
        </button>
      </div>

      <p>{status}</p>

      {errorDetails && (
        <pre className="text-red-500 text-xs mt-2">
          Detalhes do erro: {errorDetails}
        </pre>
      )}
    </div>
  );
};

export default PaymentWithMetaMask;


/* funcional antes dos creditos na cobranca
"use client";

import { useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import axios from "axios";
import { ethers } from "ethers";  // Certifique-se de que você está importando corretamente
import Image from "next/image"; // Importando o componente Image do Next.js
import { GlobeLockIcon } from "lucide-react"; // Importando o ícone GlobeLockIcon

interface PaymentWithMetaMaskProps {
  userId?: string;
  amount: number; // Valor do produto para ser passado ao MetaMask
}

const PaymentWithMetaMask = ({ userId, amount }: PaymentWithMetaMaskProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState<boolean>(false); // Flag para bloquear múltiplas tentativas de conexão

  // Conectar MetaMask
  const connectMetaMask = async () => {
    if (window.ethereum && !isConnecting) { // Verifica se já não está conectando
      setIsConnecting(true); // Marca como conectando para evitar múltiplas tentativas
      try {
        const [address] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(address);
        setStatus("Conectado!");
      } catch (err) {
        console.error("Erro ao conectar MetaMask:", err);
        setStatus("Erro ao conectar MetaMask");
      } finally {
        setIsConnecting(false); // Libera a conexão após completar
      }
    } else if (!window.ethereum) {
      setStatus("MetaMask não detectado");
    } else {
      setStatus("Aguarde a conexão com MetaMask ser concluída.");
    }
  };

  // Garantir que amount seja um número válido
  const getAmountInEther = (amount: number) => {
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount");
    }
    return ethers.utils.parseEther(amount.toString()); // Usando ethers.utils para acessar parseEther
  };

  // Processamento do pagamento com MetaMask
  const handlePayment = async () => {
    if (!account) {
      setStatus("Por favor, conecte sua MetaMask primeiro.");
      return;
    }
  
    const provider = new Web3Provider(window.ethereum);
    const signer = provider.getSigner();
  
    try {
      // Garantir que amount seja um número válido e o valor correto
      const amountInEther = getAmountInEther(amount);
  
      // Substitua com o endereço correto
      const receiverAddress = "0x275f2284a61ed15dc8a447b50034143e7d855492";  // Substitua por um endereço real de recebimento
  
      const tx = await signer.sendTransaction({
        to: receiverAddress,  // Coloque aqui o endereço real de quem vai receber
        value: amountInEther,
      });
  
      await tx.wait();  // Espera a confirmação da transação
  
      // Envia o hash da transação para o backend para registrar o pagamento
      const res = await axios.post("/api/metamask", {
        txHash: tx.hash,
        userId,
        amount,
      });
  
      if (res.data.success) {
        setStatus("Pagamento realizado com sucesso!");
      } else {
        setStatus("Erro ao registrar pagamento.");
      }
    } catch (error) {
      console.error("Erro na transação:", error);
      setStatus("Erro ao realizar pagamento.");
    }
  };
  

  return (
    <div className="p-2 text-sm">
      <h2></h2>
      {account ? (
        <p>Conectado como: {account}</p>
      ) : (
        <button onClick={connectMetaMask} disabled={isConnecting} className="flex items-center gap-2">
          {isConnecting ? (
            <span>Conectando...</span>
          ) : (
            <>
              <GlobeLockIcon className="w-4 h-4 text-green-400" />
              Conectar MetaMask
            </>
          )}
        </button> // Desabilita o botão enquanto conecta
      )}

      <div className="mt-4">
        <button onClick={handlePayment} style={{ display: "flex", alignItems: "center" }} className="flex items-center gap-2">
          <Image
            src="/metamask-logo.png" // Caminho para a imagem do MetaMask na pasta public
            alt="MetaMask Logo"
            width={20}  // Ajuste o tamanho da imagem conforme necessário
            height={20}
            style={{ marginRight: "10px" }} // Adiciona margem à direita da imagem
          />
         
        </button>
      </div>

      <p>{status}</p>
    </div>
  );
};

export default PaymentWithMetaMask;
*/



/* funcional antes do ivl


"use client";

import { useState } from "react";
import { Web3Provider } from "@ethersproject/providers";
import axios from "axios";
import { ethers } from "ethers";  // Certifique-se de que você está importando corretamente
import Image from "next/image"; // Importando o componente Image do Next.js
import { GlobeLockIcon } from "lucide-react"; // Importando o ícone GlobeLockIcon

interface PaymentWithMetaMaskProps {
  userId?: string;
  amount: number; // Valor do produto para ser passado ao MetaMask
}

const PaymentWithMetaMask = ({ userId, amount }: PaymentWithMetaMaskProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [status, setStatus] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState<boolean>(false); // Flag para bloquear múltiplas tentativas de conexão

  // Conectar MetaMask
  const connectMetaMask = async () => {
    if (window.ethereum && !isConnecting) { // Verifica se já não está conectando
      setIsConnecting(true); // Marca como conectando para evitar múltiplas tentativas
      try {
        const [address] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(address);
        setStatus("Conectado!");
      } catch (err) {
        console.error("Erro ao conectar MetaMask:", err);
        setStatus("Erro ao conectar MetaMask");
      } finally {
        setIsConnecting(false); // Libera a conexão após completar
      }
    } else if (!window.ethereum) {
      setStatus("MetaMask não detectado");
    } else {
      setStatus("Aguarde a conexão com MetaMask ser concluída.");
    }
  };

  // Garantir que amount seja um número válido
  const getAmountInEther = (amount: number) => {
    if (isNaN(amount) || amount <= 0) {
      throw new Error("Invalid amount");
    }
    return ethers.utils.parseEther(amount.toString()); // Usando ethers.utils para acessar parseEther
  };

  // Processamento do pagamento com MetaMask
  const handlePayment = async () => {
    if (!account) {
      setStatus("Por favor, conecte sua MetaMask primeiro.");
      return;
    }
  
    const provider = new Web3Provider(window.ethereum);
    const signer = provider.getSigner();
  
    try {
      // Garantir que amount seja um número válido e o valor correto
      const amountInEther = getAmountInEther(amount);
  
      // Substitua com o endereço correto
      const receiverAddress = "0x275f2284a61ed15dc8a447b50034143e7d855492";  // Substitua por um endereço real de recebimento
  
      const tx = await signer.sendTransaction({
        to: receiverAddress,  // Coloque aqui o endereço real de quem vai receber
        value: amountInEther,
      });
  
      await tx.wait();  // Espera a confirmação da transação
  
      // Envia o hash da transação para o backend para registrar o pagamento
      const res = await axios.post("/api/metamask", {
        txHash: tx.hash,
        userId,
        amount,
      });
  
      if (res.data.success) {
        setStatus("Pagamento realizado com sucesso!");
      } else {
        setStatus("Erro ao registrar pagamento.");
      }
    } catch (error) {
      console.error("Erro na transação:", error);
      setStatus("Erro ao realizar pagamento.");
    }
  };
  

  return (
    <div className="p-2 text-sm">
      <h2></h2>
      {account ? (
        <p>Conectado como: {account}</p>
      ) : (
        <button onClick={connectMetaMask} disabled={isConnecting} className="flex items-center gap-2">
          {isConnecting ? (
            <span>Conectando...</span>
          ) : (
            <>
              <GlobeLockIcon className="w-4 h-4 text-green-400" />
              Conectar MetaMask
            </>
          )}
        </button> // Desabilita o botão enquanto conecta
      )}

      <div className="mt-4">
        <button onClick={handlePayment} style={{ display: "flex", alignItems: "center" }} className="flex items-center gap-2">
          <Image
            src="/metamask-logo.png" // Caminho para a imagem do MetaMask na pasta public
            alt="MetaMask Logo"
            width={20}  // Ajuste o tamanho da imagem conforme necessário
            height={20}
            style={{ marginRight: "10px" }} // Adiciona margem à direita da imagem
          />
          Pagar com Crypto
        </button>
      </div>

      <p>{status}</p>
    </div>
  );
};

export default PaymentWithMetaMask;
*/