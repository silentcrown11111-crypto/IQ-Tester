/**
 * auction-engine.js
 * 
 * Advanced Backend Logic Simulation Module.
 * Contains purely additive non-API logic for complex auction mechanics.
 */

class AugmentedAuctionEngine {
    constructor() {
        this.escrowLedger = []; 
        this.proxyRules = [];
        this.socketSubscribers = [];
        this.activeSimulations = true;
    }

    /**
     * 1. Escrow Payment Bridge Logic
     * Holds winning bids in PENDING state. Released upon buyer confirmation.
     */
    processWinningBid(auctionId, buyerId, amount) {
        const transaction = {
            txnId: 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            auctionId,
            buyerId,
            amount,
            status: 'PENDING_ESCROW',
            timestamp: Date.now()
        };
        this.escrowLedger.push(transaction);
        this.emitToSocket(`Funds of PKR ${new Intl.NumberFormat('en-PK').format(amount)} secured in Escrow for Auction #${auctionId}`);
        return transaction;
    }

    releaseFunds(transactionId) {
        const txn = this.escrowLedger.find(t => t.txnId === transactionId);
        if (txn && txn.status === 'PENDING_ESCROW') {
            txn.status = 'RELEASED_TO_SELLER';
            this.emitToSocket(`Escrow Released: Seller received funds for TXN ${transactionId}`);
            return true;
        }
        return false;
    }

    /**
     * 2. Anti-Sniping Logic
     * Extends auction by 2 minutes if a bid is placed within the final 60 seconds.
     */
    evaluateAntiSniping(auctionData, currentTimeStr) {
        // Simulated parsing of incoming DD:HH:MM:SS string
        // If remaining time < 60 seconds, mathematically add 120 seconds.
        let isExtended = false;
        
        // Mocking logic to simulate time extension calculation safely
        const mockTimeRemainingSec = Math.floor(Math.random() * 100); 
        if(mockTimeRemainingSec < 60) {
            isExtended = true;
            this.emitToSocket(`Anti-Sniping triggered: Auction ${auctionData.id} timer extended by 2 minutes.`);
        }
        
        return isExtended;
    }

    /**
     * 3. Proxy Bidding System Logic
     * Automates bidding for users up to their defined maximum increment.
     */
    registerProxyBid(auctionId, bidderId, maxAmount) {
        this.proxyRules.push({ auctionId, bidderId, maxAmount });
        this.emitToSocket(`Proxy bid rule registered for User ${bidderId} on Auction ${auctionId}`);
    }

    triggerProxyEvaluation(auctionObj, currentHighestBid) {
        const rules = this.proxyRules.filter(r => r.auctionId === auctionObj.id);
        const incrementThreshold = Math.floor(currentHighestBid * 0.05); // 5% minimum increment

        let appliedRule = null;
        for (let rule of rules) {
            if (rule.maxAmount >= (currentHighestBid + incrementThreshold)) {
                if (!appliedRule || rule.maxAmount > appliedRule.maxAmount) {
                    appliedRule = rule;
                }
            }
        }

        if (appliedRule) {
            const newBid = currentHighestBid + incrementThreshold;
            this.emitToSocket(`Proxy Bidding Engine auto-placed PKR ${new Intl.NumberFormat('en-PK').format(newBid)} for ${appliedRule.bidderId} on Auction ${auctionObj.id}`);
            return newBid;
        }
        return null;
    }

    /**
     * 4. Live Bid Ticker (Web Socket Simulation)
     * Handles publisher/subscriber streams locally.
     */
    connectWebSocket(subscriberCallback) {
        if (!this.socketSubscribers.includes(subscriberCallback)) {
            this.socketSubscribers.push(subscriberCallback);
        }
        return {
            disconnect: () => {
                this.socketSubscribers = this.socketSubscribers.filter(cb => cb !== subscriberCallback);
            }
        };
    }

    emitToSocket(message) {
        const socketPayload = {
            id: 'evt_' + Date.now(),
            message,
            timestamp: new Date().toLocaleTimeString('en-US', { hour12: false })
        };
        this.socketSubscribers.forEach(cb => cb(socketPayload));
    }
}

// Make accessible globally
window.AuctionBackendEngine = new AugmentedAuctionEngine();

// Demo Initialization & Automated Submissions
setTimeout(() => {
    // Register some proxy rules
    window.AuctionBackendEngine.registerProxyBid(5, 'User_Zain', 100000000);
    window.AuctionBackendEngine.registerProxyBid(10, 'Collector_Ali', 9000000);
    
    // Simulate real-time WS broadcasts roughly every 6-8 seconds
    setInterval(() => {
        const msgs = [
            "Hot Listing: Audi A5 reached reserve price!",
            "New Proxy Bid established for Vintage Rolex.",
            "Live User joined the platform.",
            "Property DHA Phase 6 viewing scheduled."
        ];
        const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
        window.AuctionBackendEngine.emitToSocket(randomMsg);
    }, 8000);
}, 2000);
