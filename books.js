
const LibrarianAddress = "0xdd3738De85d39288b9bf83910430f0D7431665E1";

async function isLibrarian(account) {
    try {
        // Hardcoded check for the librarian address
        return account.toLowerCase() === LibrarianAddress.toLowerCase();
    } catch (error) {
        console.error('Error in isLibrarian:', error);
        return false;
    }
}

async function setMembershipCost(newCost, account) {
    try {
        const isAdmin = await isLibrarian(account);

        if (isAdmin) {
            // Convert the cost to wei
            const costInWei = web3.utils.toWei(newCost.toString(), 'ether');

            // Call the setMembershipCost function
            await eLibraryContract.methods.setMembershipCost(costInWei).send({ from: account });

            console.log('Membership cost set successfully.');
        } else {
            console.log('Only the librarian can set the membership cost.');
        }
    } catch (error) {
        console.error('Error in setMembershipCost:', error);
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const web3 = new Web3(window.ethereum);

    // Add click event listener to the "Set Membership Cost" button
    document.getElementById('setMembershipCostButton').addEventListener('click', async () => {
        try {
            const isAdmin = await isLibrarian(accounts[0]);

            if (isAdmin) {
                const newCost = prompt('Enter the new membership cost in ether:');

                if (!newCost || isNaN(newCost)) {
                    console.error('Invalid input. Please enter a valid numeric value for the membership cost.');
                    return;
                }

                await setMembershipCost(newCost, accounts[0]);
            } else {
                console.log('Only the librarian can set the membership cost.');
            }
        } catch (error) {
            console.error('Error in button click event:', error);
        }
    });
});



// Simulated contract address and ABI (replace with your actual contract address and ABI)
const contractAddress = "0x6306Fa39A73947282bc8e225e5F7Fbc04aBA627F";
const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"member","type":"address"},{"indexed":false,"internalType":"uint256","name":"isbn","type":"uint256"}],"name":"BookBorrowed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_isbn","type":"uint256"},{"indexed":false,"internalType":"address","name":"memberAddress","type":"address"}],"name":"logReturnedBook","type":"event"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"},{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_author","type":"string"}],"name":"addBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"borrowBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_surname","type":"string"},{"internalType":"uint256","name":"_phoneNumber","type":"uint256"},{"internalType":"string","name":"_email","type":"string"}],"name":"payingMembership","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"removeBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"removeMember","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"returnBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_cost","type":"uint256"}],"name":"setMembershipCost","outputs":[],"stateMutability":"nonpayable","type":"function"}] // Replace with your actual ABI

// Simulated web3 instance (replace with your actual web3 initialization)
const web3 = new Web3(window.ethereum);

// Simulated contract instance (replace with your actual contract instance)
const yourSmartContract = new web3.eth.Contract(contractABI, contractAddress);

// Define the payingMembership function
async function payingMembership(name, surname, phoneNumber, email, amount) {
    try {
        // Convert the amount to wei
        const amountInWei = web3.utils.toWei(amount, 'ether');

        // Simulated smart contract function call (replace with your actual function call)
        const result = await yourSmartContract.methods
        .payingMembership(name, surname, phoneNumber, email)
        .send({ from: accounts[0], value: amountInWei });


        // Handle the result or emit an event for further processing
        console.log('Paying membership successful:', result);
    } catch (error) {
        console.error('Error in payingMembership:', error);
        throw error; // Rethrow the error for further handling
    }
}

document.getElementById('payMembershipButton').addEventListener('click', async () => {
    let accounts;
    try {
        // Check if MetaMask is available
        if (window.ethereum) {
            // Request accounts from MetaMask
            accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            const name = document.getElementById('name').value;
            const surname = document.getElementById('surname').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const email = document.getElementById('email').value;
            const amount = document.getElementById('amount').value;

            // Call the payingMembership function (replace with your actual logic)
            await payingMembership(name, surname, phoneNumber, email, amount);

            // Assuming payingMembership function updates the user information, you can add the user to the local representation
            const userId = accounts[0]; // Use the accounts obtained from MetaMask
            libraryUsers[userId] = {
                userId,
                name,
                surname,
                phoneNumber,
                email,
            };

            console.log('User added to libraryUsers:', libraryUsers[userId]);
        } else {
            console.error('MetaMask not available');
        }
    } catch (error) {
        console.error('Error in button click event:', error);
    }
});



