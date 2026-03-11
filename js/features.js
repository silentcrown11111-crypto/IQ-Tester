/**
 * features.js
 * Advanced Logic-Only Modules for PakAuctions
 * Implements Proxy Bidding, Anti-Sniping, and Escrow Bridge.
 */

const AuctionFeatures = {
    // A. Proxy Bidding System Logic
    // Automatically bids on behalf of the user when outbid, up to their max limit.
    processProxyBid(auction, bidderName, maxBidAmount) {
        const increment = 50000; // Step increment for auto-bidding
        let currentPrice = auction.price;
        
        if (maxBidAmount > currentPrice + increment) {
            auction.price = currentPrice + increment;
            auction.highestBidder = bidderName;
            auction.bids = (auction.bids || 0) + 1;
            return {
                success: true,
                newPrice: auction.price,
                message: `Proxy bid placed. Current price is now ${auction.price}.`
            };
        }
        return { success: false, message: "Max bid must be higher than current price + increment." };
    },

    // B. Anti-Sniping Logic
    // If a bid is placed within the final 2 minutes, extend the timer by 2 minutes.
    checkAndExtendTimer(product) {
        // Mock logic: assuming timer is in MM:SS format
        const timeParts = product.timer.split(':');
        let minutes = parseInt(timeParts[0]);
        let seconds = parseInt(timeParts[1]);
        
        const totalSeconds = (minutes * 60) + seconds;
        
        if (totalSeconds < 120) { // Less than 2 minutes left
            const extendedSeconds = totalSeconds + 120;
            const newMins = Math.floor(extendedSeconds / 60);
            const newSecs = extendedSeconds % 60;
            product.timer = `${newMins}:${newSecs < 10 ? '0' : ''}${newSecs}`;
            return true;
        }
        return false;
    },

    // C. Escrow Payment Bridge Logic
    // Transitions funds from Pending to Completed based on user confirmation.
    releaseEscrow(paymentId, appState) {
        const payment = appState.payments.find(p => p.id === paymentId);
        if (payment && payment.status === 'Pending') {
            payment.status = 'Completed';
            return { success: true, message: "Payment released from Escrow to Seller." };
        }
        return { success: false, message: "Payment not found or already released." };
    },

    // D. Property Legal Verification
    // Checks if a property listing is legally clear before allowing bids.
    isLegallyApproved(product) {
        if (product.category === 'Properties') {
            return product.legalFlag === true;
        }
        return true; // Non-properties are auto-approved for this simulation
    }
};

window.AuctionFeatures = AuctionFeatures;
