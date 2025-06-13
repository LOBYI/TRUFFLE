// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./Fruit.sol";

contract Buyer {
    address payable public owner;
    uint256 public money;
    uint256 public bought;
    Fruit public fruit;

    constructor(address payable fruitAddress) payable {
        owner = payable(msg.sender);
        money = msg.value;
        bought = 0;
        fruit = Fruit(fruitAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function buy(uint256 quantityToBuy) public onlyOwner payable {
        uint256 totalPrice = fruit.read_price() * quantityToBuy;
        require(money >= totalPrice, "Not enough Ether");

        // 이더 전송
        (bool success, ) = address(fruit).call{value: totalPrice}("");
        require(success, "Send failed");

        fruit.decrease_quantity(quantityToBuy);

        money -= totalPrice;
        bought += quantityToBuy;
    }

    function read_money() public view returns (uint256) {
        return money;
    }

    function read_bought() public view returns (uint256) {
        return bought;
    }

    // Receive Ether and update money
    receive() external payable {
        money += msg.value;
    }

    fallback() external payable {
        money += msg.value;
    }

}
