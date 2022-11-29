pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract GreedyVerse is ERC20, Ownable{
    using SafeMath for uint256;
    address public marketing_gameDev_wallet = 0x9838d34c4300e4d7E722a42c34692A8099164C81;
    uint256 tax = 2;
    mapping (address => bool) private _isExcludedFromFee;

    constructor(uint256 initalSupply) ERC20("GreedyVerse","GVERSE"){
        _mint(msg.sender,initalSupply);
    }

   function _transfer(address from,address to,uint256 amount) internal virtual override {
       uint256 transferAmount = amount;
       if(!_isExcludedFromFee[from]){
        transferAmount = amount.sub(amount.mul(tax.div(100)));
       }
        
        _transfer(from, to, transferAmount);
    }

    function _afterTokenTransfer(address from,address to,uint256 amount) internal virtual override{
        _transfer(from, to, amount.mul(tax.div(100)));
    }

     function isExcludedFromFee(address account) public view returns(bool) {
        return _isExcludedFromFee[account];
    }
    
    function excludeFromFee(address account) public onlyOwner {
        _isExcludedFromFee[account] = true;
    }
    
    function includeInFee(address account) public onlyOwner {
        _isExcludedFromFee[account] = false;
    }

    function set_marketing_gameDev_wallet(address _marketing_gameDev_wallet)public onlyOwner {
        marketing_gameDev_wallet = _marketing_gameDev_wallet;
    }

}
