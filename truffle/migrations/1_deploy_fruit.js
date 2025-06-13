const Fruit = artifacts.require("Fruit");
const Buyer = artifacts.require("Buyer");

module.exports = async function (deployer, network, accounts) {
  const fruitQuantity = 100;

  // Step 1: Deploy Fruit contract
  await deployer.deploy(Fruit, fruitQuantity, { from: accounts[0] });
  const fruitInstance = await Fruit.deployed();

  // Step 2: Deploy Buyer contract with some Ether
  const etherToSend = web3.utils.toWei("0.0001", "ether"); // adjust as needed
  await deployer.deploy(Buyer, fruitInstance.address, {
    from: accounts[1], // deploy Buyer from a different account (buyer)
    value: etherToSend
  });
};