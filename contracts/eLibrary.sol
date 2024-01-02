// SPDX-License-Identifier: MIT

pragma solidity 0.8.18;

contract eLibrary {

    struct User {
        address userId; // ovo cu koristiti za mapiranj usera
        string name;
        string surname;
        uint phoneNumber;
        string email;
    }

    struct Book {
        uint ISBN;
        string title;
        string author;
    }

    address private librarian;
    uint private membershipCost;
    bool private userCheck;
    bool private bookAvailable;
    uint private discountPoints = 0;

    event BookBorrowed (address member, uint isbn, string message);
    event logReturnedBook(uint _isbn, address memberAddress);

    constructor(){  //definisala sam librariana i stavila da je on message sender
        librarian = msg.sender;  
    }
    
    mapping(address => User) private libraryUsers;
    mapping(address => Book[]) private borrowedBooks; //svaki user ima svoj array of borrowed books
    mapping(uint => Book) private booksInLibrary; //Kada user treba da podigne knjigu, prvo treba provjeriti da li ima u library, pa ako ima onda ta knjiga ide u borrowed book mapping

    modifier isLibrarian (){  //modifier for libraryan access
        require(msg.sender == librarian, "Librarian access required!");
        _;
    }
    
    modifier isBookAvailable(uint _isbn){
         require(booksInLibrary[_isbn].ISBN == _isbn, "Book is not available in library");
         _;
    }

    modifier isBookNotAvailable(uint _isbn){
        bookAvailable = false;
        if(booksInLibrary[_isbn].ISBN == _isbn){
            bookAvailable = true;
        }

        require(bookAvailable == false, "Book already exist in library!");
        _;
    }

    modifier isEnougMoney(){ //Checking if there is enough money on account before paying membership susbscription
        require(msg.value == membershipCost, "You have not enough money on your account!");
        _;
    }


}