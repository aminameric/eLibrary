
const address = "0x0182F0A127F0fB5C2Ed773e08cC2A23a4dB7cd2B";
const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"","type":"string"},{"indexed":false,"internalType":"string","name":"","type":"string"}],"name":"payedMembership","type":"event"},{"inputs":[{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_author","type":"string"},{"internalType":"string","name":"_image","type":"string"}],"name":"addBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"brrowBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllBooks","outputs":[{"components":[{"internalType":"uint256","name":"ISBN","type":"uint256"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"author","type":"string"},{"internalType":"string","name":"image","type":"string"}],"internalType":"struct eLibrary.Book[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMyBooks","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUser","outputs":[{"components":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"surname","type":"string"},{"internalType":"uint256","name":"phoneNumber","type":"uint256"},{"internalType":"string","name":"email","type":"string"},{"internalType":"bool","name":"subscribed","type":"bool"},{"internalType":"uint256[]","name":"borrowedBooks","type":"uint256[]"}],"internalType":"struct eLibrary.User","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_surname","type":"string"},{"internalType":"uint256","name":"_phoneNumber","type":"uint256"},{"internalType":"string","name":"_email","type":"string"}],"name":"payingMembership","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"removeBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"removeMember","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"returnBook","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const LibrarianAddress = "0xdd3738de85d39288b9bf83910430f0d7431665e1";

$(document).ready(async function() {
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
    window.web3 = new Web3(window.ethereum);

    getAllBooks()
    getUser()

    console.log(addresses)

    $("#addBook").click(function() {
        $("#addBookForm").show()
    })
    $("#addBookBtn").click(function() {
        addBook($("#book-title").val(), $("#book-author").val(), $("#book-image").val())
    })
    $("#payMembership").click(function() {
        $("#payMembershipForm").show()
    })
    $("#pay-mbr").click(function() {
        payMembership($("#name").val(), $("#surname").val(), $("#phonenumber").val(), $("#email").val())
    })
    $("#borrow-book").click(function() {
        borrowBook
    })
    $("#addBookBtn").click(function(){
        $("#addBookForm").hide()
    })
    $("#pay-mbr").click(function(){
        $("#payMembershipForm").hide()
    })

    eventListener();
    
})

async function payMembership(name, surname, phoneNumber, email) {
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });

        const result = await contract.methods.payingMembership(name, surname, phoneNumber, email).send({ from: addresses[0], value: 500000 });
        console.log(result);
}

async function eventListener () {

    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });

    contract.events.payedMembership().on('data', function (event) {

        const name = event.returnValues[0];
        const surname = event.returnValues[1];

        // Create a success message element
        const successMessage = document.createElement('div');
        successMessage.textContent = `Membership payment successful for ${name} ${surname}!`;
        successMessage.classList.add('success-message');

        // Append the success message element to the body
        document.body.appendChild(successMessage);

        // Hide the success message after a few seconds (adjust as needed)
        setTimeout(function () {
            successMessage.remove();
        }, 10000); // 5 seconds
      	
   })

}

async function addBook(title, author, image) {
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });

    contract.methods.addBook(title, author, image).send({ from: addresses[0] }).then(function (result) {	
        console.log(result);
    })
}

async function getAllBooks() {
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
    let books = await contract.methods.getAllBooks().call();
    let myBooks = await contract.methods.getMyBooks().call({from: addresses[0]});
    console.log(books)
    console.log(myBooks)

    html = ""
    
    for(let i = 1; i < books.length; i++) {
        if(books[i].ISBN == 0) {
            continue
        }
        let isBorrowed = myBooks.includes(books[i].ISBN)
        html += `
            <div class="book">
                <img src="${books[i].image}"/>
                <div class="right">
                    <p class="book-title">${books[i].title}</p>
                    <p class="book-author">${books[i].author}</p>
                    ${isBorrowed ? `<button onclick="returnBook(${books[i].ISBN})" type="button" id="return-book" class="btn btn-danger">Return</button>` : `<button onclick="borrowBook(${books[i].ISBN})" type="button" id="borrow-book" class="btn btn-success">Borrow</button>`}
                    ${addresses[0] == LibrarianAddress ? `<button onClick="removeBook(${books[i].ISBN})"  type="button" id="remove-book" class="btn btn-danger">Remove book</button>` : ''}
                </div>
            </div>
        `
    }

    $(".books").html(html)
}

async function getUser() {
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });
    let user = await contract.methods.getUser().call({from: addresses[0]});
    console.log(user)
}

async function borrowBook(bookId) {
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });

    contract.methods.brrowBook(bookId).send({ from: addresses[0] }).then(function (result) {	
        console.log(result);
    })
}

async function returnBook(bookId) {
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });

    contract.methods.returnBook(bookId).send({ from: addresses[0] }).then(function (result) {	
        console.log(result);
    })
}

async function removeBook(bookId){
    const contract = new web3.eth.Contract(abi, address);
    let addresses = await window.ethereum.request({ method: 'eth_requestAccounts' });

    contract.methods.removeBook(bookId).send({ from: addresses[0] }).then(function (result) {	
        console.log(result);
    })
}



