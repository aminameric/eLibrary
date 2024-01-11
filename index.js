const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"member","type":"address"},{"indexed":false,"internalType":"uint256","name":"isbn","type":"uint256"}],"name":"BookBorrowed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_isbn","type":"uint256"},{"indexed":false,"internalType":"address","name":"memberAddress","type":"address"}],"name":"logReturnedBook","type":"event"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"},{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_author","type":"string"}],"name":"addBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"borrowBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_surname","type":"string"},{"internalType":"uint256","name":"_phoneNumber","type":"uint256"},{"internalType":"string","name":"_email","type":"string"}],"name":"payingMembership","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"removeBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"removeMember","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"returnBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_cost","type":"uint256"}],"name":"setMembershipCost","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const address = "0x6306Fa39A73947282bc8e225e5F7Fbc04aBA627F"

function isAdmin(address) {
    // Replace 'your_admin_address' with the actual admin address
    const adminAddress = '0xdd3738De85d39288b9bf83910430f0D7431665E1';
    return address.toLowerCase() === adminAddress.toLowerCase();
}

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

            if (isAdmin(connectedAddress)) {
                // Display admin content
                console.log('Librarian logged in');
                $('#adminContent').show();
            } else {
                // Display user content
                console.log('Member logged in');
                $('#userContent').show();
            }
        }
    } catch (error) {
        console.error('Error during connection:', error.message);
    }
});

