const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"string","name":"","type":"string"},{"indexed":false,"internalType":"string","name":"","type":"string"}],"name":"payedMembership","type":"event"},{"inputs":[{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_author","type":"string"},{"internalType":"string","name":"_image","type":"string"}],"name":"addBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"brrowBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"getAllBooks","outputs":[{"components":[{"internalType":"uint256","name":"ISBN","type":"uint256"},{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"author","type":"string"},{"internalType":"string","name":"image","type":"string"}],"internalType":"struct eLibrary.Book[]","name":"","type":"tuple[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getMyBooks","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getUser","outputs":[{"components":[{"internalType":"address","name":"addr","type":"address"},{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"surname","type":"string"},{"internalType":"uint256","name":"phoneNumber","type":"uint256"},{"internalType":"string","name":"email","type":"string"},{"internalType":"bool","name":"subscribed","type":"bool"},{"internalType":"uint256[]","name":"borrowedBooks","type":"uint256[]"}],"internalType":"struct eLibrary.User","name":"","type":"tuple"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_surname","type":"string"},{"internalType":"uint256","name":"_phoneNumber","type":"uint256"},{"internalType":"string","name":"_email","type":"string"}],"name":"payingMembership","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"removeBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_userAddress","type":"address"}],"name":"removeMember","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"returnBook","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const address = "0x0182F0A127F0fB5C2Ed773e08cC2A23a4dB7cd2B"


$('#connect').click(async function () {
    try {
        if (window.ethereum) {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            window.web3 = new Web3(window.ethereum);

            const connectedAddress = window.ethereum.selectedAddress;
            console.log('Connected to MetaMask');

            // Hide the connect button
            $('#connect').hide();
            // Show the connected address
            $('#connectedAddress').css('display', 'block');
            $('#connectedAddress > span').html(connectedAddress);

            window.location.href = 'books.html';

            /*if (isAdmin(connectedAddress)) {
                // Display admin content
                console.log('Librarian logged in');
                $('#adminContent').show();
            } else {
                // Display user content
                console.log('Member logged in');
                $('#userContent').show();
            }*/
        }
    } catch (error) {
        console.error('Error during connection:', error.message);
    }
});