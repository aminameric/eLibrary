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

    //increase points if book is borrowed
    modifier increasepoints (){
        _;
        discountPoints += 1;
    }

    //Function for setting membership costs 
    function setMembershipCost(uint _cost) external isLibrarian {

        if(discountPoints == 5){
            membershipCost = _cost - 1;  //Ne znamo da kako da stavimo discount (npr smanjili bi cijenu za 1, ali ne znamo kako to ide sa whei ili ether, a ne moze u procentima jer ne podrzava float)
        }
        else{
            membershipCost = _cost*10**18;
        }
    }

    //Paying yearly membership subscrition, if user is not in librrayUsers, than he has not payed the membership jet. When he pays to librarian, he gets added to the libraryUsers mapping
    function payingMembership(string memory _name, string memory _surname, uint _phoneNumber, string memory _email) external payable isEnougMoney isNotLibraryUser(msg.sender){
        (bool payment,) = librarian.call{value: msg.value}("");
        require(payment, "Failed to pay the membership subscription!");
        libraryUsers[msg.sender] = User({
                                        userId: msg.sender,
                                        name: _name,
                                        surname: _surname,
                                        phoneNumber: _phoneNumber,
                                        email: _email                              
        }); //samo ce se izvrsiti dodavanje usera, ako je payment true
    }

    //removing member
    function removeMember (address _addr) external isLibrarian isLibraryUser(_addr) {
        delete libraryUsers[_addr];
    }


}