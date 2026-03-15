# ⚡ W3B3 QUICK LAUNCH GUIDE

**Get the platform running in 7 days!**

---

## 🎯 WEEK 1 ROADMAP

### DAY 1: SETUP (2-3 hours)
```bash
# 1. Install prerequisites
brew install node postgresql redis  # macOS
# or apt-get for Linux

# 2. Clone & install
git clone https://github.com/yourusername/w3b3.git
cd w3b3
npm install

# 3. Setup environment
cp .env.example .env
cp frontend/.env.example frontend/.env.local
cp backend/.env.example backend/.env
cp contracts/.env.example contracts/.env

# 4. Get API keys
# - Alchemy: https://www.alchemy.com/
# - WalletConnect: https://cloud.walletconnect.com/
# - Etherscan: https://etherscan.io/apis
```

---

### DAY 2: DATABASE & BACKEND (3-4 hours)
```bash
# 1. Start services
brew services start postgresql
brew services start redis

# 2. Create database
psql -U postgres
CREATE DATABASE w3b3;
\q

# 3. Setup backend
cd backend
npx prisma migrate dev --name init
npx prisma db seed
npm run dev

# Backend should be running on http://localhost:3001
```

---

### DAY 3: FRONTEND (2-3 hours)
```bash
# 1. Start frontend
cd frontend
npm run dev

# 2. Test in browser
# - Visit http://localhost:3000
# - Click "Connect Wallet"
# - Approve in MetaMask
# - See wallet connected

# 3. Test features
# - View pools
# - View dashboard
# - Check real-time updates
```

---

### DAY 4: SMART CONTRACTS (2-3 hours)
```bash
# 1. Compile & test
cd contracts
npm run compile
npm run test

# 2. Deploy to testnet
npm run deploy:sepolia

# 3. Verify on Etherscan
# - Copy contract address
# - Go to Etherscan
# - Verify source code
```

---

### DAY 5: INTEGRATION TESTING (3-4 hours)
```bash
# 1. Test complete flow
# - Connect wallet
# - View pools
# - Stake tokens (testnet)
# - View rewards
# - Claim rewards

# 2. Test on different browsers
# - Chrome
# - Firefox
# - Safari

# 3. Test on mobile
# - MetaMask Mobile
# - Phantom Wallet
```

---

### DAY 6: PRODUCTION DEPLOYMENT (4-5 hours)
```bash
# 1. Deploy backend
npm install -g @railway/cli
railway login
cd backend
railway up

# 2. Deploy frontend
npm install -g vercel
cd frontend
vercel

# 3. Deploy contracts to mainnet
cd contracts
npm run deploy:mainnet

# 4. Setup monitoring
# - Sentry for errors
# - LogRocket for frontend
# - Uptime Robot for monitoring
```

---

### DAY 7: LAUNCH & MONITOR (2-3 hours)
```bash
# 1. Final checks
# - Backend responding
# - Frontend loading
# - Wallet connecting
# - Pools displaying
# - Staking working

# 2. Monitor for issues
# - Check Sentry
# - Check LogRocket
# - Check API logs
# - Check database

# 3. Celebrate! 🎉
```

---

## 📋 ESSENTIAL COMMANDS

### Backend
```bash
cd backend
npm run dev              # Start development
npm run build            # Build for production
npm run test             # Run tests
npm run lint             # Check code quality
npx prisma studio       # View database GUI
```

### Frontend
```bash
cd frontend
npm run dev              # Start development
npm run build            # Build for production
npm run test             # Run tests
npm run lint             # Check code quality
```

### Smart Contracts
```bash
cd contracts
npm run compile          # Compile contracts
npm run test             # Run tests
npm run deploy:sepolia   # Deploy to testnet
npm run deploy:mainnet   # Deploy to mainnet
```

---

## 🔑 REQUIRED API KEYS

| Service | Purpose | Free Tier | Link |
|---------|---------|-----------|------|
| **Alchemy** | RPC Provider | 300M units/mo | https://www.alchemy.com/ |
| **WalletConnect** | Wallet Connection | Free | https://cloud.walletconnect.com/ |
| **Etherscan** | Contract Verification | Free | https://etherscan.io/apis |
| **Sentry** | Error Tracking | 5K events/mo | https://sentry.io/ |
| **LogRocket** | Frontend Monitoring | Free | https://logrocket.com/ |

---

## 🚀 DEPLOYMENT PLATFORMS

| Component | Platform | Cost | Setup Time |
|-----------|----------|------|------------|
| **Frontend** | Vercel | Free | 5 min |
| **Backend** | Railway | $5/mo | 10 min |
| **Database** | AWS RDS | $15/mo | 15 min |
| **Cache** | Redis Cloud | Free | 5 min |

---

## ✅ LAUNCH CHECKLIST

### Pre-Launch
- [ ] All tests passing
- [ ] No console errors
- [ ] Wallet connection working
- [ ] Pools displaying
- [ ] Staking flow complete
- [ ] Rewards calculating
- [ ] Real-time updates working

### Deployment
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] Contracts deployed
- [ ] Environment variables set
- [ ] Monitoring configured
- [ ] CI/CD working

### Post-Launch
- [ ] Monitor Sentry
- [ ] Monitor LogRocket
- [ ] Check API logs
- [ ] Monitor database
- [ ] Respond to issues
- [ ] Collect user feedback

---

## 🆘 QUICK TROUBLESHOOTING

### Backend won't start
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Check database
psql -U postgres -d w3b3 -c "SELECT 1"

# Check Redis
redis-cli ping
```

### Frontend won't connect
```bash
# Check API URL
echo $NEXT_PUBLIC_API_URL

# Check backend is running
curl http://localhost:3001/health

# Check CORS
# Backend should have CORS_ORIGIN=http://localhost:3000
```

### Contracts won't deploy
```bash
# Check private key
echo $PRIVATE_KEY

# Check account has ETH
# Use faucet to get testnet ETH

# Check network
# Verify correct network in hardhat.config.js
```

---

## 📞 SUPPORT RESOURCES

- **Documentation:** See NEXT_STEPS_TO_LAUNCH.md
- **API Docs:** http://localhost:3001/api-docs
- **GitHub Issues:** Create issue for bugs
- **Discord:** Join community for help

---

## 🎯 SUCCESS METRICS

After launch, track:
- ✅ Users connected: Target 100+ in first week
- ✅ TVL (Total Value Locked): Target $10K+ in first week
- ✅ Transactions: Target 50+ in first week
- ✅ Uptime: Target 99.9%
- ✅ API Response Time: Target <200ms

---

## 🚀 YOU'RE READY!

Everything is set up. Follow the 7-day roadmap above and your platform will be live!

**Start with Day 1 today!**
