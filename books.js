
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

