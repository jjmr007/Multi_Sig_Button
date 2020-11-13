# Multi_Sig_Button
Interface to a MultiSigWallet

## Requirements

* `node v13.x.x`
* Nifty or Metamask wallets
* Chrome or Firefox (failing to show the front end on Brave browser)


## How To Use

1. run `> npm install`
2. `>npm run dev`
3. Open the URL: http://localhost:3000/
4. Change network to RSK or testnet-RSK
5. Contract MultiSigWallet is only deployed on testnet
  - Find the details of the contract on `build/contracts` folder
6. Only change on the contract: constructor function name was replaced by `constructor()`

Still working on callback details
