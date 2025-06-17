const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EscrowBonus", function () {
    let EscrowBonus;
    let escrowBonus;
    let owner;
    let addr1;
    let addr2;
    let addrs;
    let linkToken; // Placeholder for LINK token contract
    let jobId;
    let fee;

    // Before each test, deploy a new contract
    beforeEach(async function () {
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        // Mock LINK token for testing purposes (replace with actual LINK in deployment)
        const MockLink = await ethers.getContractFactory("LinkToken"); // Assuming LinkToken is available or mocked
        linkToken = await MockLink.deploy();
        await linkToken.deployed();

        jobId = require("hardhat").ethers.utils.formatBytes32String("test_job_id");
        fee = require("hardhat").ethers.utils.parseUnits("0.1", "ether"); // 0.1 LINK

        EscrowBonus = await ethers.getContractFactory("EscrowBonus");
        escrowBonus = await EscrowBonus.deploy(linkToken.address, jobId, fee);
        await escrowBonus.deployed();
    });

    // Test cases will go here
    describe("depositBonus", function () {
        let bonusAmount;
        const githubRepoOwner = "owner";
        const githubRepoName = "repo";
        const githubBranch = "Tank";
        const githubUsername = "dev_user";
        const targetCommits = 50;
        let deadline;

        before(async function() {
            bonusAmount = require("hardhat").ethers.utils.parseEther("1"); // 1 ETH
            deadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days from now
        });

        it("Should allow owner to deposit bonus and set contract details", async function () {
            await expect(escrowBonus.connect(owner).depositBonus(
                addr1.address,
                bonusAmount,
                githubRepoOwner,
                githubRepoName,
                githubBranch,
                githubUsername,
                targetCommits,
                deadline,
                { value: bonusAmount }
            )).to.emit(escrowBonus, "BonusDeposited");

            // Verify contract state
            // Note: The original document uses a filter to get requestId. A more direct way if the event emits requestId is to capture it.
            // For now, sticking to the document's way.
            const filter = escrowBonus.filters.BonusDeposited();
            const events = await escrowBonus.queryFilter(filter);
            const requestId = events[0].args.requestId;

            const contractDetails = await escrowBonus.bonusContracts(requestId);

            expect(contractDetails.recipient).to.equal(addr1.address);
            expect(contractDetails.amount).to.equal(bonusAmount);
            expect(contractDetails.githubRepoOwner).to.equal(githubRepoOwner);
            expect(contractDetails.githubRepoName).to.equal(githubRepoName);
            expect(contractDetails.githubBranch).to.equal(githubBranch);
            expect(contractDetails.githubUsername).to.equal(githubUsername);
            expect(contractDetails.targetCommits).to.equal(targetCommits);
            expect(contractDetails.deadline).to.equal(deadline);
            expect(contractDetails.isPaid).to.be.false;
            expect(contractDetails.isActive).to.be.true;
        });

        it("Should revert if sent ETH does not match bonus amount", async function () {
            await expect(escrowBonus.connect(owner).depositBonus(
                addr1.address,
                bonusAmount,
                githubRepoOwner,
                githubRepoName,
                githubBranch,
                githubUsername,
                targetCommits,
                deadline,
                { value: require("hardhat").ethers.utils.parseEther("0.5") } // Sending less ETH
            )).to.be.revertedWith("Jumlah ETH yang dikirim harus sesuai dengan jumlah bonus.");
        });

        it("Should revert if recipient address is zero", async function () {
            await expect(escrowBonus.connect(owner).depositBonus(
                require("hardhat").ethers.constants.AddressZero,
                bonusAmount,
                githubRepoOwner,
                githubRepoName,
                githubBranch,
                githubUsername,
                targetCommits,
                deadline,
                { value: bonusAmount }
            )).to.be.revertedWith("Alamat penerima tidak valid.");
        });

        // Placeholder for more test cases as mentioned in baby-step.md
        // e.g., it("Should revert if deadline is in the past", async function() { ... });
        // e.g., it("Should revert if targetCommits is zero", async function() { ... });
    });

    describe("fulfill", function () {
        let bonusAmount;
        const githubRepoOwner = "owner";
        const githubRepoName = "repo";
        const githubBranch = "Tank";
        const githubUsername = "dev_user";
        const targetCommits = 50;
        let requestId;
        let depositDeadline; // Use a different name for clarity if needed, or ensure correct scope

        before(async function() {
            bonusAmount = require("hardhat").ethers.utils.parseEther("1");
            // deadline for depositBonus call in beforeEach will be calculated fresh there
        });

        beforeEach(async function () {
            depositDeadline = Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60); // 30 days from now
            // Connect to owner to deposit
            await escrowBonus.connect(owner).depositBonus(
                addr1.address, // recipient
                bonusAmount,
                githubRepoOwner,
                githubRepoName,
                githubBranch,
                githubUsername,
                targetCommits,
                depositDeadline, // Use the deadline calculated in this beforeEach
                { value: bonusAmount }
            );

            // Get requestId from event
            const filter = escrowBonus.filters.BonusDeposited();
            const events = await escrowBonus.queryFilter(filter);
            // Assuming the last deposit is the one we are interested in for this beforeEach
            requestId = events[events.length -1].args.requestId;

            // Fund the LINK token to the contract for Chainlink requests
            // The LINK token is deployed in the main beforeEach, access it via `linkToken`
            await linkToken.connect(owner).transfer(escrowBonus.address, require("hardhat").ethers.utils.parseEther("1")); // Transfer 1 LINK
        });

        it("Should pay bonus if target commits met before deadline", async function () {
            const initialRecipientBalance = await require("hardhat").ethers.provider.getBalance(addr1.address);

            // Simulate Chainlink callback with enough commits by owner
            await expect(escrowBonus.connect(owner).fulfill(requestId, targetCommits + 10)) // +10 commits to ensure target met
                .to.emit(escrowBonus, "ChainlinkFulfilled")
                .withArgs(requestId, targetCommits + 10)
                .and.to.emit(escrowBonus, "BonusPaid")
                .withArgs(requestId, addr1.address, bonusAmount);

            const finalRecipientBalance = await require("hardhat").ethers.provider.getBalance(addr1.address);
            // Using a small delta for gas costs, as in the document
            const delta = require("hardhat").ethers.utils.parseEther("0.001"); // For gas variance
            expect(finalRecipientBalance).to.be.closeTo(initialRecipientBalance.add(bonusAmount), delta);

            const contractDetails = await escrowBonus.bonusContracts(requestId);
            expect(contractDetails.isPaid).to.be.true;
            expect(contractDetails.isActive).to.be.false;
        });

        it("Should not pay bonus if target commits not met before deadline", async function () {
            const initialRecipientBalance = await require("hardhat").ethers.provider.getBalance(addr1.address);

            // Simulate Chainlink callback with insufficient commits
            await expect(escrowBonus.connect(owner).fulfill(requestId, targetCommits - 10)) // -10 commits
                .to.emit(escrowBonus, "ChainlinkFulfilled")
                .withArgs(requestId, targetCommits - 10);
                // Not expecting BonusPaid event

            const finalRecipientBalance = await require("hardhat").ethers.provider.getBalance(addr1.address);
            expect(finalRecipientBalance).to.equal(initialRecipientBalance); // Balance should not change

            const contractDetails = await escrowBonus.bonusContracts(requestId);
            expect(contractDetails.isPaid).to.be.false;
            expect(contractDetails.isActive).to.be.true; // Still active until deadline passes or reclaimed
        });

        it("Should not pay bonus if deadline passed, even if commits met", async function () {
            // Advance time past deadline
            const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
            await require("hardhat").ethers.provider.send("evm_increaseTime", [thirtyDaysInSeconds + 1]); // 30 days + 1 second
            await require("hardhat").ethers.provider.send("evm_mine"); // Mine a new block

            const initialRecipientBalance = await require("hardhat").ethers.provider.getBalance(addr1.address);

            await expect(escrowBonus.connect(owner).fulfill(requestId, targetCommits + 10))
                .to.emit(escrowBonus, "ChainlinkFulfilled")
                .withArgs(requestId, targetCommits + 10);
                // Not expecting BonusPaid event

            const finalRecipientBalance = await require("hardhat").ethers.provider.getBalance(addr1.address);
            expect(finalRecipientBalance).to.equal(initialRecipientBalance); // Balance should not change

            const contractDetails = await escrowBonus.bonusContracts(requestId);
            expect(contractDetails.isPaid).to.be.false;
            // The document expects isActive to be false after deadline.
            // This depends on whether `fulfill` itself changes `isActive` post-deadline or if `reclaimBonus` does.
            // Assuming `fulfill` updates `isActive` if past deadline.
            // If the contract logic is that only reclaimBonus makes it inactive after deadline (and not paid), this assertion might need adjustment
            // based on actual contract behavior. For now, following the document.
            expect(contractDetails.isActive).to.be.false;
        });
    });

    describe("reclaimBonus", function () {
        let bonusAmount;
        const githubRepoOwner = "owner";
        const githubRepoName = "repo";
        const githubBranch = "Tank";
        const githubUsername = "dev_user";
        const targetCommits = 50;
        let requestId;
        const thirtyDaysInSeconds = 30 * 24 * 60 * 60;
        let depositDeadline;

        before(async function() {
            bonusAmount = require("hardhat").ethers.utils.parseEther("1");
        });

        beforeEach(async function () {
            depositDeadline = Math.floor(Date.now() / 1000) + thirtyDaysInSeconds; // 30 days from now
            await escrowBonus.connect(owner).depositBonus(
                addr1.address,
                bonusAmount, // This will be the one from the 'before' hook of this describe block
                githubRepoOwner,
                githubRepoName,
                githubBranch,
                githubUsername,
                targetCommits,
                depositDeadline, // Use the deadline from this beforeEach
                { value: bonusAmount }
            );

            const filter = escrowBonus.filters.BonusDeposited();
            const events = await escrowBonus.queryFilter(filter);
            requestId = events[events.length - 1].args.requestId;

            // Fund with LINK for fulfill call
            await linkToken.connect(owner).transfer(escrowBonus.address, require("hardhat").ethers.utils.parseUnits("0.1", "ether"));

            // Simulate Chainlink callback with insufficient commits (owner calls fulfill)
            // Note: fulfill might only be callable by LinkToken; if so, this needs adjustment or a mock.
            // Assuming owner can call fulfill directly for simulation as per previous tests.
            await escrowBonus.connect(owner).fulfill(requestId, targetCommits - 10); // Not enough commits

            // Advance time past deadline for most tests in this block
            await require("hardhat").ethers.provider.send("evm_increaseTime", [thirtyDaysInSeconds + 1]); // 30 days + 1 second
            await require("hardhat").ethers.provider.send("evm_mine"); // Mine a new block
        });

        it("Should allow owner to reclaim bonus if not paid and deadline passed", async function () {
            const initialOwnerBalance = await require("hardhat").ethers.provider.getBalance(owner.address);

            // Estimate gas cost for the reclaimBonus transaction
            const gasPrice = await require("hardhat").ethers.provider.getGasPrice();
            const gasEstimate = await escrowBonus.connect(owner).estimateGas.reclaimBonus(requestId);
            const estimatedGasCost = gasPrice.mul(gasEstimate);

            await expect(escrowBonus.connect(owner).reclaimBonus(requestId))
                .to.emit(escrowBonus, "BonusReclaimed")
                .withArgs(requestId, owner.address, bonusAmount);

            const finalOwnerBalance = await require("hardhat").ethers.provider.getBalance(owner.address);
            // Check if final balance is initial + bonusAmount - gasCost
            expect(finalOwnerBalance).to.be.closeTo(initialOwnerBalance.add(bonusAmount).sub(estimatedGasCost), require("hardhat").ethers.utils.parseEther("0.001"));


            const contractDetails = await escrowBonus.bonusContracts(requestId);
            expect(contractDetails.isActive).to.be.false; // Should be inactive after reclaim
        });

        it("Should revert if bonus already paid", async function () {
            // This test needs a different setup: bonus must be paid first.
            // A new deposit is made and fulfilled successfully in its own context.
            const localEscrowBonus = await EscrowBonus.deploy(linkToken.address, jobId, fee);
            await localEscrowBonus.deployed();
            await linkToken.connect(owner).transfer(localEscrowBonus.address, require("hardhat").ethers.utils.parseUnits("1", "ether")); // Fund with LINK

            const newDeadline = Math.floor(Date.now() / 1000) + thirtyDaysInSeconds;
            await localEscrowBonus.connect(owner).depositBonus(
                addr2.address,
                bonusAmount, // Uses bonusAmount from the describe's 'before' hook
                githubRepoOwner,
                githubRepoName,
                githubBranch,
                "another_user",
                targetCommits,
                newDeadline,
                { value: bonusAmount } // Uses bonusAmount from the describe's 'before' hook
            );
            const filterNew = localEscrowBonus.filters.BonusDeposited();
            // Querying on localEscrowBonus instance
            const eventsNew = await localEscrowBonus.queryFilter(filterNew);
            const newRequestId = eventsNew[eventsNew.length -1].args.requestId;

            // Fulfill successfully on the local instance
            await localEscrowBonus.connect(owner).fulfill(newRequestId, targetCommits + 5);

            // Time is already advanced globally, so newDeadline is likely passed.
            await expect(localEscrowBonus.connect(owner).reclaimBonus(newRequestId))
                .to.be.revertedWith("Bonus sudah dibayar.");
        });

        it("Should revert if deadline not passed", async function () {
            // Deploy a new local contract instance for this test to have a clean time state.
            const localEscrowBonus = await EscrowBonus.deploy(linkToken.address, jobId, fee);
            await localEscrowBonus.deployed();
            await linkToken.connect(owner).transfer(localEscrowBonus.address, require("hardhat").ethers.utils.parseUnits("1", "ether")); // Fund with LINK

            const futureDeadline = Math.floor(Date.now() / 1000) + (1 * 24 * 60 * 60); // 1 day from *now*
            await localEscrowBonus.connect(owner).depositBonus(
                addr1.address,
                bonusAmount,
                githubRepoOwner,
                githubRepoName,
                githubBranch,
                githubUsername,
                targetCommits,
                futureDeadline,
                { value: bonusAmount } // Uses bonusAmount from the describe's 'before' hook
            );
            const filterFuture = localEscrowBonus.filters.BonusDeposited();
            const eventsFuture = await localEscrowBonus.queryFilter(filterFuture);
            const newRequestIdFuture = eventsFuture[0].args.requestId;

            // IMPORTANT: DO NOT advance time here. We are testing the state *before* deadline passes.
            // The global time advancement from the main describe's beforeEach does not apply to this fresh instance's timing.

            await expect(localEscrowBonus.connect(owner).reclaimBonus(newRequestIdFuture))
                .to.be.revertedWith("Batas waktu belum terlampaui.");
        });
    });
});
