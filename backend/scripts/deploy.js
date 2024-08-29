async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);

    const BlockBlog = await ethers.getContractFactory("BlockBlog");
    const blockBlog = await BlockBlog.deploy();

    console.log("BlockBlog contract deployed to:", blockBlog.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
