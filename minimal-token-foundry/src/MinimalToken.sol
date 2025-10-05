// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

error InsufficientTokens(uint256 requested, uint256 available);
error InvalidRecipient(address recipient);
error InsufficientAllowance(uint256 requested, uint256 allowed);
error InvalidFeePercent(uint256 fee);
error Unauthorized();

contract MinimalToken {
    string public name;
    string public symbol;
    uint8 public decimals;
    
    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowance;
    uint256 public totalSupply;

    // Trading Fee Variables
    address public feeCollector;
    uint256 public tradingFeePercent; // Phí giao dịch (basis points: 100 = 1%)
    uint256 public constant MAX_FEE = 1000; // Tối đa 10% (1000 basis points)
    uint256 public totalFeesCollected; // Tổng phí đã thu
    
    mapping(address => bool) public isExemptFromFee; // Miễn phí giao dịch
    mapping(address => uint256) public feesEarnedByAddress; // Phí kiếm được theo địa chỉ

    event Transfer(address indexed from, address indexed to, uint256 amount);
    event Approval(address indexed owner, address indexed spender, uint256 amount);
    event Burn(address indexed from, uint256 amount);
    event FeeCollected(address indexed from, address indexed to, uint256 feeAmount, uint256 transferAmount);
    event FeePercentUpdated(uint256 oldFee, uint256 newFee);
    event FeeExemptionUpdated(address indexed account, bool exempt);
    event FeeCollectorUpdated(address indexed oldCollector, address indexed newCollector);

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        uint256 _initialSupply,
        uint256 _tradingFeePercent
    ) {
        if (_tradingFeePercent > MAX_FEE) revert InvalidFeePercent(_tradingFeePercent);
        
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = _initialSupply;
        balances[msg.sender] = _initialSupply;
        
        // Thiết lập trading fee
        feeCollector = msg.sender;
        tradingFeePercent = _tradingFeePercent;
        isExemptFromFee[msg.sender] = true; // Owner miễn phí
        
        emit Transfer(address(0), msg.sender, _initialSupply);
    }

    /// @notice Transfer _amount tokens from msg.sender to _to với trading fee
    function transfer(address _to, uint256 _amount) public returns (bool) {
        if (_to == address(0)) revert InvalidRecipient(_to);

        uint256 senderBal = balances[msg.sender];
        if (senderBal < _amount) revert InsufficientTokens(_amount, senderBal);

        (uint256 transferAmount, uint256 feeAmount) = _calculateTransferAmounts(msg.sender, _to, _amount);

        unchecked {
            balances[msg.sender] = senderBal - _amount;
        }
        
        balances[_to] += transferAmount;

        // Thu phí nếu có
        if (feeAmount > 0) {
            balances[feeCollector] += feeAmount;
            totalFeesCollected += feeAmount;
            feesEarnedByAddress[feeCollector] += feeAmount;
            
            emit FeeCollected(msg.sender, _to, feeAmount, transferAmount);
            emit Transfer(msg.sender, feeCollector, feeAmount);
        }

        emit Transfer(msg.sender, _to, transferAmount);
        return true;
    }
    
    /// @notice Transfer tokens from one address to another with allowance và trading fee
    function transferFrom(address _from, address _to, uint256 _amount) public returns (bool) {
        if (_to == address(0)) revert InvalidRecipient(_to);
        
        uint256 currentAllowance = allowance[_from][msg.sender];
        if (currentAllowance < _amount) revert InsufficientAllowance(_amount, currentAllowance);
        
        uint256 fromBalance = balances[_from];
        if (fromBalance < _amount) revert InsufficientTokens(_amount, fromBalance);
        
        (uint256 transferAmount, uint256 feeAmount) = _calculateTransferAmounts(_from, _to, _amount);
        
        unchecked {
            allowance[_from][msg.sender] = currentAllowance - _amount;
            balances[_from] = fromBalance - _amount;
        }
        
        balances[_to] += transferAmount;
        
        // Thu phí nếu có
        if (feeAmount > 0) {
            balances[feeCollector] += feeAmount;
            totalFeesCollected += feeAmount;
            feesEarnedByAddress[feeCollector] += feeAmount;
            
            emit FeeCollected(_from, _to, feeAmount, transferAmount);
            emit Transfer(_from, feeCollector, feeAmount);
        }
        
        emit Transfer(_from, _to, transferAmount);
        return true;
    }
    
    /// @notice Approve spender to spend tokens on behalf of msg.sender
    function approve(address _spender, uint256 _amount) public returns (bool) {
        allowance[msg.sender][_spender] = _amount;
        emit Approval(msg.sender, _spender, _amount);
        return true;
    }

    /// @notice Burn tokens from msg.sender, decreasing totalSupply
    function burn(uint256 _amount) public returns (bool) {
        uint256 senderBal = balances[msg.sender];
        if (senderBal < _amount) revert InsufficientTokens(_amount, senderBal);

        unchecked {
            balances[msg.sender] = senderBal - _amount;
            totalSupply = totalSupply - _amount;
        }

        emit Burn(msg.sender, _amount);
        emit Transfer(msg.sender, address(0), _amount);
        return true;
    }

    // ===== TRADING FEE FUNCTIONS =====

    /// @notice Tính toán số tiền chuyển và phí
    function _calculateTransferAmounts(address _from, address _to, uint256 _amount) 
        internal 
        view 
        returns (uint256 transferAmount, uint256 feeAmount) 
    {
        // Kiểm tra miễn phí
        if (isExemptFromFee[_from] || isExemptFromFee[_to] || tradingFeePercent == 0) {
            return (_amount, 0);
        }
        
        feeAmount = (_amount * tradingFeePercent) / 10000;
        transferAmount = _amount - feeAmount;
        
        return (transferAmount, feeAmount);
    }

    /// @notice Tính phí cho một giao dịch (preview)
    function calculateFee(address _from, address _to, uint256 _amount) 
        external 
        view 
        returns (uint256 feeAmount, uint256 transferAmount) 
    {
        return _calculateTransferAmounts(_from, _to, _amount);
    }

    /// @notice Cập nhật phí giao dịch (chỉ feeCollector)
    function setTradingFee(uint256 _newFeePercent) external {
        if (msg.sender != feeCollector) revert Unauthorized();
        if (_newFeePercent > MAX_FEE) revert InvalidFeePercent(_newFeePercent);
        
        uint256 oldFee = tradingFeePercent;
        tradingFeePercent = _newFeePercent;
        
        emit FeePercentUpdated(oldFee, _newFeePercent);
    }

    /// @notice Thêm/xóa miễn phí cho địa chỉ (chỉ feeCollector)
    function setFeeExemption(address _account, bool _exempt) external {
        if (msg.sender != feeCollector) revert Unauthorized();
        
        isExemptFromFee[_account] = _exempt;
        emit FeeExemptionUpdated(_account, _exempt);
    }

    /// @notice Thay đổi người thu phí (chỉ feeCollector hiện tại)
    function setFeeCollector(address _newCollector) external {
        if (msg.sender != feeCollector) revert Unauthorized();
        if (_newCollector == address(0)) revert InvalidRecipient(_newCollector);
        
        address oldCollector = feeCollector;
        feeCollector = _newCollector;
        
        // Chuyển quyền miễn phí cho collector mới
        isExemptFromFee[oldCollector] = false;
        isExemptFromFee[_newCollector] = true;
        
        emit FeeCollectorUpdated(oldCollector, _newCollector);
    }

    /// @notice Lấy tổng phí đã thu
    function getTotalFeesCollected() external view returns (uint256) {
        return totalFeesCollected;
    }

    /// @notice Lấy phí đã thu của một địa chỉ
    function getFeesEarned(address _account) external view returns (uint256) {
        return feesEarnedByAddress[_account];
    }

    /// @notice Lấy thông tin trading fee hiện tại
    function getTradingFeeInfo() external view returns (
        uint256 feePercent,
        address collector,
        uint256 totalFees,
        uint256 maxFee
    ) {
        return (tradingFeePercent, feeCollector, totalFeesCollected, MAX_FEE);
    }

    /// @notice Kiểm tra địa chỉ có miễn phí không
    function isFeeExempt(address _account) external view returns (bool) {
        return isExemptFromFee[_account];
    }
}
