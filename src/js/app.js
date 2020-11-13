App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',
  loading: false,
  contractInstance: null,
  msg: 0,
  signature: '0x0',

  init: () => {
    return App.initWeb3();
  },

  // Addresses Metamask breaking changes
  // https://medium.com/metamask/https-medium-com-metamask-breaking-change-injecting-web3-7722797916a8
  initWeb3: async () => {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      window.alert("Please connect to Nifty/Metamask.")
    }
    // Modern dapp browsers...
    if (window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        // Request user for permission
        await ethereum.enable();
        // user approved permission
      } catch (error) {
        // User denied account access...
        console.log('user rejected permission');
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
      // Acccounts always exposed
    }
    // Non-dapp browsers...
    else {
      console.log('Non-Ethereum browser detected. You should consider trying Nifty or MetaMask!');
    }
    return App.initContracts();
  },

  initContracts: () => {
    $.getJSON("MultiSigWallet.json", (contract) => {
      console.log('contract', contract)
      App.contracts.Verification = TruffleContract(contract);
      App.contracts.Verification.setProvider(App.web3Provider);
      return App.render();
    });
  },

  render: () => {
    if (App.loading) {
      return;
    }

    App.loading = true;

    let loader = $("#loader");
    let content = $("#content");

    loader.show();
    content.hide();

    // Load blockchain data
    // web3.eth.accounts has been depreciated
    // https://web3js.readthedocs.io/en/v1.3.0/web3-eth.html#getaccounts
    web3.eth.getAccounts((err, accounts)=>{
      if(err != null) {
        alert("Error getting accounts.");
        return;
      }
      if (accounts.length == 0) {
        alert("No account found! Make sure the Ethereum client is configured properly.");
        return;
      }
      console.log(accounts);
      App.account = accounts[0];
      console.log("Your Account:", App.account);
    })

    App.contracts.Verification.deployed().then((contract) => {
      App.contractInstance = contract;
      console.log("ContractInstance", App.contractInstance)
      console.log("Contract Address:", App.contractInstance.address);
      return true
    }).then((val) => {
      $('#account').html(App.account);
      loader.hide();
      content.show();
    });
  },

  signMessage: () => {
    $("#content").hide();
    $("#loader").show();

    const message = $('#message').val();
    console.log('Transaction Id', message);
    App.msg = message;
    App.contractInstance.confirmTransaction(App.msg).send({from: App.account}).then(function(tx) {
    console.log("Transaction: ", tx);
    $('form').trigger('reset');
    $('#msg').html('Transaction Id number:' + ' ' + message);
    App.signature = tx;
    $('#signature').html('transaction confirmation:' + ' ' + tx);
    $("#content").show();
    $("#loader").hide();
  });
  $("#newInfo").val('');
}
 
};

$(() => {
  $(window).load(() => {
    App.init();
  });
});
