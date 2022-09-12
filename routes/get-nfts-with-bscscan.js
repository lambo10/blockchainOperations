const express = require("express");
const axios = require('axios').default;
const router = express.Router();
const authenticator = require("../authenticator/index.js");


router.get("/", async(req, res) => {
    if (authenticator.auth(req.query.apiKey)) {
        try {
            var blockExplorerUrl;

            switch (req.query.chainId) {
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
            var blockExplorerForAddr = `${blockExplorerUrl}${req.query.address}`;
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
    } else {
        res.json({
            success: false,
            msg: "Invalid API key",
        });
    }
});

module.exports = router;