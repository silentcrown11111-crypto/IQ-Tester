/**
 * app.js
 * Core Logic for the Pak Auctions SPA
 * V4.1 Restoration: Light Theme, Mockup-Accurate Components
 */

class App {
    constructor() {
        this.appContainer = document.getElementById('app');
        this.state = {
            auctions: this.generateData(),
            filters: { category: [], status: 'Live', categories: [], price: 100000000 },
            isAdmin: false,
            users: [
                { id: 1, name: "Hamid Mehmood", email: "hamid@example.com", cnicStatus: "Verified", isBlocked: false },
                { id: 2, name: "Sadaf Khan", email: "sadaf@example.com", cnicStatus: "Verified", isBlocked: false },
                { id: 3, name: "Ali Ahmed", email: "ali@example.com", cnicStatus: "Pending", isBlocked: false }
            ],
            bids: [
                { id: 1, userName: "Hamid Mehmood", productName: "Audi A5", amount: 15500000, time: "2026-03-11 10:30:00" },
                { id: 2, userName: "Sadaf Khan", productName: "Rolex Submariner", amount: 8600000, time: "2026-03-11 11:15:00" }
            ],
            payments: [
                { id: 1, buyer: "Hamid Mehmood", seller: "DHA Properties", amount: 95500000, product: "1 Kanal Luxury House", status: "Pending" }
            ],
            watchlist: [],
            notifications: [
                { id: 1, msg: "Someone placed a new bid on your Audi A5", time: "2 mins ago" },
                { id: 2, msg: "You have been outbid on iPhone 15 Pro Max", time: "1 hour ago" },
                { id: 3, msg: "Auction ending soon: MacBook Pro M1", time: "3 hours ago" }
            ],
            showNotif: false,
            paymentSubmissions: []
        };
        window.app = this;
        this.init();
    }

    setState(key, value) {
        this.state[key] = value;
    }

    init() {
        this.renderWelcomeView();
    }

