const bip39 = require("bip39");
require("dotenv").config();
const Moralis = require('moralis/node');
const express = require("express");
const ethers = require("ethers");
const serverUrl = "https://znqmxfvglzpr.usemoralis.com:2053/server";
const appId = "ghtzGwB0w5LCRpd3dCyWqVhD3wDwDHpYnRM1OGEA";
const masterKey = "Td928PD0DtnuT2L84xy3REdUhALcFjkEKhEsrsNp";
const bodyParser = require("body-parser");
const fs = require("fs");
const erc1155Abi = JSON.parse(fs.readFileSync("./erc1155.json", "utf8"));
const app = express();
const Web3 = require("web3");
app.use(bodyParser({ extended: true }));

app.disable("x-powered-by");

const getAccountDetails = (mnemonic) => {
    let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
    return {
        mnemonic: mnemonic,
        eth_wallet_address: mnemonicWallet.address,
        eth_wallet_privateKey: mnemonicWallet.privateKey,
        bsc_wallet_address: mnemonicWallet.address,
        bsc_wallet_privateKey: mnemonicWallet.privateKey,
    };
};


app.get("/create-wallet", (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json(getAccountDetails(req.query.memornic_phrase));
    } catch (error) {
        res.json({
            success: false,
            msg: error.message,
        });
    }
});
app.get("/create-seedPhrase", (req, res) => {
    try {
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.json({
            seed: bip39.generateMnemonic(),
        });
    } catch (error) {
        res.json({
            success: false,
            msg: error.message,
        });
    }
});

app.get("/is-valid-seed-phrase", (req, res) => {
    let mnemonic = req.query.mnemonic;
    let isValid = ethers.utils.isValidMnemonic(mnemonic);
    res.json({ isValid });
});

app.get("/get-nfts-detail/:address", async(req, res) => {
    try {
        res.json(await getUserNFT(req.params.address));
    } catch (errorMsg) {
        res.json({
            error: true,
            msg: errorMsg,
        });
    }
});


async function getUserNFT(address) {
    const options = {
        chain: "bsc",
        address: address,
        token_address: "0x1Ac44321888CE192B94060759ccCBaEc910c2018",
    };
    await Moralis.start({ serverUrl, appId, masterKey });
    const polygonNFTs = await Moralis.Web3API.account.getNFTsForContract(options);

    return (polygonNFTs);
}

app.get(
    "/getErc1155Balance/:address/:chainId/:contractaddress/:id",
    async(req, res) => {
        try {
            let rpc;
            switch (req.params.chainId) {
                case "1":
                    rpc = "https://mainnet.infura.io/v3/53163c736f1d4ba78f0a39ffda8d87b4";
                    break;
                case "56":
                    rpc = "https://bsc-dataseed.binance.org/";
                    break;
                case "137":
                    rpc = "https://polygon-rpc.com";
                    break;
                case "97":
                    rpc = "https://data-seed-prebsc-1-s1.binance.org:8545/";
                    break;
                default:
                    res.json({
                        msg: "chainId not supported",
                        success: false,
                    });
                    break;
            }
            const web3 = new Web3(new Web3.providers.HttpProvider(rpc));
            const erc1155Contract = new web3.eth.contract(
                erc1155Abi,
                req.params.contractaddress, {
                    from: req.params.address,
                }
            );

            let balance = await erc1155Contract.methods
                .balanceOf(req.params.address, req.params.id)
                .call();

            res.json({
                msg: balance,
                success: true,
            });
        } catch (e) {
            var error = e.toString();
            res.json({
                msg: error,
                success: false,
            });
        }
    }
);

app.get("/get-user-tokens/:chainId/:address", async(req, res) => {
    // axios to google

    try {
        var blockExplorerUrl;

        switch (req.params.chainId) {
            case "1": // ethereum
                blockExplorerUrl = "https://etherscan.io/address/";
                break;
            case "56": // binance chain
                blockExplorerUrl = "https://bscscan.com/address/";
                break;
            case "97": // binance testnet
                blockExplorerUrl = "https://testnet.bscscan.com/address/";
                break;
            case "137": // polygon
                blockExplorerUrl = "https://polygonscan.com/address/";
                break;
            case "43114": // Avalanche
                blockExplorerUrl = "https://snowtrace.io/address/";
                break;
            case "250": // fantom
                blockExplorerUrl = "https://ftmscan.com/address/";
                break;
            case "42161": // Arbitrum
                blockExplorerUrl = "https://arbiscan.io/address/";
                break;
            case "10": // Optimism
                blockExplorerUrl = "https://optimistic.etherscan.io/address/";
                break;
                // case "321":
                //   blockExplorerUrl = "https://explorer.kcc.io/address/";
                //   break;
                // case "20":
                //   blockExplorerUrl = "https://explorer.elaeth.io/address/";
                //   break;
                // case "100":
                //   blockExplorerUrl = "https://blockscout.com/xdai/mainnet/address/";
                //   break;
                // case "8":
                //   blockExplorerUrl = "https://ubiqscan.io/address/";
                //   break;
                // case "42220":
                //   blockExplorerUrl = "https://explorer.celo.org/address/";
                //   break;
                // case "122":
                //   blockExplorerUrl = "https://explorer.fuse.io/address/";
                //   break;
            default:
                return res.json({ msg: "network not supported", success: false });
        }
        var blockExplorerForAddr = `${blockExplorerUrl}${req.params.address}`;
        const response = await axios.get(
            `${proxyUrl}?&api_key=ehllow9382093828&&url=${blockExplorerForAddr}#tokentxns`
        );
        const $ = cheerio.load(response.data);
        var tokenList = {
            erc721: [],
            erc1155: [],
            erc20: [],
        };

        var currentTokenId = "";

        $(".list-custom").each(function(i, el) {
            var tokenName = $(el).find(".list-name").text();
            var tokenAmount = $(el).find(".list-amount").text();
            var tokenAddress = $(el)
                .find("a")
                .attr("href")
                .split("/token/")[1]
                .split("?")[0];

            var previousElement = $(el).prev();
            if (previousElement.hasClass("list-custom-divider")) {
                currentTokenId = previousElement.find("strong").text().toLowerCase();
            }

            if (currentTokenId.includes("20")) {
                tokenList.erc20.push({
                    tokenName,
                    tokenAmount,
                    tokenAddress,
                });
            } else if (currentTokenId.includes("1155")) {
                tokenList.erc1155.push({
                    tokenName,
                    tokenAmount,
                    tokenAddress,
                });
            } else if (currentTokenId.includes("721")) {
                tokenList.erc721.push({
                    tokenName,
                    tokenAmount,
                    tokenAddress,
                });
            }
        });

        return res.json({ msg: tokenList, success: true });
    } catch (error) {
        return res.json({ msg: error.toString(), success: false });
    }
});

const port = process.env.PORT || 5100;
app.listen(port, () => console.log(`Server Running on port ${port}`));