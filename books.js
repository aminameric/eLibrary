
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

            //Fetch and display the updated membership cost
            const membershipCost = await eLibraryContract.methods.getMembershipCost().call();
            $('#membershipCost').text(`Membership Cost: ${web3.utils.fromWei(membershipCost, 'ether')} ETH`);

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


const openMembershipFormButton = document.getElementById('openMembershipFormButton');
    const membershipForm = document.getElementById('membershipForm');

// Add a click event listener to the button
openMembershipFormButton.addEventListener('click', function () {
    // Toggle the display of the membership form
    membershipForm.style.display = membershipForm.style.display === 'none' ? 'block' : 'none';
});

async function payMembership(name, surname, phoneNumber, email, amount) {
    try {
        // Connect to MetaMask or another Ethereum wallet
        if (window.ethereum) {
            window.web3 = new Web3(ethereum);
            // Request account access
            await ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            const userAddress = accounts[0];

            // Your contract address (replace with your actual value)
            const contractAddress = '6306Fa39A73947282bc8e225e5F7Fbc04aBA627F';
            const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"member","type":"address"},{"indexed":false,"internalType":"uint256","name":"isbn","type":"uint256"}],"name":"BookBorrowed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_isbn","type":"uint256"},{"indexed":false,"internalType":"address","name":"memberAddress","type":"address"}],"name":"logReturnedBook","type":"event"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"},{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_author","type":"string"}],"name":"addBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"borrowBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_surname","type":"string"},{"internalType":"uint256","name":"_phoneNumber","type":"uint256"},{"internalType":"string","name":"_email","type":"string"}],"name":"payingMembership","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"removeBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"removeMember","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"returnBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_cost","type":"uint256"}],"name":"setMembershipCost","outputs":[],"stateMutability":"nonpayable","type":"function"}]

            const contract = new web3.eth.Contract(contractABI, contractAddress);

            // Proceed with the payment and add the user
            const result = await contract.methods.payingMembership(name, surname, phoneNumber, email)
                .send({ from: userAddress, value: web3.utils.toWei(amount, 'ether') });

            // Handle the result as needed
            console.log('Membership payment successful:', result);

        } else {
            console.error('MetaMask is not installed. Please install it to proceed.');
        }
    } catch (error) {
        console.error('Failed to pay membership:', error);
        // Handle the error as needed
        throw error;
    }
}



document.addEventListener('DOMContentLoaded', async function () {
    try {
        // Request account access
        await ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await ethereum.request({ method: 'eth_accounts' });
        const userAddress = accounts[0];

        // Your contract address (replace with your actual value)
        const contractAddress = '6306Fa39A73947282bc8e225e5F7Fbc04aBA627F';
        const contractABI = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"member","type":"address"},{"indexed":false,"internalType":"uint256","name":"isbn","type":"uint256"}],"name":"BookBorrowed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"_isbn","type":"uint256"},{"indexed":false,"internalType":"address","name":"memberAddress","type":"address"}],"name":"logReturnedBook","type":"event"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"},{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_author","type":"string"}],"name":"addBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"borrowBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_surname","type":"string"},{"internalType":"uint256","name":"_phoneNumber","type":"uint256"},{"internalType":"string","name":"_email","type":"string"}],"name":"payingMembership","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"removeBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_addr","type":"address"}],"name":"removeMember","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_isbn","type":"uint256"}],"name":"returnBook","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_cost","type":"uint256"}],"name":"setMembershipCost","outputs":[],"stateMutability":"nonpayable","type":"function"}];  // Replace with your actual ABI

        const contract = new web3.eth.Contract(contractABI, contractAddress);

        // Add click event listener to the "Pay Membership" button
        document.getElementById('payMembershipButton').addEventListener('click', async () => {
            try {
                // Get user inputs (name, surname, phoneNumber, email, amount)
                const name = document.getElementById('name').value;
                const surname = document.getElementById('surname').value;
                const phoneNumber = document.getElementById('phoneNumber').value;
                const email = document.getElementById('email').value;
                const amount = document.getElementById('amount').value;

                // Call the payingMembership function
                await contract.methods.payingMembership(name, surname, phoneNumber, email)
                    .send({ from: userAddress, value: web3.utils.toWei(amount, 'ether') });

                console.log('Membership payment successful.');
            } catch (error) {
                console.error('Failed to pay membership:', error.message);
                // Handle the error as needed
            }
        });

    } catch (error) {
        console.error('Error in DOMContentLoaded event:', error);
    }
});