    setView(htmlContent) {
        const fabHtml = `
            <div class="fab-container fade-in">
                <a href="https://wa.me/923267685944" target="_blank" class="fab fab-whatsapp" title="Chat on WhatsApp">
                    <i class="fa-brands fa-whatsapp"></i>
                </a>
                <button class="fab fab-support" title="Customer Support">
                    <i class="fa-solid fa-headset"></i>
                </button>
            </div>
        `;
        this.appContainer.innerHTML = htmlContent + fabHtml;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    formatCurr(amount) {
        return new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', maximumFractionDigits: 0 }).format(amount);
    }

    generateData() {
        return [
            {
                id: 1,
                title: "Vintage Rolex",
                sellerName: "AhsanK",
                category: "Antiques",
                price: 15000000,
                image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800",
                gallery: ["https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=800", "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?w=800"],
                status: "Live",
                timer: "0:36",
                bids: 42,
                verified: true,
                condition: "Mint",
                location: "Karachi",
                description: "A timeless masterpiece. This vintage Rolex Submariner features a classic black dial and robust stainless steel construction. Meticulously serviced and in pristine condition.",
                isFeatured: true
            },
            {
                id: 2,
                title: "Luxury Apartment",
                sellerName: "SaraM",
                category: "Properties",
                price: 9500000,
                image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
                gallery: ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
                status: "Live",
                timer: "0:36",
                bids: 18,
                verified: true,
                condition: "New",
                location: "Lahore",
                legalFlag: true,
                description: "Spacious and modern apartment in a prime location. Features high-end finishes, panoramic views, and luxury amenities. Fully verified legal status."
            },
            {
                id: 3,
                title: "Unique Collectible Coin",
                sellerName: "Sadaf",
                category: "Antiques",
                price: 15000000,
                image: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6?w=800",
                gallery: ["https://images.unsplash.com/photo-1589118949245-7d38baf380d6?w=800"],
                status: "Live",
                timer: "0:35",
                bids: 24,
                verified: true,
                condition: "Excellent",
                location: "Islamabad",
                description: "A rare find for any numismatist. This unique collectible coin has a rich history and is in exceptional grade. A true centerpiece for any collection."
            },
            {
                id: 4,
                title: "High-end Camera",
                sellerName: "ALiZ",
                category: "Electronics",
                price: 13000000,
                image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800",
                gallery: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800"],
                status: "Live",
                timer: "0:36",
                bids: 12,
                verified: true,
                condition: "Pro",
                location: "Lahore",
                description: "Professional grade imaging equipment. This high-end camera delivers unmatched performance and quality for serious photographers."
            },
            {
                id: 5,
                title: "Classic Car",
                sellerName: "AhsanK",
                category: "Cars",
                price: 15000000,
                image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800",
                gallery: ["https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800"],
                status: "Live",
                timer: "0:36",
                bids: 56,
                verified: true,
                condition: "Showroom",
                location: "Islamabad",
                description: "Experience the joy of classic motoring with this beautifully maintained vintage car. A head-turner on any road, combining style with mechanical excellence."
            }
        ];
    }

    updateFilter(key, value) {
        if (!this.state.filters) this.state.filters = { categories: [], price: 100000000, status: 'all' };
        
        if (key === 'category') {
            const idx = this.state.filters.categories.indexOf(value);
            if (idx > -1) this.state.filters.categories.splice(idx, 1);
            else this.state.filters.categories.push(value);
        } else {
            this.state.filters[key] = parseFloat(value) || value;
        }
        this.renderMarketplace();
    }

    getFilteredAuctions() {
        const filters = this.state.filters || { categories: [], price: 100000000, status: 'all' };
        return this.state.auctions.filter(a => {
            const catMatch = filters.categories.length === 0 || filters.categories.includes(a.category);
            const priceMatch = a.price <= filters.price;
            const statusMatch = filters.status === 'all' || a.status === filters.status;
            return catMatch && priceMatch && statusMatch;
        });
    }

    renderWelcomeView() {
        const html = `
            <div class="hero-section fade-in">
                <div class="brand flex items-center gap-2 mb-8" style="font-weight:900; font-size:2rem;">
                    <span style="background:#311542; color:white; width:45px; height:45px; display:flex; align-items:center; justify-content:center; border-radius:12px;">PA</span>
                    <span>Pak<span style="color:#311542">Auctions</span></span>
                </div>
                <h1 class="welcome-title">Welcome to the Future of Bidding</h1>
                <p style="font-size:1.2rem; color:var(--text-muted); max-width:600px;">Experience Pakistan's most secure and premium online auction marketplace.</p>
                
                <div class="role-grid" style="margin-top:4rem;">
                    <div class="role-card" onclick="app.setState('role', 'seller'); app.renderSellerVerification()">
                        <i class="fa-solid fa-store role-icon"></i>
                        <span class="role-name">Continue as Seller</span>
                        <p class="role-desc">Start selling your items with verified security.</p>
                    </div>
                    <div class="role-card" onclick="app.setState('role', 'buyer'); app.renderBuyerRegistration()">
                        <i class="fa-solid fa-shopping-bag role-icon"></i>
                        <span class="role-name">Continue as Buyer</span>
                        <p class="role-desc">Find premium products and place your winning bids.</p>
                    </div>
                    <div class="role-card" onclick="app.setState('role', 'visitor'); app.renderMarketplace()">
                        <i class="fa-solid fa-eye role-icon"></i>
                        <span class="role-name">Visit as Guest</span>
                        <p class="role-desc">Browse active listings without registration.</p>
                    </div>
                </div>

                <!-- Hidden Admin Entry -->
                <div class="v5-admin-entry" onclick="app.renderAdminLogin()" title="Admin Access"></div>
            </div>
        `;
        this.setView(html);
    }

    renderAdminLogin() {
        const html = `
            <div class="container py-24 fade-in">
                <div class="verify-container" style="max-width:400px; margin:0 auto; padding:3rem;">
                    <div style="text-align:center; margin-bottom:2rem;">
                        <span style="background:#311542; color:white; width:60px; height:60px; display:inline-flex; align-items:center; justify-content:center; border-radius:15px; font-size:1.5rem; font-weight:900; margin-bottom:1rem;">PA</span>
                        <h2 style="font-weight:900; color:#1e293b;">Admin Authentication</h2>
                        <p style="color:#64748b; font-size:0.9rem;">Please enter secure credentials to continue.</p>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">Username</label>
                        <input type="text" id="admin-user" class="form-input" placeholder="Admin username">
                    </div>
                    <div class="form-group" style="margin-top:1.5rem;">
                        <label class="form-label">Password</label>
                        <input type="password" id="admin-pass" class="form-input" placeholder="••••••••">
                    </div>
                    
                    <button class="v5-primary-btn" style="margin-top:2rem;" onclick="app.handleAdminLogin()">
                        Access Dashboard <i class="fa-solid fa-shield-halved ml-2"></i>
                    </button>
                    
                    <button class="btn" style="width:100%; margin-top:1rem; background:#f1f5f9; color:#64748b; font-weight:700;" onclick="app.renderWelcomeView()">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        this.setView(html);
    }

    handleAdminLogin() {
        const user = document.getElementById('admin-user').value;
        const pass = document.getElementById('admin-pass').value;

        if (user === 'Pak Auction.com' && pass === '11.11.11') {
            this.setState('isAdmin', true);
            this.setState('userName', 'Global Admin');
            this.renderAdminDashboard('overview');
        } else {
            alert('Invalid administrative credentials. Access denied.');
        }
    }

    renderAdminDashboard(activeTab = 'overview') {
        if (!this.state.isAdmin) {
            this.renderWelcomeView();
            return;
        }

        const stats = {
            auctions: this.state.auctions.length,
            users: this.state.users.length,
            bids: this.state.bids.length,
            pending: this.state.payments.filter(p => p.status === 'Pending').length
        };

        const html = `
            ${this.renderNavbarV5()}
            <div class="admin-dashboard-container fade-in">
                <aside class="admin-sidebar">
                    <div class="admin-sidebar-header">
                        Admin Control
                    </div>
                    <nav class="admin-sidebar-nav">
                        <a href="javascript:void(0)" class="${activeTab === 'overview' ? 'active' : ''}" onclick="app.renderAdminDashboard('overview')"><i class="fa-solid fa-chart-line"></i> Overview</a>
                        <a href="javascript:void(0)" class="${activeTab === 'auctions' ? 'active' : ''}" onclick="app.renderAdminDashboard('auctions')"><i class="fa-solid fa-gavel"></i> Auctions</a>
                        <a href="javascript:void(0)" class="${activeTab === 'users' ? 'active' : ''}" onclick="app.renderAdminDashboard('users')"><i class="fa-solid fa-users"></i> Users</a>
                        <a href="javascript:void(0)" class="${activeTab === 'payments' ? 'active' : ''}" onclick="app.renderAdminDashboard('payments')"><i class="fa-solid fa-money-bill-transfer"></i> Payments</a>
                        <a href="javascript:void(0)" class="${activeTab === 'verifications' ? 'active' : ''}" onclick="app.renderAdminDashboard('verifications')"><i class="fa-solid fa-shield-check"></i> Verifications</a>
                    </nav>
                    </nav>
                </aside>

                <main class="admin-main">
                    <div class="admin-content">
                        ${this.renderAdminTab(activeTab, stats)}
                    </div>
                </main>
            </div>
            ${this.renderFooterV5()}
        `;
        this.setView(html);
    }

    renderAdminTab(tab, stats) {
        switch(tab) {
            case 'overview':
                return `
                    <h2 class="admin-section-title">Dashboard Overview</h2>
                    <div class="admin-stats-grid">
                        <div class="admin-stat-card">
                            <div class="val">${stats.auctions}</div>
                            <div class="lbl">Active Auctions</div>
                        </div>
                        <div class="admin-stat-card">
                            <div class="val">${stats.users}</div>
                            <div class="lbl">Registered Users</div>
                        </div>
                        <div class="admin-stat-card">
                            <div class="val">${stats.bids}</div>
                            <div class="lbl">Total Bids Placed</div>
                        </div>
                        <div class="admin-stat-card">
                            <div class="val">${stats.pending}</div>
                            <div class="lbl">Pending Payments</div>
                        </div>
                    </div>
                    
                    <h2 class="admin-section-title mt-12">Live Bid Log</h2>
                    <div class="admin-table-wrapper">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Product</th>
                                    <th>Amount</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.state.bids.map(b => `
                                    <tr>
                                        <td>${b.userName}</td>
                                        <td>${b.productName}</td>
                                        <td>${this.formatCurr(b.amount)}</td>
                                        <td>${b.time}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            case 'auctions':
                return `
                    <h2 class="admin-section-title">Auction Management</h2>
                    <div class="admin-table-wrapper">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Seller</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.state.auctions.map(a => `
                                    <tr>
                                        <td>${a.title}</td>
                                        <td>${a.sellerName}</td>
                                        <td>${a.category}</td>
                                        <td>${this.formatCurr(a.price)}</td>
                                        <td>
                                            <div class="flex gap-2">
                                                <button class="admin-btn-sm edit" onclick="alert('Edit logic for ${a.title}')"><i class="fa-solid fa-pen"></i></button>
                                                <button class="admin-btn-sm extend" onclick="app.extendAuction(${a.id})" title="Extend 24h"><i class="fa-solid fa-clock"></i></button>
                                                <button class="admin-btn-sm ${a.isFeatured ? 'featured' : ''}" style="${a.isFeatured ? 'background:#fef3c7; color:#ca8a04;' : ''}" onclick="app.toggleFeatured(${a.id})" title="Toggle Featured">
                                                    <i class="fa-${a.isFeatured ? 'solid' : 'regular'} fa-star"></i>
                                                </button>
                                                <button class="admin-btn-sm delete" onclick="app.deleteAuction(${a.id})"><i class="fa-solid fa-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            case 'users':
                return `
                    <h2 class="admin-section-title">User Monitoring</h2>
                    <div class="admin-table-wrapper">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>CNIC Status</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.state.users.map(u => `
                                    <tr>
                                        <td>${u.name}</td>
                                        <td>${u.email}</td>
                                        <td>${u.cnicStatus}</td>
                                        <td>${u.isBlocked ? '<span style="color:#ef4444;">Blocked</span>' : '<span style="color:#10b981;">Active</span>'}</td>
                                        <td>
                                            <button class="admin-btn-sm ${u.isBlocked ? 'unblock' : 'block'}" onclick="app.toggleBlockUser(${u.id})">
                                                ${u.isBlocked ? 'Unblock' : 'Block'}
                                            </button>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            case 'payments':
                return `
                    <h2 class="admin-section-title">Escrow & Payment Oversight</h2>
                    <div class="admin-table-wrapper">
                        <table class="admin-table">
                            <thead>
                                <tr>
                                    <th>Buyer</th>
                                    <th>Seller</th>
                                    <th>Product</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.state.payments.map(p => `
                                    <tr>
                                        <td>${p.buyer}</td>
                                        <td>${p.seller}</td>
                                        <td>${p.product}</td>
                                        <td>${this.formatCurr(p.amount)}</td>
                                        <td><span class="status-pill ${p.status.toLowerCase()}">${p.status}</span></td>
                                        <td>
                                            ${p.status === 'Pending' ? `<button class="admin-btn-sm complete" onclick="app.completeEscrow(${p.id})">Release Escrow</button>` : '<i class="fa-solid fa-check-double text-green-500"></i> Released'}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
            case 'verifications':
                return this.renderAdminPayments();
        }
    }

    renderAdminPayments() {
        return `
            <h2 class="admin-section-title">Pending Payment Verifications</h2>
            <div class="admin-table-wrapper">
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Product</th>
                            <th>Method</th>
                            <th>Proof/Details</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.state.paymentSubmissions.map(pay => `
                            <tr>
                                <td>${pay.user}</td>
                                <td>${pay.product}</td>
                                <td>${pay.method.toUpperCase()}</td>
                                <td>
                                    ${pay.method === 'card' ? `Card: ****${pay.details.slice(-4)}` : 
                                    `<button onclick="window.open('${pay.proof}', '_blank')" style="background:#d4af37; border:none; padding:5px 10px; cursor:pointer; border-radius:3px; font-size:0.8rem;">View Proof</button>`}
                                </td>
                                <td><span class="status-pill ${pay.status.toLowerCase()}">${pay.status}</span></td>
                                <td>
                                    <div class="flex gap-2">
                                        <button onclick="app.updatePayStatus(${pay.id}, 'Approved')" class="admin-btn-sm complete">Approve</button>
                                        <button onclick="app.updatePayStatus(${pay.id}, 'Rejected')" class="admin-btn-sm delete">Reject</button>
                                    </div>
                                </td>
                            </tr>
                        `).join('')}
                        ${this.state.paymentSubmissions.length === 0 ? '<tr><td colspan="6" style="text-align:center; padding:20px;">No pending verifications.</td></tr>' : ''}
                    </tbody>
                </table>
            </div>
        `;
    }

    updatePayStatus(payId, newStatus) {
        const pay = this.state.paymentSubmissions.find(p => p.id === payId);
        if(pay) {
            pay.status = newStatus;
            
            if(newStatus === 'Approved') {
                const product = this.state.auctions.find(a => a.title === pay.product);
                if(product) {
                    product.status = 'Sold';
                    product.badge = 'SOLD';
                }
            }
            
            alert(`Payment ${newStatus} successfully!`);
            this.renderAdminDashboard('verifications');
        }
    }

    deleteAuction(id) {
        if(confirm("Are you sure you want to delete this listing?")) {
            this.state.auctions = this.state.auctions.filter(a => a.id !== id);
            this.renderAdminDashboard('auctions');
        }
    }

    extendAuction(id) {
        alert("Auction timer extended by 24 hours.");
        // Logic to update timer state would go here in a real app
    }

    toggleBlockUser(id) {
        const user = this.state.users.find(u => u.id === id);
        if(user) {
            user.isBlocked = !user.isBlocked;
            this.renderAdminDashboard('users');
        }
    }

    markPaymentComplete(id) {
        const payment = this.state.payments.find(p => p.id === id);
        if(payment) {
            payment.status = 'Completed';
            this.renderAdminDashboard('payments');
        }
    }

    renderSellerVerification() {
        if (this.state.isAdmin) {
            this.renderSellerDashboard();
            return;
        }
        const html = `
            ${this.renderNavbarV5()}
            <div class="container py-12">
                <div class="verify-container fade-in">
                    <h2 style="font-size:2rem; font-weight:900;">Identity Verification</h2>
                    <p style="color:var(--text-muted); margin-top:0.5rem;">To ensure the security of our marketplace, all sellers must be verified via NADRA.</p>
                    
                    <div id="upload-section">
                        <div class="upload-grid">
                            <div>
                                <input type="file" id="cnic-front-input" style="display:none;" accept="image/png, image/jpeg, application/pdf" onchange="app.handleCnicUpload('front')">
                                <div class="upload-box" id="dropzone-front" onclick="document.getElementById('cnic-front-input').click()">
                                    <div class="scanning-bar" id="scanner-front"></div>
                                    <i class="fa-solid fa-id-card" style="font-size:3rem; color:var(--primary); margin-bottom:1rem;"></i>
                                    <p id="status-front"><strong>Upload Front</strong><br>PNG, JPG or PDF</p>
                                </div>
                            </div>
                            <div>
                                <input type="file" id="cnic-back-input" style="display:none;" accept="image/png, image/jpeg, application/pdf" onchange="app.handleCnicUpload('back')">
                                <div class="upload-box" id="dropzone-back" onclick="document.getElementById('cnic-back-input').click()">
                                    <div class="scanning-bar" id="scanner-back"></div>
                                    <i class="fa-solid fa-qrcode" style="font-size:3rem; color:var(--primary); margin-bottom:1rem;"></i>
                                    <p id="status-back"><strong>Upload Back</strong><br>PNG, JPG or PDF</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div id="autofill-section" class="auto-fill-form" style="display:none;">
                        <h3 style="font-weight:800; font-size:1.2rem; margin-bottom:1rem; border-bottom:1px solid #eee; padding-bottom:0.5rem;">
                            <i class="fa-solid fa-wand-magic-sparkles text-yellow-500 mr-2"></i> Auto-filled from ID
                        </h3>
                        <div class="form-group">
                            <label class="form-label">Full Name</label>
                            <input type="text" class="form-input" id="af-name" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label">CNIC Number</label>
                            <input type="text" class="form-input" id="af-cnic" readonly>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Address</label>
                            <input type="text" class="form-input" id="af-address" readonly>
                        </div>

                        <h3 style="font-weight:800; font-size:1.2rem; margin-top:2rem; margin-bottom:1rem; border-bottom:1px solid #eee; padding-bottom:0.5rem;">
                            <i class="fa-solid fa-phone text-blue-500 mr-2"></i> Contact Details
                        </h3>
                        <div class="form-row">
                            <div class="form-group">
                                <label class="form-label">Phone Number</label>
                                <input type="tel" class="form-input" placeholder="03XX-XXXXXXX" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Email Address</label>
                                <input type="email" class="form-input" placeholder="example@email.com" required>
                            </div>
                        </div>

                        <button class="btn-bid" onclick="app.setState('userName', document.getElementById('af-name').value); app.renderTermsAndPolicies()" style="margin-top:1rem;">Continue to Policies <i class="fa-solid fa-arrow-right ml-2"></i></button>
                    </div>

                </div>
            </div>
        `;
        this.setView(html);
        this.uploadState = { front: false, back: false };
    }

    handleCnicUpload(side) {
        const fileInput = document.getElementById(`cnic-${side}-input`);
        if (!fileInput.files[0]) return;

        const status = document.getElementById(`status-${side}`);
        const dropzone = document.getElementById(`dropzone-${side}`);

        dropzone.style.pointerEvents = 'none';
        dropzone.style.borderColor = 'var(--primary)';
        dropzone.style.background = '#f4f9ff';
        status.innerHTML = "<span style='color:var(--primary); font-weight:800;'>Uploaded <i class='fa-solid fa-check'></i></span>";
        
        this.uploadState[side] = true;

        if (this.uploadState.front && this.uploadState.back) {
            this.processDualUpload();
        }
    }

    processDualUpload() {
        const scannerFront = document.getElementById('scanner-front');
        const scannerBack = document.getElementById('scanner-back');
        const statusFront = document.getElementById('status-front');
        const statusBack = document.getElementById('status-back');
        const autofillSection = document.getElementById('autofill-section');

        statusFront.innerHTML = "<strong>Scanning Document...</strong>";
        statusBack.innerHTML = "<strong>Scanning Document...</strong>";
        
        scannerFront.style.display = 'block';
        scannerBack.style.display = 'block';
        scannerFront.style.animation = 'scanEffect 1.5s linear infinite';
        scannerBack.style.animation = 'scanEffect 1.5s linear infinite';

        setTimeout(() => {
            scannerFront.style.display = 'none';
            scannerBack.style.display = 'none';
            statusFront.innerHTML = "<span style='color:var(--accent-new); font-weight:800;'><i class='fa-solid fa-circle-check'></i> Verified</span>";
            statusBack.innerHTML = "<span style='color:var(--accent-new); font-weight:800;'><i class='fa-solid fa-circle-check'></i> Verified</span>";
            
            autofillSection.style.display = 'block';
            
            document.getElementById('af-name').value = "Muhammad Ali";
            document.getElementById('af-cnic').value = "61101-1234567-1";
            document.getElementById('af-address').value = "House 14, Street 2, F-8/4, Islamabad, Pakistan";
            
        }, 2000);
    }

    renderSellerDashboard() {
        const html = `
            ${this.renderNavbar()}
            <div class="container fade-in">
                <header class="dashboard-header">
                    <div class="flex justify-between items-center">
                        <div class="dashboard-profile">
                            <div class="profile-avatar">${this.state.userName ? this.state.userName.charAt(0).toUpperCase() : 'S'}</div>
                            <div>
                                <h1 class="dashboard-welcome">Welcome ${this.state.userName || 'Seller'} to Pak Auctions</h1>
                                <p style="color:var(--text-muted); font-weight:500;">Seller Account • Verified</p>
                            </div>
                        </div>
                        <button class="btn-bid" style="width:auto; margin:0; padding:1rem 2rem; background:linear-gradient(135deg, var(--primary), #6d28d9);" onclick="app.renderAddListing()">
                            <i class="fa-solid fa-plus mr-2"></i> Add New Listing
                        </button>
                    </div>

                    <div class="dashboard-stats">
                        <div class="stat-card">
                            <div class="stat-value">0</div>
                            <div class="stat-label">Active Listings</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">0</div>
                            <div class="stat-label">Pending Bids</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value">Rs 0</div>
                            <div class="stat-label">Total Revenue</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-value" style="color:var(--accent-new);">100%</div>
                            <div class="stat-label">Seller Rating</div>
                        </div>
                    </div>
                </header>

                <section class="mt-8">
                    <div class="flex justify-between items-center mb-6">
                        <h2 style="font-size:1.5rem; font-weight:900;">Your Listings</h2>
                    </div>
                    
                    <div class="text-center py-12" style="background:white; border-radius:var(--radius-xl); border:1px dashed #e5e7eb;">
                        <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" alt="Empty" style="width:120px; margin:0 auto 1.5rem; opacity:0.5;">
                        <h3 style="font-size:1.2rem; font-weight:800; color:var(--text-main);">No active listings yet</h3>
                        <p style="color:var(--text-muted); margin-top:0.5rem; margin-bottom:1.5rem;">Start selling your items to thousands of verified buyers.</p>
                        <button class="btn" style="background:white; border:2px solid var(--primary); color:var(--primary); padding:0.8rem 2rem; border-radius:var(--radius-md); font-weight:800; cursor:pointer;" onclick="app.renderAddListing()">Create First Listing</button>
                    </div>
                </section>
            </div>
        `;
        this.setView(html);
    }

    renderTermsAndPolicies() {
        const html = `
            ${this.renderNavbar()}
            <div class="container fade-in py-12">
                <div class="terms-container">
                    <h2 style="font-size:2rem; font-weight:900; margin-bottom:1rem;">Terms and Policies</h2>
                    <p style="color:var(--text-muted); margin-bottom:1.5rem; line-height:1.6;">Before accessing the seller dashboard, please review and accept our platform rules, privacy policy, and marketplace integrity guidelines.</p>
                    
                    <h3 style="font-size:1.2rem; font-weight:800; margin-top:2rem;">1. Website Rules & Marketplace Policies</h3>
                    <p style="color:var(--text-main); margin-top:0.5rem; line-height:1.6;">Sellers are required to provide 100% accurate descriptions and legitimate photos. Any counterfeit, stolen, or misrepresented merchandise is strictly prohibited and will result in immediate permanent suspension without payout.</p>
                    
                    <h3 style="font-size:1.2rem; font-weight:800; margin-top:1.5rem;">2. Privacy Policy</h3>
                    <p style="color:var(--text-main); margin-top:0.5rem; line-height:1.6;">Your verified identity details securely remain with Pak Auctions. By acting as a seller, you consent to buyers securely seeing your verified Seller Name during transactions.</p>
                    
                    <div class="legal-warning">
                        <h4><i class="fa-solid fa-triangle-exclamation mr-2"></i> LEGAL WARNING</h4>
                        <p>If any user attempts fraud, scam, or deception on this platform, legal action may be taken including FIR registration in the user's local police station.</p>
                    </div>

                    <div style="margin-top:2rem;">
                        <label class="terms-checkbox">
                            <input type="checkbox" id="check-agree"> 
                            <span style="font-weight:600; font-size:1.1rem; color:var(--text-main);">I agree to the Terms and Policies</span>
                        </label>
                        <label class="terms-checkbox">
                            <input type="checkbox" id="check-legal"> 
                            <span style="font-weight:600; font-size:1.1rem; color:var(--text-main);">I understand the legal consequences of fraudulent activity</span>
                        </label>
                    </div>

                    <button class="btn-bid" style="margin-top:2rem; padding:1.2rem;" onclick="
                        if(document.getElementById('check-agree').checked && document.getElementById('check-legal').checked) {
                            app.renderSellerDashboard();
                        } else {
                            alert('You must check both boxes to acknowledge our policies before continuing.');
                        }
                    ">Acknowledge & Enter Dashboard <i class="fa-solid fa-check ml-2"></i></button>
                </div>
            </div>
        `;
        this.setView(html);
    }

    renderAddListing() {
        const html = `
            ${this.renderNavbar()}
            <div class="container fade-in py-12">
                <div class="add-listing-form">
                    <h2 style="font-size:2rem; font-weight:900; margin-bottom:1.5rem;">Add New Product Listing</h2>
                    
                    <div class="form-group">
                        <label class="form-label">Product Name</label>
                        <input type="text" id="add-title" class="form-input" placeholder="e.g. Vintage Rolex Submariner" required>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label class="form-label">Category</label>
                            <select id="add-category" class="form-input" style="cursor:pointer;" required>
                                <option value="Cars">Cars</option>
                                <option value="Properties">Properties</option>
                                <option value="Laptops">Laptops</option>
                                <option value="Mobiles">Mobiles</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Unique/Antique Items">Unique/Antique Items</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label class="form-label">Starting Price (PKR)</label>
                            <input type="number" id="add-price" class="form-input" placeholder="e.g. 50000" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="form-label">Detailed Description</label>
                        <textarea id="add-desc" class="form-input" rows="4" placeholder="Describe condition, history, technical specs..." required></textarea>
                    </div>

                    <div style="margin-top:2rem; margin-bottom:1rem;">
                        <label class="form-label mb-2 block">Upload Product Images (Recommended 6-10 images from all angles)</label>
                        <div class="image-upload-grid">
                            <div class="img-slot" onclick="alert('File Picker Opened')">
                                <i class="fa-solid fa-camera mb-2 text-xl"></i>
                                Main Image (Front)
                            </div>
                            <div class="img-slot" onclick="alert('File Picker Opened')">
                                <i class="fa-solid fa-plus mb-2 text-xl"></i> Add Side Angle
                            </div>
                            <div class="img-slot" onclick="alert('File Picker Opened')">
                                <i class="fa-solid fa-plus mb-2 text-xl"></i> Add Back Angle
                            </div>
                            <div class="img-slot" onclick="alert('File Picker Opened')">
                                <i class="fa-solid fa-plus mb-2 text-xl"></i> Add Top View
                            </div>
                            <div class="img-slot" onclick="alert('File Picker Opened')">
                                <i class="fa-solid fa-plus mb-2 text-xl"></i> Add Detail/Macro
                            </div>
                            <div class="img-slot" onclick="alert('File Picker Opened')">
                                <i class="fa-solid fa-plus mb-2 text-xl"></i> Add More (Optional)
                            </div>
                        </div>
                    </div>

                    <div class="form-group" style="margin-top:1.5rem;">
                        <label class="form-label">Upload Product Video (Optional but highly recommended)</label>
                        <div class="img-slot" style="width:100%; height:auto; padding:1.5rem;" onclick="alert('Video File Picker Opened')">
                            <i class="fa-solid fa-video mb-2 text-2xl text-purple-600"></i>
                            <span class="text-purple-600">Click to Browse Video File (Max 50MB)</span>
                        </div>
                    </div>

                    <button class="btn-bid" style="margin-top:2rem;" onclick="
                        const title = document.getElementById('add-title').value;
                        const category = document.getElementById('add-category').value;
                        const price = parseInt(document.getElementById('add-price').value) || 0;
                        
                        if(title && price > 0) {
                            app.state.auctions.unshift({
                                id: Date.now(),
                                sellerName: app.state.userName || 'Verified Seller',
                                category: category,
                                title: title,
                                image: 'https://images.unsplash.com/photo-1572013343866-2f161f365942?w=600',
                                gallery: [
                                    'https://images.unsplash.com/photo-1572013343866-2f161f365942?w=600',
                                    'https://images.unsplash.com/photo-1572013343866-2f161f365942?w=600',
                                    'https://images.unsplash.com/photo-1572013343866-2f161f365942?w=600',
                                    'https://images.unsplash.com/photo-1572013343866-2f161f365942?w=600',
                                    'https://images.unsplash.com/photo-1572013343866-2f161f365942?w=600',
                                    'https://images.unsplash.com/photo-1572013343866-2f161f365942?w=600'
                                ],
                                price: price,
                                rating: 5.0,
                                bids: 0,
                                location: 'Pakistan',
                                badge: 'NEW'
                            });
                            app.renderMarketplace();
                            alert('Product successfully listed to the marketplace!');
                        } else {
                            alert('Please fill out the essential product details.');
                        }
                    ">Publish Listing to Marketplace <i class="fa-solid fa-rocket ml-2"></i></button>

                </div>
            </div>
        `;
        this.setView(html);
    }

    setState(key, value) {
        this.state[key] = value;
    }

    renderNavbar() {
        return `
            <nav class="navbar">
                <div class="container flex justify-between items-center">
                    <div class="brand flex items-center gap-2" onclick="app.renderWelcomeView()" style="cursor:pointer; font-weight:800; font-size:1.4rem;">
                        <span style="background:#311542; color:white; width:35px; height:35px; display:flex; align-items:center; justify-content:center; border-radius:8px;">PA</span>
                        <span>Pak<span style="color:#311542">Auctions</span></span>
                    </div>
                    <div class="flex items-center gap-6">
                        <a href="#" class="text-sm font-bold" onclick="app.renderMarketplace()">Marketplace</a>
                        <button class="btn" style="background:#311542; color:white; padding:0.5rem 1.5rem; border-radius:10px; font-weight:700;" onclick="${this.state.role === 'seller' ? 'app.renderSellerDashboard()' : 'app.renderWatchlist()'}">
                            ${this.state.role ? (this.state.role === 'seller' ? 'Dashboard' : 'Watchlist') : 'Sign In'}
                        </button>
                        <div class="relative" style="cursor:pointer;" onclick="app.toggleNotif()">
                            <i class="fa-regular fa-bell text-xl"></i>
                            <span class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">${this.state.notifications.length}</span>
                            
                            <div class="notif-dropdown ${this.state.showNotif ? 'show' : ''}" id="notif-panel">
                                <div class="notif-header">
                                    <span>Notifications</span>
                                    <span style="color:var(--primary); font-size:0.8rem;">Mark all read</span>
                                </div>
                                ${this.state.notifications.map(n => `
                                    <div class="notif-item">
                                        <div class="notif-msg">${n.msg}</div>
                                        <div class="notif-time">${n.time}</div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }

    createProductCard(item) {
        const isWatchlisted = this.state.watchlist.includes(item.id);
        return `
            <div class="card fade-in">
                <button class="heart-btn ${isWatchlisted ? 'active' : ''}" onclick="event.stopPropagation(); app.toggleWatchlist(${item.id})">
                    <i class="fa-${isWatchlisted ? 'solid' : 'regular'} fa-heart"></i>
                </button>
                <div class="card-img-wrapper">
                    <img src="${item.image}" alt="${item.title}">
                    <div class="badge badge-left">${item.category}</div>
                    <div class="badge badge-right" style="background: ${item.badge === 'HOT' ? '#f97316' : '#10b981'};">${item.badge}</div>
                </div>
                <div class="card-body">
                    <div class="card-meta">
                        <span><i class="fa-solid fa-location-dot"></i> ${item.location}</span>
                        <span style="float:right; color:var(--text-muted); font-size:0.8rem;"><i class="fa-solid fa-user"></i> ${item.sellerName || 'Verified Seller'}</span>
                    </div>
                    <div class="seller-rating mt-1">
                        <i class="fa-solid fa-star"></i> ${item.rating || '4.5'} 
                        <span class="reviews-cnt">(${item.reviews || '12'} Reviews)</span>
                    </div>
                    <h3 class="card-title" style="margin-top:0.5rem;">${item.title}</h3>
                    <div class="price-box">
                        <span class="price-label">Current Bid</span>
                        <div class="price-value">${this.formatCurr(item.price)}</div>
                    </div>
                    <div class="card-footer">
                        <div class="rating">
                            ${Array(5).fill('<i class="fa-solid fa-star"></i>').join('')}
                            <span style="color:#1a1a1a; font-weight:700; margin-left:5px;">${item.rating}</span>
                        </div>
                        <div class="bid-count">(${item.bids || 0} Bids)</div>
                    </div>
                    <button class="btn-bid" onclick="app.renderProductDetails(${item.id})">Place Bid <i class="fa-solid fa-chevron-right" style="margin-left:5px;"></i></button>
                </div>
            </div>
        `;
    }
    
    toggleSidebarDropdown(contentId, iconId) {
        const content = document.getElementById(contentId);
        const icon = document.getElementById(iconId);
        if(content.classList.contains('collapsed')) {
            content.classList.remove('collapsed');
            icon.classList.remove('collapsed');
        } else {
            content.classList.add('collapsed');
            icon.classList.add('collapsed');
        }
    }

    renderNavbarV5() {
        return `
            <nav class="v5-navbar">
                <div class="v5-nav-inner">
                    <div class="v5-brand flex items-center gap-2" onclick="app.renderWelcomeView()" style="cursor:pointer;">
                        <span class="v5-logo-box">PA</span>
                        <strong>PakAuctions</strong>
                    </div>
                    <div class="v5-nav-links">
                        ${this.state.isAdmin ? `<a href="#" onclick="app.renderAdminDashboard()" style="color:var(--yellow); font-weight:800;"><i class="fa-solid fa-shield-halved mr-1"></i> Admin Panel</a>` : ''}
                        <a href="#" onclick="app.renderMarketplace()">Marketplace</a>
                        <a href="#" onclick="app.renderAboutUs()">About Us</a>
                        <a href="#" onclick="app.renderIslamicPerspective()">Islamic Perspective</a>
                        <a href="#" onclick="app.renderHowItWorks()">How It Works</a>
                        <a href="#" onclick="app.renderWatchlist()">Wishlist</a>
                        <a href="#" onclick="app.renderWelcomeView()">Logout</a>
                    </div>
                </div>
            </nav>
            <div class="v5-welcome-bar">
                Welcome <strong>Hamid Mehmood</strong> to PakAuctions
            </div>
        `;
    }

    renderFooterV5() {
        return `
            <footer class="v5-footer" style="position:relative;">
                <div style="position: absolute; left: 4rem; bottom: 0.5rem; font-size:0.75rem; color:#94a3b8;">Trusted & Verified</div>
                <div class="v5-footer-links">
                    <a href="#" onclick="app.renderAboutUs()">About Us</a>
                    <a href="#" onclick="app.renderIslamicPerspective()">Islamic Perspective</a>
                    <a href="#" onclick="app.renderHowItWorks()">How It Works</a>
                    <a href="#">Privacy</a>
                </div>
                <div class="v5-footer-payments" style="transform: translateY(-5px);">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" alt="MasterCard">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo.svg" alt="Amex">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Discover_Card_logo.svg/1024px-Discover_Card_logo.svg.png" alt="Discover">
                </div>
                <div>© 2024 PakAuctions • Designed for Hamid Mehmood</div>
            </footer>
        `;
    }

    createProductCardV5(item) {
        return `
            <div class="v5-card fade-in" onclick="app.renderProductDetails(${item.id})">
                <div class="v5-card-img-wrapper">
                    <img src="${item.image}" alt="${item.title}" class="v5-card-img">
                </div>
                <div class="v5-card-body">
                    <h3 class="v5-item-title">${item.title}</h3>
                    <div class="v5-card-bid-details">
                        <span class="v5-bid-amount-new">PKR ${item.price.toLocaleString()}</span>
                    </div>
                    <button class="v5-bid-now-btn">Place Bid Now</button>
                </div>
            </div>
        `;
    }

    renderMarketplace() {
        const filtered = this.getFilteredAuctions();
        
        let gridHtml = '';
        if (filtered.length > 0) {
            gridHtml = filtered.map(item => {
                return `
                <div class="product-card" onclick="app.openProductDetails(${item.id})">
                    <div class="verified-badge"><i class="fa-solid fa-check-circle"></i> Verified</div>
                    <img src="${item.image}" alt="${item.title}" class="product-image">
                    <div class="card-details">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <h3 class="item-title">${item.title}</h3>
                            <div style="color: var(--accent-gold); font-size: 0.9rem;">
                                <i class="fa-solid fa-star"></i> ${item.rating || '4.5'}
                            </div>
                        </div>
                        <p class="item-meta">${item.category} • ${item.condition || 'Used'} • ${item.location || 'Pakistan'}</p>
                        <div class="current-bid">${this.formatCurr(item.price)}</div>
                        <button class="bid-button" onclick="event.stopPropagation(); app.openProductDetails(${item.id})"><i class="fa-solid fa-gavel"></i> Place Bid Now</button>
                    </div>
                </div>
                `;
            }).join('');
        } else {
            gridHtml = '<div style="color:white; text-align:center; grid-column: 1/-1;">No active auctions found.</div>';
        }

        const html = `
            ${this.renderNavbarV5()}
            
            <div class="marketplace-container">
                <h2 style="color: #0a0e1a; text-align: center;">All Active Auctions</h2>
                <div class="product-grid" id="productGrid">
                    ${gridHtml}
                </div>
            </div>

            <div id="productModal" class="modal">
                <div class="modal-content">
                    <span onclick="app.closeModal()" style="float:right; cursor:pointer; font-size: 2rem;">&times;</span>
                    <div id="modalBody">
                    </div>
                </div>
            </div>

            ${this.renderFooterV5()}
        `;
        this.setView(html);
    }

    openProductDetails(id) {
        const product = this.state.auctions.find(a => a.id === id);
        if(!product) return;
        const modal = document.getElementById('productModal');
        const body = document.getElementById('modalBody');
        
        clearInterval(this.timerInterval);
        clearInterval(this.bidInterval);

        const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
        const legalStat = product.legalFlag === false ? 'Pending Legal Review' : '100% Clear / Verified';

        body.innerHTML = `
            <div id="detailsSection">
                <img src="${product.image}" id="activeDisplay" style="width:100%; height:350px; object-fit:contain; border-radius:15px; background:#1e293b;">
                <div class="gallery-row" style="display:flex; gap:10px; margin-top:15px; overflow-x:auto;">
                    ${gallery.map(img => `<img src="${img}" class="thumb-box" style="width:80px; height:80px; object-fit:cover; border-radius:8px; cursor:pointer;" onclick="document.getElementById('activeDisplay').src='${img}'">`).join('')}
                </div>
                
                <h2 style="color:#d4af37; margin-top:20px;">${product.title}</h2>
                <div style="background:rgba(255,255,255,0.05); padding:15px; border-radius:10px; margin-top:10px;">
                    <p><strong>Condition:</strong> ${product.condition || 'Mint'} | <strong>Location:</strong> ${product.location || 'Pakistan'}</p>
                    <p><strong>Parts:</strong> ${product.partsInfo || 'All original factory parts'}</p>
                    <p><strong>Legal Status:</strong> <span style="color:#2ecc71;">${legalStat}</span></p>
                    <p>${product.description}</p>
                </div>
                
                <div style="display:flex; gap:15px; margin-top:25px;">
                    <button onclick="app.activateLiveAuction(${product.id})" style="flex:1; background:#d4af37; color:black; padding:15px; border:none; border-radius:10px; font-weight:bold; cursor:pointer;">🔥 SEE WATCH LIVE</button>
                    <button onclick="app.showPayments('${this.formatCurr(product.price)}')" style="flex:1; background:transparent; border:2px solid #d4af37; color:#d4af37; padding:15px; border-radius:10px; font-weight:bold; cursor:pointer;">PLACE BID NOW</button>
                </div>
            </div>

            <div id="liveAuctionSection" style="display:none; text-align:center;">
                <h2 style="color:#d4af37;">🔴 LIVE AUCTION HALL</h2>
                <div id="timer-display">00:00:00</div>
                <div id="live-bid-log" style="height:250px; overflow-y:auto; text-align:left; padding:10px; background:#0f172a; border-radius:10px;">
                </div>
                <button onclick="app.showPayments('${this.formatCurr(product.price)}')" style="width:100%; background:#d4af37; color:black; padding:15px; border:none; border-radius:10px; font-weight:bold; cursor:pointer; margin-top:15px;">⚡ PLACE BID NOW (LIVE)</button>
                <button onclick="app.closeLive()" style="margin-top:20px; color:white; background:none; border:1px solid #ffffff; padding:8px 20px; cursor:pointer; opacity:0.6;">Back to Details</button>
            </div>

            <div id="paymentSection" style="display:none;">
                <div class="price-display-box">
                    <small style="color:white;">Your Current Bid Amount</small>
                    <h4 id="displayBidPrice">PKR 0</h4>
                </div>

                <h3 style="color:#d4af37; text-align:center;">Select Payment Method</h3>
                <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:10px; margin-top:15px;">
                    <div class="pay-opt" onclick="app.showPayForm('card')" style="background:#1c2237; padding:10px; text-align:center; border-radius:8px; cursor:pointer; border:1px solid #2d344b;">💳 Credit/Debit Card</div>
                    <div class="pay-opt" onclick="app.showPayForm('mobile')" style="background:#1c2237; padding:10px; text-align:center; border-radius:8px; cursor:pointer; border:1px solid #2d344b;">📱 Jazz/EasyPaisa</div>
                    <div class="pay-opt" onclick="app.showPayForm('bank')" style="background:#1c2237; padding:10px; text-align:center; border-radius:8px; cursor:pointer; border:1px solid #2d344b;">🏦 Bank Transfer</div>
                    <div class="pay-opt" onclick="app.showPayForm('paypal')" style="background:#1c2237; padding:10px; text-align:center; border-radius:8px; cursor:pointer; border:1px solid #2d344b;">🅿️ PayPal</div>
                </div>

                <div id="form-card" class="payment-form-box" style="display:none; margin-top:20px;">
                    <h4>Card Details</h4>
                    <input type="text" placeholder="Card Number (Numbers Only)" class="pay-input" 
                           oninput="this.value = this.value.replace(/[^0-9]/g, '')" maxlength="16">
                    <div style="display:flex; gap:10px;">
                        <input type="text" placeholder="MM/YY" class="pay-input" maxlength="5">
                        <input type="text" placeholder="CVV (4 Digits)" class="pay-input" 
                               oninput="this.value = this.value.replace(/[^0-9]/g, '')" maxlength="4">
                    </div>
                    <input type="text" placeholder="Card Holder Name" class="pay-input" 
                           oninput="this.value = this.value.replace(/[0-9]/g, '')">
                    <button class="submit-pay-btn" onclick="app.processPayment()">Confirm Bid</button>
                </div>

                <div id="form-mobile" class="payment-form-box" style="display:none; margin-top:20px;">
                    <div class="info-box" style="background:rgba(212,175,55,0.1); padding:10px; border-left:4px solid #d4af37;">
                        Please transfer to: <strong style="color:#d4af37;">03256455101</strong> (Official Account)
                    </div>
                    <p style="font-size:0.8rem; margin:10px 0;">Upload your payment screenshot below:</p>
                    <input type="file" class="pay-input" accept="image/*">
                    <button class="submit-pay-btn" onclick="app.processPayment()">Upload & Submit Bid</button>
                </div>

                <div id="form-bank" class="payment-form-box" style="display:none; margin-top:20px;">
                    <div class="info-box" style="background:rgba(212,175,55,0.1); padding:10px; border-left:4px solid #d4af37;">
                        Bank: <strong>Habib Bank Ltd</strong><br>
                        A/C: <strong>1234-5678-9012-34</strong><br>
                        Title: <strong>PakAuctions Official</strong>
                    </div>
                    <p style="font-size:0.8rem; margin:10px 0;">Upload your bank transfer receipt:</p>
                    <input type="file" class="pay-input" accept="image/*">
                    <button class="submit-pay-btn" onclick="app.processPayment()">Submit Receipt</button>
                </div>

                <div id="form-paypal" class="payment-form-box" style="display:none; margin-top:20px;">
                    <h4>PayPal Email</h4>
                    <input type="email" placeholder="paypal@example.com" class="pay-input">
                    <button class="submit-pay-btn" onclick="app.processPayment()">Proceed to PayPal</button>
                </div>

                <button onclick="app.backFromPay()" style="width:100%; margin-top:15px; background:none; color:white; border:1px solid white; padding:10px; cursor:pointer; border-radius:5px;">Cancel</button>
            </div>
        `;
        modal.style.display = 'block';
    }

    activateLiveAuction(productId) {
        document.getElementById('detailsSection').style.display = 'none';
        document.getElementById('liveAuctionSection').style.display = 'block';
        if(document.getElementById('paymentSection')) document.getElementById('paymentSection').style.display = 'none';
        
        // Inject Live Q&A Chat Box dynamically
        const liveHall = document.getElementById('liveAuctionSection');
        if(!document.getElementById('liveChatBox')) {
            const chatHTML = `
                <div id="liveChatBox" class="live-chat-area">
                    <h4 style="color:#0a0e1a; margin-top:0;">💬 Live Q&A</h4>
                    <div id="chatScroll" class="chat-scroll"></div>
                    <div class="chat-controls">
                        <select id="chatTarget" style="padding:5px; border-radius:5px; border:1px solid #0a0e1a;">
                            <option value="all">To Everyone</option>
                            <option value="seller">Only to Seller</option>
                        </select>
                        <input type="text" id="chatInput" class="chat-input" placeholder="Ask a question..." onkeydown="if(event.key === 'Enter') app.postComment()">
                        <button class="chat-send-btn" onclick="app.postComment()">Send</button>
                    </div>
                </div>
            `;
            liveHall.insertAdjacentHTML('beforeend', chatHTML);
        }

        let timeLeft = 10000;
        this.timerInterval = setInterval(() => {
            timeLeft--;
            let h = Math.floor(timeLeft / 3600);
            let m = Math.floor((timeLeft % 3600) / 60);
            let s = timeLeft % 60;
            const timerObj = document.getElementById('timer-display');
            if(timerObj) {
                timerObj.innerText = `${h.toString().padStart(2,'0')}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
            }
            if(timeLeft <= 0) clearInterval(this.timerInterval);
        }, 1000);

        const names = ["Ahmed", "Saira", "Zubair", "Hamza", "Fatima", "Bilal"];
        this.bidInterval = setInterval(() => {
            const log = document.getElementById('live-bid-log');
            if(!log) return;
            const name = names[Math.floor(Math.random() * names.length)];
            const amount = Math.floor(Math.random() * 5000) * 1000 + 100000;
            
            const bidDiv = document.createElement('div');
            bidDiv.className = 'bid-item';
            bidDiv.innerHTML = `🟢 <strong>${name}</strong> just placed a bid of <strong>PKR ${amount.toLocaleString()}</strong>`;
            log.prepend(bidDiv);
        }, 4000);
    }

    postComment() {
        const input = document.getElementById('chatInput');
        const target = document.getElementById('chatTarget').value;
        const scroll = document.getElementById('chatScroll');

        if(!input || !input.value.trim()) return;

        const msg = {
            text: input.value.trim(),
            isPrivate: target === 'seller',
            user: this.state.userName || "Hamid (Buyer)"
        };

        const bubble = document.createElement('div');
        bubble.className = `comment-bubble ${msg.isPrivate ? 'priv-msg' : 'pub-msg'}`;
        bubble.innerHTML = `<strong>${msg.user}:</strong> ${msg.isPrivate ? '[Private to Seller] ' : ''}${msg.text}`;
        
        scroll.appendChild(bubble);
        scroll.scrollTop = scroll.scrollHeight;
        input.value = '';

        // Auto-reply simulation if private message
        if(msg.isPrivate) {
            setTimeout(() => {
                const reply = document.createElement('div');
                reply.className = 'comment-bubble pub-msg';
                reply.style.borderLeft = '4px solid #d4af37';
                reply.innerHTML = `<strong>Seller:</strong> جی حمید بھائی، اس پروڈکٹ کے تمام کاغذات اور وارنٹی موجود ہے۔`;
                scroll.appendChild(reply);
                scroll.scrollTop = scroll.scrollHeight;
            }, 3000);
        }
    }

    showPayForm(type) {
        document.querySelectorAll('.payment-form-box').forEach(f => f.style.display = 'none');
        const form = document.getElementById('form-' + type);
        if(form) form.style.display = 'block';
    }

    showPayments(bidPrice) {
        document.getElementById('detailsSection').style.display = 'none';
        document.getElementById('paymentSection').style.display = 'block';
        document.getElementById('displayBidPrice').innerText = "You are bidding: " + bidPrice;
        if(document.getElementById('liveAuctionSection')) document.getElementById('liveAuctionSection').style.display = 'none';
        clearInterval(this.timerInterval);
        clearInterval(this.bidInterval);
    }

    backFromPay() {
        document.getElementById('paymentSection').style.display = 'none';
        if(document.getElementById('detailsSection')) document.getElementById('detailsSection').style.display = 'block';
    }

    closeLive() {
        if(document.getElementById('detailsSection')) document.getElementById('detailsSection').style.display = 'block';
        if(document.getElementById('liveAuctionSection')) document.getElementById('liveAuctionSection').style.display = 'none';
        if(document.getElementById('paymentSection')) document.getElementById('paymentSection').style.display = 'none';
        clearInterval(this.timerInterval);
        clearInterval(this.bidInterval);
    }

    processPayment() {
        alert("Verification in progress. Your bid will be live after admin approval.");
        this.closeModal();
    }

    closeModal() {
        document.getElementById('productModal').style.display = "none";
        this.closeLive(); 
    }

    renderBuyerRegistration() {
        if (this.state.isAdmin) {
            this.renderMarketplace();
            return;
        }
        const html = `
            ${this.renderNavbarV5()}
            <div class="container py-12">
                <div class="buyer-registration-card fade-in">
                    <h2 style="font-size:2rem; font-weight:900; margin-bottom:1rem;">Let's get Started!</h2>
                    <p style="color:var(--text-muted); margin-bottom:2rem;">Please enter your name to personalize your buying experience.</p>
                    
                    <div class="form-group" style="text-align:left;">
                        <label class="form-label">Full Name</label>
                        <input type="text" id="buyer-name-input" class="form-input" placeholder="Enter your full name">
                    </div>
                    
                    <button class="btn-bid" style="margin-top:1rem;" onclick="
                        const name = document.getElementById('buyer-name-input').value;
                        if(name.trim() !== '') {
                            app.setState('userName', name);
                            app.renderMarketplace();
                        } else {
                            alert('Please enter your name.');
                        }
                    ">Continue to Marketplace <i class="fa-solid fa-arrow-right ml-2"></i></button>
                </div>
            </div>
        `;
        this.setView(html);
    }

    renderProductDetails(id) {
        const product = this.state.auctions.find(a => a.id === id);
        if(!product) return;

        const gallery = product.gallery || [product.image];

        const html = `
            ${this.renderNavbarV5()}
            <div class="container fade-in py-12">
                <div class="v5-details-container">
                    
                    <div class="v5-gallery-section">
                        <div class="v5-gallery-main">
                            <img src="${product.image}" id="v5-main-img" alt="${product.title}">
                        </div>
                        <div class="v5-gallery-thumbs">
                            ${gallery.map((img, idx) => `
                                <div class="v5-thumb ${idx === 0 ? 'active' : ''}" onclick="document.getElementById('v5-main-img').src = '${img}'; document.querySelectorAll('.v5-thumb').forEach(t => t.classList.remove('active')); this.classList.add('active');">
                                    <img src="${img}" alt="Angle ${idx + 1}">
                                </div>
                            `).join('')}
                        </div>

                        <div style="margin-top:2rem;">
                            <h2 style="font-size:2.5rem; font-weight:900; color:#0f172a; margin-bottom:1rem; letter-spacing:-1px;">${product.title}</h2>
                            <div style="display:flex; gap:1.5rem; color:#64748b; font-weight:700; margin-bottom:2rem; align-items:center;">
                                <span><i class="fa-solid fa-location-dot"></i> ${product.location}</span>
                                <span class="v5-divider"></span>
                                <span><i class="fa-solid fa-store"></i> ${product.sellerName}</span>
                                <span class="v5-divider"></span>
                                <span style="color:#ca8a04;"><i class="fa-solid fa-star"></i> ${product.rating || '5.0'}</span>
                            </div>

                            <div class="v5-specs-box">
                                <h3 class="v5-specs-title"><i class="fa-solid fa-microchip mr-2"></i> Technical Specifications</h3>
                                <div class="v5-specs-grid">
                                    <div class="v5-spec-item"><span class="lbl">Condition</span><span class="val">${product.condition || 'Mint'}</span></div>
                                    <div class="v5-spec-item"><span class="lbl">Mechanism/Engine</span><span class="val">${product.engine || 'Original Factory'}</span></div>
                                    <div class="v5-spec-item"><span class="lbl">Dimensions</span><span class="val">${product.length || 'Standard'}</span></div>
                                    <div class="v5-spec-item"><span class="lbl">Weight</span><span class="val">${product.weight || 'N/A'}</span></div>
                                    <div class="v5-spec-item"><span class="lbl">Legal Status</span><span class="val ${product.legalFlag ? 'status-clear' : ''}">${product.category === 'Properties' ? (product.legalFlag ? 'CLEAR / VERIFIED' : 'PENDING CASE') : 'VERIFIED'}</span></div>
                                </div>
                            </div>

                            <div style="margin-top:3rem;">
                                <h3 style="font-size:1.5rem; font-weight:800; color:#1e293b; margin-bottom:1.2rem;">Detailed Description</h3>
                                <div class="v5-description-text">
                                    <p>${product.description}</p>
                                    <p style="margin-top:1rem;">This asset has been personally inspected by PakAuctions field agents. All documentation is in order and available for review upon successful bid completion. No hidden defects reported.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="v5-details-sidebar">
                        <div class="v5-bid-header">
                            <div class="v5-price-label">Current Highest Bid</div>
                            <div class="v5-price-value">${this.formatCurr(product.price)}</div>
                            <p style="color:#64748b; margin-top:0.5rem; font-weight:600;">Last bid by <strong>@Zahid_R</strong></p>
                        </div>

                        <div style="background:#fffbeb; border:1px solid #fef3c7; padding:1.5rem; border-radius:16px; margin-bottom:2rem; text-align:center;">
                            <div style="font-size:0.8rem; font-weight:800; color:#92400e; text-transform:uppercase; letter-spacing:1px; margin-bottom:0.5rem;">Time Remaining</div>
                            <div style="font-size:1.8rem; font-weight:900; color:#ca8a04;"><i class="fa-regular fa-clock mr-2"></i> 02:45:12</div>
                        </div>

                        <div class="v5-bid-input-group">
                            <label>Place Your Bid (PKR)</label>
                            <input type="number" class="v5-bid-input" value="${product.price + 50000}" step="1000">
                        </div>

                        <button class="v5-primary-btn" onclick="app.handleBid(${product.id})">
                            <i class="fa-solid fa-gavel"></i> Confirm My Bid
                        </button>

                        <button class="v5-secondary-btn" onclick="app.openChat('${product.sellerName}')">
                            <i class="fa-solid fa-comments mr-2"></i> Message Seller
                        </button>

                        <div style="margin-top:2.5rem; padding-top:2rem; border-top:1px solid #f1f5f9;">
                            <h4 style="font-weight:800; color:#1e293b; margin-bottom:1rem; display:flex; justify-content:space-between;">
                                Global Bidding Feed
                                <span style="font-size:0.75rem; color:var(--primary);">LIVE <i class="fa-solid fa-circle text-red-500 animate-pulse"></i></span>
                            </h4>
                            <div style="display:flex; flex-direction:column; gap:1rem;">
                                <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:0.8rem 1rem; border-radius:12px;">
                                    <span style="font-weight:700; font-size:0.9rem;">@Hamza_99</span>
                                    <span style="font-weight:800; color:var(--primary);">${this.formatCurr(product.price - 20000)}</span>
                                </div>
                                <div style="display:flex; justify-content:space-between; align-items:center; opacity:0.6; padding:0 1rem;">
                                    <span style="font-weight:700; font-size:0.9rem;">@Ali_Khan</span>
                                    <span style="font-weight:800;">${this.formatCurr(product.price - 45000)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            ${this.renderFooterV5()}
        `;
        this.setView(html);
    }

    handleBid(id) {
        const product = this.state.auctions.find(a => a.id === id);
        const bidInput = document.querySelector('.v5-bid-input');
        const amount = parseFloat(bidInput.value);

        if (!product || isNaN(amount)) return;

        // 1. Legal Check
        if (!window.AuctionFeatures.isLegallyApproved(product)) {
            alert("This property is currently under legal review and cannot be bid upon.");
            return;
        }

        if (amount <= product.price) {
            alert("Bid must be higher than current price.");
            return;
        }

        // 2. Anti-Sniping Check
        const extended = window.AuctionFeatures.checkAndExtendTimer(product);
        if (extended) {
            alert("ANTI-SNIPING TRIGGERED: Bid placed in final 2 minutes. Timer has been extended!");
        }

        // 3. Update Bid
        product.price = amount;
        product.bids = (product.bids || 0) + 1;
        product.highestBidder = this.state.userName || "Guest User";

        alert(`Success! Your bid of ${this.formatCurr(amount)} has been placed.`);
        this.renderProductDetails(id);
    }

    toggleFeatured(id) {
        const product = this.state.auctions.find(a => a.id === id);
        if (product) {
            product.isFeatured = !product.isFeatured;
            this.renderAdminDashboard();
        }
    }

    completeEscrow(paymentId) {
        const result = window.AuctionFeatures.releaseEscrow(paymentId, this.state);
        alert(result.message);
        this.renderAdminDashboard();
    }

    toggleWatchlist(id) {
        if(this.state.watchlist.includes(id)) {
            this.state.watchlist = this.state.watchlist.filter(i => i !== id);
        } else {
            this.state.watchlist.push(id);
        }
        // Force refresh based on current view?? 
        // For simplicity in this demo, we'll re-render whatever we are in.
        // Usually we would only re-render the card or component.
        const currentHtml = document.getElementById('app').innerHTML; // Basic trick
        if(currentHtml.includes('Marketplace')) this.renderMarketplace();
        else if(currentHtml.includes('details-view')) this.renderProductDetails(id);
        else this.renderWelcomeView();
    }

    renderWatchlist() {
        const items = this.state.auctions.filter(a => this.state.watchlist.includes(a.id));
        const html = `
            ${this.renderNavbar()}
            <div class="container py-12 fade-in">
                <h1 style="font-size:2.5rem; font-weight:900; margin-bottom:2rem;">My Watchlist</h1>
                ${items.length === 0 ? `
                    <div class="text-center py-24 bg-white rounded-xl border-dashed border-2 border-gray-200">
                        <i class="fa-regular fa-heart text-6xl text-gray-200 mb-4"></i>
                        <h3 style="font-size:1.5rem; font-weight:800;">Your watchlist is empty</h3>
                        <p class="text-gray-500 mt-2">Start adding items you like from the marketplace.</p>
                        <button class="btn-bid mt-6" style="width:auto; padding:1rem 3rem;" onclick="app.renderMarketplace()">Browse Marketplace</button>
                    </div>
                ` : `
                    <div class="product-grid">
                        ${items.map(i => this.createProductCard(i)).join('')}
                    </div>
                `}
            </div>
        `;
        this.setView(html);
    }

    toggleNotif() {
        this.state.showNotif = !this.state.showNotif;
        // Optimization: only re-render the navbar or specific panel
        this.renderNavbar(); // Re-calling renderNavbar and updating manually is cleaner
        const nav = document.querySelector('.navbar');
        if(nav) nav.outerHTML = this.renderNavbar();
    }

    openChat(name) {
        const existing = document.getElementById('chat-box');
        if(existing) existing.remove();

        const html = `
            <div class="chat-window" id="chat-box">
                <div class="chat-header">
                    <div class="flex items-center gap-3">
                        <div class="profile-avatar" style="width:35px; height:35px; font-size:0.9rem;">${name.charAt(0)}</div>
                        <span style="font-weight:800;">${name}</span>
                    </div>
                    <i class="fa-solid fa-xmark cursor-pointer" onclick="document.getElementById('chat-box').remove()"></i>
                </div>
                <div class="chat-messages" id="chat-msgs">
                    <div class="msg received">Hello! I am the seller of this product. How can I help you?</div>
                </div>
                <div class="chat-input-area">
                    <input type="text" id="chat-in" class="form-input" placeholder="Type your message..." onkeydown="if(event.key === 'Enter') app.sendMessage()">
                    <button class="btn-bid" style="width:auto; padding:0 1.5rem;" onclick="app.sendMessage()">
                        <i class="fa-solid fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', html);
    }

    sendMessage() {
        const input = document.getElementById('chat-in');
        const msgs = document.getElementById('chat-msgs');
        if(!input.value) return;

        const sent = `<div class="msg sent">${input.value}</div>`;
        msgs.insertAdjacentHTML('beforeend', sent);
        input.value = '';
        msgs.scrollTop = msgs.scrollHeight;

        // Auto-reply simulation
        setTimeout(() => {
            const reply = `<div class="msg received">Thanks for your message. I'll get back to you shortly!</div>`;
            msgs.insertAdjacentHTML('beforeend', reply);
            msgs.scrollTop = msgs.scrollHeight;
        }, 1500);
    }

    renderAboutUs() {
        const html = `
            ${this.renderNavbarV5()}
            <div class="container py-16 fade-in">
                <div style="max-width:800px; margin:0 auto; background:white; padding:4rem; border-radius:24px; box-shadow:0 20px 50px rgba(0,0,0,0.05); border:1px solid #f1f5f9;">
                    <h1 style="font-size:3rem; font-weight:900; color:#0f172a; margin-bottom:2rem; line-height:1.1;">Welcome to <span style="color:var(--primary);">PakAuctions.</span></h1>
                    <div style="font-size:1.2rem; line-height:1.8; color:#334155; display:flex; flex-direction:column; gap:1.5rem;">
                        <p>Founded by <strong>Hamid Mehmood</strong>, PakAuctions is Pakistan's first premium online auction marketplace.</p>
                        <p>Our mission is to provide a transparent, secure, and exciting platform for buying and selling high-value assets like luxury cars, real estate, and unique collectibles. We use cutting-edge technology to ensure trust and fair bidding for every user.</p>
                        <div style="margin-top:2rem; padding:2rem; background:#f8fafc; border-radius:16px; border-left:4px solid var(--primary);">
                            <h3 style="font-weight:800; color:#1e293b; margin-bottom:0.5rem;">Core Values</h3>
                            <ul style="list-style:none; padding:0; display:grid; grid-template-columns:1fr 1fr; gap:1rem; font-weight:700; color:var(--primary);">
                                <li><i class="fa-solid fa-shield-check mr-2"></i> Verified Security</li>
                                <li><i class="fa-solid fa-gavel mr-2"></i> Fair Bidding</li>
                                <li><i class="fa-solid fa-gem mr-2"></i> Premium Quality</li>
                                <li><i class="fa-solid fa-handshake mr-2"></i> Total Transparency</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            ${this.renderFooterV5()}
        `;
        this.setView(html);
    }

    renderIslamicPerspective() {
        const html = `
            ${this.renderNavbarV5()}
            <div class="container py-16 fade-in">
                <div style="max-width:850px; margin:0 auto; background:white; padding:4rem; border-radius:24px; box-shadow:0 20px 50px rgba(0,0,0,0.05); border:1px solid #f1f5f9;">
                    <div style="display:flex; align-items:center; gap:1rem; margin-bottom:1.5rem;">
                        <i class="fa-solid fa-star-and-crescent style='font-size:2rem; color:#059669;'"></i>
                        <h1 style="font-size:2.5rem; font-weight:900; color:#0f172a;">Islamic Status of Auctions</h1>
                    </div>
                    <h2 style="font-size:1.3rem; font-weight:700; color:#64748b; margin-bottom:2.5rem;">Bai' al-Mazayadah (Mandi/Auction Halal Status)</h2>
                    
                    <div style="background:#f0fdf4; border:1px solid #bbf7d0; padding:2rem; border-radius:16px; margin-bottom:2.5rem;">
                        <h4 style="color:#166534; font-weight:800; margin-bottom:1rem;">Academic Reference</h4>
                        <p style="color:#166534; line-height:1.7;">
                            According to the consensus of Islamic Jurisprudence (Fatwa from Darul Uloom Karachi & Jamia Binoria Town):
                            <br><br>
                            <em>"Auctions are fully permissible (Halal) and are a Sunnah of the Prophet Muhammad (PBUH). It is narrated by Anas ibn Malik (RA) that the Messenger of Allah (PBUH) himself auctioned a rug and a wooden bowl to the highest bidder (Sunan Tirmidhi: 1218, Sunan Abi Dawood: 1641)."</em>
                        </p>
                    </div>

                    <h3 style="font-size:1.5rem; font-weight:800; color:#0f172a; margin-bottom:1.5rem;">Conditions for Halal Auction</h3>
                    <div style="display:grid; gap:1.5rem;">
                        <div style="display:flex; gap:1rem; align-items:start;">
                            <div style="background:#ecfdf5; color:#059669; width:35px; height:35px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:900;">1</div>
                            <div>
                                <h4 style="font-weight:800; color:#1e293b;">No Najsh</h4>
                                <p style="color:#64748b;">It is forbidden for the seller to use fake bidders to artificially increase the price.</p>
                            </div>
                        </div>
                        <div style="display:flex; gap:1rem; align-items:start;">
                            <div style="background:#ecfdf5; color:#059669; width:35px; height:35px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:900;">2</div>
                            <div>
                                <h4 style="font-weight:800; color:#1e293b;">Transparency</h4>
                                <p style="color:#64748b;">All flaws in the product must be clearly stated.</p>
                            </div>
                        </div>
                        <div style="display:flex; gap:1rem; align-items:start;">
                            <div style="background:#ecfdf5; color:#059669; width:35px; height:35px; border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-weight:900;">3</div>
                            <div>
                                <h4 style="font-weight:800; color:#1e293b;">Mutual Consent</h4>
                                <p style="color:#64748b;">The sale is finalized when both parties agree on the final bid.</p>
                            </div>
                        </div>
                    </div>

                    <div style="margin-top:3rem; padding:2rem; background:#0f172a; color:white; border-radius:16px; text-align:center;">
                        <p style="font-size:1.1rem; font-weight:600;">PakAuctions strictly follows these Shariah principles to ensure a blessed and lawful trading environment.</p>
                    </div>
                </div>
            </div>
            ${this.renderFooterV5()}
        `;
        this.setView(html);
    }

    renderHowItWorks() {
        const html = `
            ${this.renderNavbarV5()}
            <div class="container py-16 fade-in">
                <div style="text-align:center; margin-bottom:4rem;">
                    <h1 style="font-size:3rem; font-weight:900; color:#0f172a;">How PakAuctions Works</h1>
                    <p style="font-size:1.2rem; color:#64748b; margin-top:0.5rem;">Four simple steps to buy and sell with confidence.</p>
                </div>
                
                <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:2rem;">
                    <div style="text-align:center; background:white; padding:2rem; border-radius:24px; border:1px solid #f1f5f9; box-shadow:0 10px 30px rgba(0,0,0,0.03);">
                        <i class="fa-solid fa-user-plus" style="font-size:2.5rem; color:var(--primary); margin-bottom:1.5rem;"></i>
                        <h3 style="font-weight:800; margin-bottom:0.8rem;">1. Register</h3>
                        <p style="color:#64748b; font-size:0.9rem;">Create your verified account as a buyer or seller.</p>
                    </div>
                    <div style="text-align:center; background:white; padding:2rem; border-radius:24px; border:1px solid #f1f5f9; box-shadow:0 10px 30px rgba(0,0,0,0.03);">
                        <i class="fa-solid fa-magnifying-glass" style="font-size:2.5rem; color:var(--primary); margin-bottom:1.5rem;"></i>
                        <h3 style="font-weight:800; margin-bottom:0.8rem;">2. Browse</h3>
                        <p style="color:#64748b; font-size:0.9rem;">Find luxury assets and verified listings.</p>
                    </div>
                    <div style="text-align:center; background:white; padding:2rem; border-radius:24px; border:1px solid #f1f5f9; box-shadow:0 10px 30px rgba(0,0,0,0.03);">
                        <i class="fa-solid fa-gavel" style="font-size:2.5rem; color:var(--primary); margin-bottom:1.5rem;"></i>
                        <h3 style="font-weight:800; margin-bottom:0.8rem;">3. Bid</h3>
                        <p style="color:#64748b; font-size:0.9rem;">Place your bids and track real-time updates.</p>
                    </div>
                    <div style="text-align:center; background:white; padding:2rem; border-radius:24px; border:1px solid #f1f5f9; box-shadow:0 10px 30px rgba(0,0,0,0.03);">
                        <i class="fa-solid fa-hand-holding-dollar" style="font-size:2.5rem; color:var(--primary); margin-bottom:1.5rem;"></i>
                        <h3 style="font-weight:800; margin-bottom:0.8rem;">4. Win</h3>
                        <p style="color:#64748b; font-size:0.9rem;">Secure the deal and finalize with mutual consent.</p>
                    </div>
                </div>
            </div>
            ${this.renderFooterV5()}
        `;
        this.setView(html);
    }
}

const app = new App();

