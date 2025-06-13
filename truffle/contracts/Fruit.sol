// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

contract Fruit {
    address payable public owner;
    uint256 price;
    uint256 quantity;
    uint256 budget;

    constructor(uint256 _quantity) payable {
        owner = payable(msg.sender);
        price = 0.00001 ether;
        quantity = _quantity;
        budget = 0 ether;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    function read_price() public view returns (uint256) {
        return price;
    }

    function write_price(uint256 newValue) public onlyOwner {
        price = newValue;
    }

    function read_quantity() public view returns (uint256) {
        return quantity;
    }

    function write_quantity(uint256 newValue) public onlyOwner {
        quantity = newValue;
    }

    function read_budget() public view returns (uint256) {
        return budget;
    }

    function decrease_quantity(uint256 amount) public  {
        require(quantity >= amount, "Not enough fruit in stock");
        quantity -= amount;
    }

    receive() external payable {
      budget += msg.value;
    }

    fallback() external payable {
      budget += msg.value;
    }
}
