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
        string image;
    }

    address private  librarian1;
    address private  librarian2;
    address private eLibraryAddr;
    uint private membershipCost;
    uint private nextISBN;

    mapping(address => User) private users;
    mapping(uint => Book) private books;

    constructor() {
        librarian1 = msg.sender;
        librarian2 = 0x1f84f0D7d7bEC502a7A3e6Cfb725A000b711B329;
        eLibraryAddr = 0x5B82812d2A15c8a6a4FCb43658E876D73fcc1b7D;
        nextISBN = 1;
        membershipCost = 500000;
    }

    event payedMembership(string, string);

    modifier isLibrarian {
        require(msg.sender == librarian1 || msg.sender == librarian2, "Librarian access required!");
        _;
    }



    modifier isUser(string memory _name, string memory _surname, uint _phoneNumber, string memory _email) {
        require(msg.value == membershipCost, "Not enough resources");
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
        _;
    }

    function payingMembership(string memory _name, string memory _surname, uint _phoneNumber, string memory _email) external payable isUser(_name, _surname, _phoneNumber, _email) {
        (bool payment,) = eLibraryAddr.call{value: msg.value}("");
        require(payment, "Failed to pay the membership subscription!");

        emit payedMembership(_name, _surname);
    }

    function addBook(string memory _title, string memory _author, string memory _image) external isLibrarian {
        books[nextISBN] = Book({
            ISBN: nextISBN,
            title: _title,
            author: _author,
            image: _image
        });
        nextISBN++;
    }

    function brrowBook(uint _isbn) external {
        users[msg.sender].borrowedBooks.push(_isbn);
    }

    function returnBook(uint _isbn) external {
        for(uint i = 0; i < users[msg.sender].borrowedBooks.length; i++) {
            if(users[msg.sender].borrowedBooks[i] == _isbn) {
                delete users[msg.sender].borrowedBooks[i];
            }
        }
    }

    function removeBook(uint _isbn) external isLibrarian {
        delete books[_isbn];
    }

    function removeMember (address _userAddress) external isLibrarian {
        delete users[_userAddress];
    }

    function getAllBooks() external view returns(Book[] memory) {
        Book[] memory _books = new Book[](nextISBN);
        for(uint i = 0; i < nextISBN; i++) {
            _books[i] = books[i];
        }
        return _books;
    }

    function getMyBooks() external view returns(uint[] memory) {
        return users[msg.sender].borrowedBooks;
    }

    function getUser() external view returns(User memory) {
        return users[msg.sender];
    }
}
