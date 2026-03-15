import { ethers } from 'ethers';
import { userService } from './userService';
import { generateToken, generateRefreshToken } from '../middleware/auth';
import { AuthResponse } from '../types';
import logger from '../utils/logger';

export class AuthService {
  async verifySignature(
    walletAddress: string,
    message: string,
    signature: string
  ): Promise<boolean> {
    try {
      // Recover address from signature
      const recoveredAddress = ethers.verifyMessage(message, signature);

      // Compare with provided address
      const isValid = recoveredAddress.toLowerCase() === walletAddress.toLowerCase();

      if (!isValid) {
        logger.warn(`Invalid signature for wallet: ${walletAddress}`);
      }

      return isValid;
    } catch (error) {
      logger.error('Error verifying signature:', error);
      return false;
    }
  }

  async authenticate(
    walletAddress: string,
    message: string,
    signature: string
  ): Promise<AuthResponse> {
    try {
      // Verify signature
      const isValid = await this.verifySignature(walletAddress, message, signature);

      if (!isValid) {
        throw new Error('Invalid signature');
      }

      // Get or create user
      const user = await userService.getOrCreateUser(walletAddress);

      // Generate tokens
      const token = generateToken(user.id, user.walletAddress);
      const refreshToken = generateRefreshToken(user.id, user.walletAddress);

      logger.info(`User authenticated: ${user.id}`);

      return {
        token,
        refreshToken,
        user,
      };
    } catch (error) {
      logger.error('Error authenticating user:', error);
      throw error;
    }
  }

  async validateWalletAddress(address: string): Promise<boolean> {
    try {
      return ethers.isAddress(address);
    } catch (error) {
      logger.error('Error validating wallet address:', error);
      return false;
    }
  }

  async validateMessage(message: string): Promise<boolean> {
    try {
      // Check if message is not empty and not too long
      return message.length > 0 && message.length < 1000;
    } catch (error) {
      logger.error('Error validating message:', error);
      return false;
    }
  }

  async validateSignature(signature: string): Promise<boolean> {
    try {
      // Check if signature is valid hex string
      return /^0x[0-9a-fA-F]{130}$/.test(signature);
    } catch (error) {
      logger.error('Error validating signature:', error);
      return false;
    }
  }
}

export const authService = new AuthService();
