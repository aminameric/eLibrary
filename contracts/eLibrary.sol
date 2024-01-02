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



}