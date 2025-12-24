import { useState } from 'react';
import { FaHeart, FaSpinner, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function DonationButton() {
    const [showDonationForm, setShowDonationForm] = useState(false);
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [customAmount, setCustomAmount] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [name, setName] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [transactionStatus, setTransactionStatus] = useState(null); // null, 'success', 'pending', 'failed'
    const [transactionId, setTransactionId] = useState(null);

    const presetAmounts = [1000, 2000, 5000, 10000]; // TSh amounts

    const handleDonation = async () => {
        const amount = selectedAmount || parseInt(customAmount);

        if (!amount || amount < 200) {
            alert('Please enter an amount of at least 200 TSh');
            return;
        }

        if (!phoneNumber || phoneNumber.length < 9) {
            alert('Please enter a valid phone number');
            return;
        }

        if (!name || name.trim().length < 2) {
            alert('Please enter your name');
            return;
        }

        setIsProcessing(true);
        setTransactionStatus('pending');

        try {
            const response = await fetch('https://api.fastlipa.com/api/create-transaction', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer FastLipa_yIPdGwsqFyINdHiLGRZjVr',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number: phoneNumber,
                    amount: amount,
                    name: name
                })
            });

            const data = await response.json();

            if (data.status === 'success') {
                setTransactionId(data.data.tranID);

                // Check transaction status after 5 seconds
                setTimeout(() => checkTransactionStatus(data.data.tranID), 5000);
            } else {
                setTransactionStatus('failed');
                alert('Failed to initiate payment. Please try again.');
            }
        } catch (error) {
            console.error('Payment error:', error);
            setTransactionStatus('failed');
            alert('An error occurred. Please try again later.');
        } finally {
            setIsProcessing(false);
        }
    };

    const checkTransactionStatus = async (tranId) => {
        try {
            const response = await fetch(
                `https://api.fastlipa.com/api/status-transaction?tranid=${tranId}`,
                {
                    headers: {
                        'Authorization': 'Bearer FastLipa_yIPdGwsqFyINdHiLGRZjVr'
                    }
                }
            );

            const data = await response.json();

            if (data.data?.payment_status === 'COMPLETED') {
                setTransactionStatus('success');
            } else if (data.data?.payment_status === 'PENDING') {
                // Check again after 30 seconds, up to 2 minutes
                const elapsedTime = Date.now();
                if (elapsedTime < 120000) { // 2 minutes
                    setTimeout(() => checkTransactionStatus(tranId), 30000);
                } else {
                    setTransactionStatus('failed');
                }
            } else {
                setTransactionStatus('failed');
            }
        } catch (error) {
            console.error('Status check error:', error);
        }
    };

    const resetForm = () => {
        setShowDonationForm(false);
        setSelectedAmount(null);
        setCustomAmount('');
        setPhoneNumber('');
        setName('');
        setTransactionStatus(null);
        setTransactionId(null);
    };

    return (
        <div className="donation-container">
            <button
                className="donation-toggle-button"
                onClick={() => setShowDonationForm(true)}
            >
                <FaHeart className="mr-2" />
                Support This Project
            </button>

            {showDonationForm && (
                <div className="donation-modal-overlay" onClick={() => setShowDonationForm(false)}>
                    <div className="donation-modal-content" onClick={e => e.stopPropagation()}>
                        <button
                            className="donation-close-button"
                            onClick={() => setShowDonationForm(false)}
                        >
                            <FaTimesCircle />
                        </button>

                        {transactionStatus === 'success' ? (
                            <div className="donation-success">
                                <FaCheckCircle className="success-icon" />
                                <h3>Thank You! 🎄</h3>
                                <p>Your generous donation has been received. We truly appreciate your support!</p>
                                <button onClick={resetForm} className="reset-button">
                                    Make Another Donation
                                </button>
                            </div>
                        ) : transactionStatus === 'failed' ? (
                            <div className="donation-failed">
                                <FaTimesCircle className="error-icon" />
                                <h3>Payment Failed</h3>
                                <p>The transaction could not be completed. Please try again.</p>
                                <button onClick={resetForm} className="reset-button">
                                    Try Again
                                </button>
                            </div>
                        ) : transactionStatus === 'pending' ? (
                            <div className="donation-pending">
                                <FaSpinner className="animate-spin pending-icon" />
                                <h3>Processing Payment...</h3>
                                <p>Please check your phone and confirm the payment request.</p>
                                <p className="transaction-id">Transaction ID: {transactionId}</p>
                            </div>
                        ) : (
                            <>
                                <h3 className="donation-title">
                                    <FaHeart className="inline-block mr-2" />
                                    Support Our Work
                                </h3>
                                <p className="donation-description">
                                    Your donation helps us keep this service free and ad-free for everyone! 🎁
                                </p>

                                <div className="amount-selection">
                                    <label className="form-label">Select Amount (TSh):</label>
                                    <div className="preset-amounts">
                                        {presetAmounts.map((amount) => (
                                            <button
                                                key={amount}
                                                onClick={() => {
                                                    setSelectedAmount(amount);
                                                    setCustomAmount('');
                                                }}
                                                className={`amount-button ${selectedAmount === amount ? 'active' : ''}`}
                                            >
                                                {amount.toLocaleString()} TSh
                                            </button>
                                        ))}
                                    </div>

                                    <div className="custom-amount">
                                        <label className="form-label">Or enter custom amount:</label>
                                        <input
                                            type="number"
                                            value={customAmount}
                                            onChange={(e) => {
                                                setCustomAmount(e.target.value);
                                                setSelectedAmount(null);
                                            }}
                                            placeholder="Enter amount in TSh"
                                            className="input-field"
                                            min="200"
                                        />
                                    </div>
                                </div>

                                <div className="donor-info">
                                    <div className="form-group">
                                        <label className="form-label">Your Name:</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="John Doe"
                                            className="input-field"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Phone Number:</label>
                                        <input
                                            type="tel"
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            placeholder="0xxxxxxxxx"
                                            className="input-field"
                                        />
                                        <small className="help-text">
                                            Enter your mobile money number (Airtel, M-Pesa, Tigo, etc.)
                                        </small>
                                    </div>
                                </div>

                                <button
                                    onClick={handleDonation}
                                    disabled={isProcessing || (!selectedAmount && !customAmount)}
                                    className="submit-donation-button"
                                >
                                    {isProcessing ? (
                                        <>
                                            <FaSpinner className="animate-spin mr-2" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <FaHeart className="mr-2" />
                                            Donate {selectedAmount || customAmount || '___'} TSh
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
