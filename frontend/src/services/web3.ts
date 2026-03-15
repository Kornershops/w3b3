import { ethers } from 'ethers';

class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;

  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);

      this.provider = provider;
      this.signer = await provider.getSigner();

      return accounts[0];
    } catch (error) {
      throw new Error('Failed to connect wallet');
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    return await this.signer.signMessage(message);
  }

  async getChainId(): Promise<number> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const network = await this.provider.getNetwork();
    return Number(network.chainId);
  }

  async switchChain(chainId: number) {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        throw new Error('Chain not added to MetaMask');
      }
      throw error;
    }
  }

  async getBalance(address: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const balance = await this.provider.getBalance(address);
    return ethers.formatEther(balance);
  }

  async getTokenBalance(tokenAddress: string, userAddress: string): Promise<string> {
    if (!this.provider) {
      throw new Error('Provider not initialized');
    }

    const abi = ['function balanceOf(address) view returns (uint256)'];
    const contract = new ethers.Contract(tokenAddress, abi, this.provider);

    const balance = await contract.balanceOf(userAddress);
    return balance.toString();
  }

  async approveToken(tokenAddress: string, spenderAddress: string, amount: string) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const abi = ['function approve(address spender, uint256 amount) returns (bool)'];
    const contract = new ethers.Contract(tokenAddress, abi, this.signer);

    const tx = await contract.approve(spenderAddress, ethers.parseEther(amount));
    return await tx.wait();
  }

  async stakeTokens(
    stakingPoolAddress: string,
    amount: string,
    abi: any[]
  ) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const contract = new ethers.Contract(stakingPoolAddress, abi, this.signer);
    const tx = await contract.stake(ethers.parseEther(amount));
    return await tx.wait();
  }

  async unstakeTokens(
    stakingPoolAddress: string,
    amount: string,
    abi: any[]
  ) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const contract = new ethers.Contract(stakingPoolAddress, abi, this.signer);
    const tx = await contract.withdraw(ethers.parseEther(amount));
    return await tx.wait();
  }

  async claimRewards(
    stakingPoolAddress: string,
    abi: any[]
  ) {
    if (!this.signer) {
      throw new Error('Wallet not connected');
    }

    const contract = new ethers.Contract(stakingPoolAddress, abi, this.signer);
    const tx = await contract.claimReward();
    return await tx.wait();
  }

  isConnected(): boolean {
    return !!this.signer;
  }

  getProvider() {
    return this.provider;
  }

  getSigner() {
    return this.signer;
  }
}

export const web3Service = new Web3Service();
