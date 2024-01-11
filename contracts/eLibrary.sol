// SPDX-License-Identifier: MIT
pragma solidity 0.8.18;

contract eLibrary {
    struct User {
        address addr;
        string name;
        string surname;
        uint phoneNumber;
        string email;
        bool subscribed;
        uint[] borrowedBooks;
    }

    struct Book {
        uint ISBN;
        string title;
        string author;
    }

    address private  librarian1;
    address private  librarian2;
    uint private membershipCost;
    uint private nextISBN;

    mapping(address => User) private users;
    mapping(uint => Book) private books;

    constructor() {
        librarian1 = msg.sender;
        librarian2 = 0x1f84f0D7d7bEC502a7A3e6Cfb725A000b711B329;
        nextISBN = 0;
        membershipCost = 500000;
    }

    event payedMembership(string, string);

    modifier isLibrarian {
        require(msg.sender == librarian1 || msg.sender == librarian2, "Librarian access required!");
        _;
    }

    modifier isUser(string memory _name, string memory _surname, uint _phoneNumber, string memory _email) {
        _;
        if(msg.sender != users[msg.sender].addr) {
            users[msg.sender] = User({
                addr: msg.sender,
                name: _name,
                surname: _surname,
                phoneNumber: _phoneNumber,
                email: _email,
                subscribed: true,
                borrowedBooks: new uint[](0)
            });
        } else {
            users[msg.sender].subscribed = true;
        }
    }

    function payingMembership(string memory _name, string memory _surname, uint _phoneNumber, string memory _email) external payable isUser(_name, _surname, _phoneNumber, _email) {
        require(msg.value == membershipCost, "Not enough resources");
        (bool payment,) = librarian1.call{value: msg.value}("");
        require(payment, "Failed to pay the membership subscription!");

        emit payedMembership(_name, _surname);
    }