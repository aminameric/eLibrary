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

    event BookBorrowed (address member, uint isbn);
    event logReturnedBook(uint _isbn, address memberAddress);

    constructor(){  //definisala sam librariana i stavila da je on message sender
        librarian = msg.sender;  
    }
    
    mapping(address => User) private libraryUsers;
    mapping(address => Book[]) private borrowedBooks; //svaki user ima svoj array of borrowed books
    mapping(uint => Book) private booksInLibrary; //Kada user treba da podigne knjigu, prvo treba provjeriti da li ima u library, pa ako ima onda ta knjiga ide u borrowed book mapping
    mapping(address => uint) private discountPoints;

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

    //Modifier for checking if the user is already a member
    modifier isLibraryUser(address _addr){
         require(libraryUsers[_addr].userId == _addr, "User is not in the library");
         _;
    }

    modifier isNotLibraryUser(address _addr){
        userCheck = false;
        if(libraryUsers[_addr].userId == _addr){
            userCheck = true;
        }

        require(userCheck == false, "You are already a member!");
        _;
    }

    //increase points if book is borrowed for the user that has borrowed the book
    modifier increasepoints (address _addr){
        _;
        discountPoints[_addr]+=1;
    }

    //Function for setting membership costs 
    function setMembershipCost(uint _cost) external isLibrarian {

        if(discountPoints[msg.sender] == 5){
            membershipCost = _cost - 1*10**18;  //decreasing for one ether
        }
        else{
            membershipCost = _cost*10**18; //mapping za dicounted cijene sddr->uint 
        }
    }

    //Paying yearly membership subscrition, if user is not in librrayUsers, than he has not payed the membership jet. When he pays to librarian, he gets added to the libraryUsers mapping
    function payingMembership(string memory _name, string memory _surname, uint _phoneNumber, string memory _email) external payable isEnougMoney isNotLibraryUser(msg.sender){
        (bool payment,) = librarian.call{value: msg.value}(""); //vise librarians
        require(payment, "Failed to pay the membership subscription!");
        libraryUsers[msg.sender] = User({
                                        userId: msg.sender,
                                        name: _name,
                                        surname: _surname,
                                        phoneNumber: _phoneNumber,
                                        email: _email                              
        }); //adding user, if payment is true
    }

    
    function removeMember (address _addr) external isLibrarian isLibraryUser(_addr) {
        delete libraryUsers[_addr];
    }

     
    function addBook (uint _isbn, string memory _title, string memory _author) external isLibrarian isBookNotAvailable(_isbn) {
        booksInLibrary[_isbn] = Book({
                                         ISBN: _isbn,
                                         title: _title,
                                         author: _author
        });
    }

    
    function removeBook (uint _isbn) external isLibrarian isBookAvailable(_isbn) {
        delete booksInLibrary[_isbn];
    }

    //function to borrow a book
    function borrowBook (uint _isbn) external isLibraryUser(msg.sender) isBookAvailable(_isbn) increasepoints(msg.sender){

        Book memory book1 = booksInLibrary[_isbn];
       
        //work with temporary variables and then assign the modified array back to storage.

        Book[] storage userBorrowedBooks = borrowedBooks[msg.sender];
        userBorrowedBooks.push(book1);
        borrowedBooks[msg.sender] = userBorrowedBooks;
        delete booksInLibrary[_isbn];

        emit BookBorrowed(msg.sender, _isbn);
    }

    function returnBook(uint _isbn) external isLibraryUser(msg.sender){

         Book[] storage userBorrowedBooks1 = borrowedBooks[msg.sender];
         
         //Checking if there is any book in the aray
         require(userBorrowedBooks1.length > 0, "There is no book to be returned!");

         for (uint i = 0; i < userBorrowedBooks1.length; i++){
            if(userBorrowedBooks1[i].ISBN == _isbn){
                booksInLibrary[_isbn] = userBorrowedBooks1[i];
                delete userBorrowedBooks1[i]; //pitaj
                emit logReturnedBook(_isbn, msg.sender);
            }
         }

    }
}

/*Uint currentYear = (block. timestamp / 31557600) + 1970;
Aldin Kovačević11:22 AM
address => uint[] user => godine*/