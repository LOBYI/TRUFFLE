import React, { useEffect, useState } from "react";
import Web3 from "web3";
import FruitContract from "./contracts/Fruit.json";
import BuyerContract from "./contracts/Buyer.json";
import Comment from "./components/PostList";

import {
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
  Box
} from "@mui/material";

function App() {
  const [web3, setWeb3] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [fruit, setFruit] = useState(null);
  const [buyer, setBuyer] = useState(null);

  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [money, setMoney] = useState(0);
  const [bought, setBought] = useState(0);

  const [inputPrice, setInputPrice] = useState("");
  const [inputQuantity, setInputQuantity] = useState("");
  const [buyAmount, setBuyAmount] = useState("");

  const [isOwner, setIsOwner] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");


  const [board, setBoard] = useState(null); // ← 상태 선언
  const [posts, setPosts] = useState([]);   // ← 상태 선언

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        try {
          const web3 = new Web3(window.ethereum);
          await window.ethereum.request({ method: "eth_requestAccounts" });
          const accounts = await web3.eth.getAccounts();
          const networkId = await web3.eth.net.getId();

          // Load Fruit contract
          const deployedFruit = FruitContract.networks[networkId];
          const fruitInstance = new web3.eth.Contract(
            FruitContract.abi,
            deployedFruit.address
          );

          // Load Buyer contract
          const deployedBuyer = BuyerContract.networks[networkId];
          const buyerInstance = new web3.eth.Contract(
            BuyerContract.abi,
            deployedBuyer.address
          );

          // Fetch initial values
          const price = await fruitInstance.methods.read_price().call();
          const quantity = await fruitInstance.methods.read_quantity().call();
          const money = await buyerInstance.methods.read_money().call();
          const bought = await buyerInstance.methods.read_bought().call();
          const owner = await fruitInstance.methods.owner().call();
          setIsOwner(owner.toLowerCase() === accounts[0].toLowerCase());

          // const boardInstance = new web3.eth.Contract(
          //   Comment.abi,
          //   Comment.networks[netId].address
          // );


          setWeb3(web3);
          setAccounts(accounts);
          setFruit(fruitInstance);
          setBuyer(buyerInstance);
          setPrice(price);
          setQuantity(quantity);
          setMoney(money);
          setBought(bought);
          // console.log("Buyer Money:", money);
          // console.log("Buyer Bought:", bought);
          // console.log("Current MetaMask account:", accounts[0]);
          // console.log("Fruit owner:", owner);
        } catch (err) {
          console.error("Failed to load blockchain data:", err);
        }
      } else {
        alert("Please install MetaMask!");
      }
    };

    init();
  }, []);

  const updatePrice = async () => {
    if (fruit && accounts.length > 0 && inputPrice) {
      await fruit.methods
        .write_price(Number(inputPrice))
        .send({ from: accounts[0] });

      const newPrice = await fruit.methods.read_price().call();
      setPrice(newPrice);
      setInputPrice("");
    }
  };

  const updateQuantity = async () => {
    if (fruit && accounts.length > 0 && inputQuantity) {
      await fruit.methods
        .write_quantity(Number(inputQuantity))
        .send({ from: accounts[0] });

      const newQuantity = await fruit.methods.read_quantity().call();
      setQuantity(newQuantity);
      setInputQuantity("");
    }
  };

  const handleBuy = async () => {
    if (buyer && accounts.length > 0 && buyAmount) {
      try {
        await buyer.methods
          .buy(Number(buyAmount))
          .send({ from: accounts[0] });

        // Update states after purchase
        const newMoney = await buyer.methods.read_money().call();
        const newBought = await buyer.methods.read_bought().call();
        const newQuantity = await fruit.methods.read_quantity().call();

        setMoney(newMoney);
        setBought(newBought);
        setQuantity(newQuantity);
        setBuyAmount("");
      } catch (err) {
        alert("Purchase failed: " + err.message);
      }
    }
  };

  const handleDeposit = async () => {
    if (web3 && accounts.length > 0 && depositAmount) {
      try {
        await web3.eth.sendTransaction({
          from: accounts[1],
          to: buyer.options.address,
          value: web3.utils.toWei(depositAmount, "ether"),
        });

        const newMoney = await buyer.methods.read_money().call();
        setMoney(newMoney);
        setDepositAmount("");
      } catch (err) {
        alert("Deposit failed: " + err.message);
      }
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>Fruit Contract</Typography>
        <Typography>Price: {price / 1e18} ETH</Typography>
        <Typography>Quantity: {quantity}</Typography>

        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              fullWidth
              label="New Price (wei)"
              value={inputPrice}
              onChange={(e) => setInputPrice(e.target.value)}
              type="number"
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={() => {
                if (!isOwner) {
                  alert("Only owner can change the price!");
                  return;
                }
                updatePrice();
              }}
              sx={{ height: "100%" }}
            >
              Change Price
            </Button>
          </Grid>

          <Grid item xs={6}>
            <TextField
              fullWidth
              label="New Quantity"
              value={inputQuantity}
              onChange={(e) => setInputQuantity(e.target.value)}
              type="number"
            />
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              onClick={() => {
                if (!isOwner) {
                  alert("Only owner can change the quantity!");
                  return;
                }
                updateQuantity();
              }}
              sx={{ height: "100%" }}
            >
              Change Quantity
            </Button>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h5" gutterBottom>Buyer Info</Typography>
        <Typography>Money: {money / 1e18} ETH</Typography>
        <Typography>Bought: {bought}</Typography>

        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Amount to Buy"
            value={buyAmount}
            onChange={(e) => setBuyAmount(e.target.value)}
            type="number"
          />
          <Button
            variant="outlined"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleBuy}
          >
            Buy
          </Button>
        </Box>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="h6">Deposit to Buyer Contract</Typography>
          <TextField
            type="number"
            label="ETH to deposit"
            variant="outlined"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            sx={{ mr: 2, width: "200px" }}
          />
          <Button variant="contained" color="primary" onClick={handleDeposit}>
            Deposit
          </Button>
        </Box>
      </Paper>
    </Container>  
  );
}

export default App;
