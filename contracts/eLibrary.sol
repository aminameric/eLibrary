

    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    function addBook(string memory _title, string memory _author) external isLibrarian {
        books[nextISBN] = Book({
            ISBN: nextISBN,
            title: _title,
            author: _author
        });
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
}
