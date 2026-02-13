/* ============================================
   FINVERSE - Page Renderers
   ============================================ */

// ---- Dashboard ----
function renderDashboard() {
    renderCategoryList();
    renderDashboardTransactions();
    animateChart(renderSpendingTrendChart);

    // Animate Stats
    animateValue(document.getElementById('totalBalance'), 0, 24580, 1500);
    animateValue(document.getElementById('monthlyIncome'), 0, 6840, 1500);
    animateValue(document.getElementById('monthlySpending'), 0, 4230, 1500);
    animateValue(document.getElementById('creditScoreDashboard'), 0, 742, 1500);
}

function renderCategoryList() {
    const categories = getCategoryBreakdown();
    const container = document.getElementById('categoryList');
    if (!container) return;

    const colors = {
        food: '#f59e0b', transport: '#3b82f6', shopping: '#ec4899',
        bills: '#8b5cf6', health: '#ef4444', entertainment: '#06b6d4',
        income: '#10b981', other: '#64748b'
    };

    const total = categories.reduce((sum, c) => sum + Math.abs(c.amount), 0);

    container.innerHTML = categories.slice(0, 6).map(cat => `
    <div class="category-item">
      <div class="category-dot" style="background:${colors[cat.name] || '#64748b'}"></div>
      <div class="category-info">
        <div class="category-name">${formatCategoryName(cat.name)}</div>
        <div class="category-bar">
          <div class="category-bar-fill" style="width:${(Math.abs(cat.amount) / total * 100).toFixed(0)}%;background:${colors[cat.name] || '#64748b'}"></div>
        </div>
      </div>
      <div class="category-amount">$${Math.abs(cat.amount).toFixed(0)}</div>
    </div>
  `).join('');
}

function renderDashboardTransactions() {
    const container = document.getElementById('dashboardTransactions');
    if (!container) return;

    container.innerHTML = transactions.slice(0, 5).map(t => `
    <tr>
      <td>${formatDate(t.date)}</td>
      <td>${t.desc}</td>
      <td><span class="tag ${t.category}">${formatCategoryName(t.category)}</span></td>
      <td class="amount ${t.type}">${t.type === 'credit' ? '+' : ''}$${Math.abs(t.amount).toFixed(2)}</td>
      <td><span class="tag" style="background:var(--success-bg);color:var(--success)">Completed</span></td>
    </tr>
  `).join('');
}

// ---- Transactions Page ----
function renderTransactionsPage() {
    renderAllTransactions();
}

function renderAllTransactions(filter = 'all') {
    const container = document.getElementById('allTransactions');
    const countEl = document.getElementById('txnCount');
    if (!container) return;

    let filtered = transactions;
    if (filter === 'debit') filtered = transactions.filter(t => t.type === 'debit');
    if (filter === 'credit') filtered = transactions.filter(t => t.type === 'credit');

    if (countEl) countEl.textContent = `${filtered.length} transactions`;

    container.innerHTML = filtered.map(t => `
    <tr>
      <td>${formatDate(t.date)}</td>
      <td>${t.desc}</td>
      <td><span class="tag ${t.category}">${formatCategoryName(t.category)}</span></td>
      <td class="amount ${t.type}">${t.type === 'credit' ? '+' : '-'}$${Math.abs(t.amount).toFixed(2)}</td>
      <td>${t.type === 'credit' ? 'Income' : 'Expense'}</td>
    </tr>
  `).join('');
}

function filterTransactions(filter) {
    document.querySelectorAll('#page-transactions .card-action-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderAllTransactions(filter);
}

function addTransaction(e) {
    e.preventDefault();
    const date = document.getElementById('txnDate').value;
    const desc = document.getElementById('txnDesc').value;
    const category = document.getElementById('txnCategory').value;
    const amount = parseFloat(document.getElementById('txnAmount').value);

    const isIncome = category === 'income';
    transactions.unshift({
        date, desc, category,
        amount: isIncome ? Math.abs(amount) : -Math.abs(amount),
        type: isIncome ? 'credit' : 'debit'
    });

    document.getElementById('txnDesc').value = '';
    document.getElementById('txnAmount').value = '';
    renderAllPages();
}

function generateDemoData() {
    const cats = ['food', 'transport', 'shopping', 'bills', 'entertainment', 'health'];
    const descs = {
        food: ['McDonalds', 'Trader Joes', 'Pizza Hut', 'Chipotle', 'Subway'],
        transport: ['Uber Ride', 'Lyft', 'Gas Station', 'Parking', 'Bus Pass'],
        shopping: ['Amazon', 'Target', 'Walmart', 'Best Buy', 'IKEA'],
        bills: ['Water Bill', 'Internet', 'Rent', 'Insurance', 'Phone Plan'],
        entertainment: ['Netflix', 'Spotify', 'Movie Theater', 'Concert', 'Game Purchase'],
        health: ['CVS Pharmacy', 'Doctor Visit', 'Gym Fee', 'Dentist', 'Vitamins']
    };

    for (let i = 0; i < 15; i++) {
        const cat = cats[Math.floor(Math.random() * cats.length)];
        const desc = descs[cat][Math.floor(Math.random() * descs[cat].length)];
        const amount = -(Math.random() * 200 + 5).toFixed(2);
        const day = Math.floor(Math.random() * 28) + 1;
        const date = `2026-01-${String(day).padStart(2, '0')}`;

        transactions.push({ date, desc, category: cat, amount: parseFloat(amount), type: 'debit' });
    }

    // Sort by date
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    renderAllPages();
}

function handleCSVUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const lines = e.target.result.split('\n');
        lines.slice(1).forEach(line => {
            const parts = line.split(',');
            if (parts.length >= 4) {
                transactions.push({
                    date: parts[0].trim(),
                    desc: parts[1].trim(),
                    category: parts[2].trim().toLowerCase() || 'other',
                    amount: parseFloat(parts[3]),
                    type: parseFloat(parts[3]) >= 0 ? 'credit' : 'debit'
                });
            }
        });
        transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
        renderAllPages();
    };
    reader.readAsText(file);
}

// ---- Spending Analysis ----
function renderSpendingPage() {
    animateChart(renderMonthlySpendChart);
    animateChart(renderCategoryPieChart);
    renderLifestylePatterns();
}

function renderLifestylePatterns() {
    const container = document.getElementById('lifestylePatterns');
    if (!container) return;

    const patterns = [
        { icon: 'alert', label: 'High Dining Frequency', desc: 'You eat out 4-5 times per week. Consider meal prepping to save $200+/month.', severity: 'warning' },
        { icon: 'check', label: 'Consistent Bill Payments', desc: 'All recurring bills paid on time for 6+ months. Great discipline!', severity: 'success' },
        { icon: 'alert', label: 'Rising Subscription Costs', desc: 'Your subscription total has grown 35% in 3 months. Review active subscriptions.', severity: 'warning' },
        { icon: 'check', label: 'Transportation Efficiency', desc: 'Transport costs are 18% below average for your income bracket.', severity: 'success' },
    ];

    container.innerHTML = patterns.map(p => `
    <div class="alert-card ${p.severity === 'warning' ? 'warning' : 'info'}" style="margin-bottom:12px">
      <div class="alert-icon ${p.severity === 'warning' ? 'warning' : 'info'}">
        ${p.severity === 'warning'
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>'
        }
      </div>
      <div class="alert-content">
        <div class="alert-title">${p.label}</div>
        <div class="alert-desc">${p.desc}</div>
      </div>
    </div>
  `).join('');
}

// ---- Forecast Page ----
function renderForecastPage() {
    animateChart(renderForecastChart);
    renderCategoryForecast();
    renderBudgetRecommendations();
}

function renderCategoryForecast() {
    const container = document.getElementById('categoryForecast');
    if (!container) return;

    const forecasts = [
        { cat: 'Housing & Bills', current: 1180, predicted: 1340, color: '#8b5cf6' },
        { cat: 'Food & Dining', current: 820, predicted: 910, color: '#f59e0b' },
        { cat: 'Shopping', current: 650, predicted: 580, color: '#ec4899' },
        { cat: 'Transport', current: 420, predicted: 460, color: '#3b82f6' },
        { cat: 'Entertainment', current: 280, predicted: 310, color: '#06b6d4' },
        { cat: 'Healthcare', current: 180, predicted: 200, color: '#ef4444' },
    ];

    container.innerHTML = forecasts.map(f => {
        const change = ((f.predicted - f.current) / f.current * 100).toFixed(1);
        const isUp = f.predicted > f.current;
        return `
      <div class="category-item" style="margin-bottom:16px">
        <div class="category-dot" style="background:${f.color}"></div>
        <div class="category-info">
          <div class="category-name">${f.cat}</div>
          <div class="category-bar">
            <div class="category-bar-fill" style="width:${(f.predicted / 1400 * 100).toFixed(0)}%;background:${f.color}"></div>
          </div>
        </div>
        <div style="text-align:right;min-width:80px">
          <div class="category-amount">$${f.predicted}</div>
          <div style="font-size:0.7rem;color:${isUp ? 'var(--danger)' : 'var(--success)'}">${isUp ? '+' : ''}${change}%</div>
        </div>
      </div>
    `;
    }).join('');
}

function renderBudgetRecommendations() {
    const container = document.getElementById('budgetRecs');
    if (!container) return;

    const recs = [
        { title: 'Reduce dining expenses by 15%', desc: 'Cooking at home 3 more days/week could save ~$140/month based on your patterns.', action: 'Set Budget' },
        { title: 'Optimize subscription stack', desc: 'You have 6 active subscriptions. Consolidating could save $25/month.', action: 'Review' },
        { title: 'Emergency fund target', desc: 'You\'re at 72% of recommended 6-month emergency fund. Keep saving $500/month.', action: 'Track' },
        { title: 'Consider high-yield savings', desc: 'Move idle cash to a HYSA to earn ~$45/month in interest at current rates.', action: 'Learn More' },
    ];

    container.innerHTML = recs.map(r => `
    <div style="padding:16px;background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-sm);margin-bottom:12px;">
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;">
        <div>
          <div style="font-size:0.88rem;font-weight:600;margin-bottom:4px;">${r.title}</div>
          <div style="font-size:0.78rem;color:var(--text-secondary);line-height:1.5;">${r.desc}</div>
        </div>
        <button class="card-action-btn" style="white-space:nowrap;">${r.action}</button>
      </div>
    </div>
  `).join('');
}

// ---- Credit Health ----
function renderCreditPage() {
    animateCreditScore(742);
    renderCreditFactors();
    animateChart(renderCreditTrendChart);
    renderRiskIndicators();
}

function animateCreditScore(score) {
    const ring = document.getElementById('creditRingFill');
    const valueEl = document.getElementById('creditScoreValue');
    const ratingEl = document.getElementById('creditRating');
    if (!ring || !valueEl) return;

    const circumference = 2 * Math.PI * 85;
    const offset = circumference - (score / 900) * circumference;

    setTimeout(() => {
        ring.style.strokeDashoffset = offset;
    }, 200);

    // Animate number
    let current = 0;
    const duration = 1500;
    const step = score / (duration / 16);

    function animate() {
        current += step;
        if (current >= score) {
            current = score;
            valueEl.textContent = Math.round(current);
            return;
        }
        valueEl.textContent = Math.round(current);
        requestAnimationFrame(animate);
    }
    animate();

    // Set rating
    let rating = 'Poor', cls = 'poor';
    if (score >= 800) { rating = 'Excellent'; cls = 'excellent'; }
    else if (score >= 700) { rating = 'Good'; cls = 'good'; }
    else if (score >= 600) { rating = 'Fair'; cls = 'fair'; }

    if (ratingEl) {
        ratingEl.textContent = rating;
        ratingEl.className = 'credit-score-rating ' + cls;
    }
}

function renderCreditFactors() {
    const container = document.getElementById('creditFactors');
    if (!container) return;

    const factors = [
        { title: 'Spending Discipline', value: '82%', pct: 82, color: 'var(--accent)' },
        { title: 'Payment Regularity', value: '95%', pct: 95, color: 'var(--success)' },
        { title: 'Debt Signals', value: 'Low', pct: 25, color: 'var(--success)' },
        { title: 'Savings Rate', value: '38%', pct: 38, color: 'var(--info)' },
    ];

    container.innerHTML = factors.map(f => `
    <div class="credit-factor">
      <div class="credit-factor-title">${f.title}</div>
      <div class="credit-factor-value">${f.value}</div>
      <div class="credit-factor-bar">
        <div class="credit-factor-bar-fill" style="width:${f.pct}%;background:${f.color}"></div>
      </div>
    </div>
  `).join('');
}

function renderRiskIndicators() {
    const container = document.getElementById('riskIndicators');
    if (!container) return;

    const indicators = [
        { label: 'Spending Volatility', status: 'Low', color: 'var(--success)', desc: 'Your spending remains consistent month to month.' },
        { label: 'Income Stability', status: 'High', color: 'var(--success)', desc: 'Regular income deposits detected for 12+ months.' },
        { label: 'Credit Utilization', status: 'Moderate', color: 'var(--warning)', desc: 'Consider reducing credit usage below 30% for better scoring.' },
        { label: 'Debt-to-Income Ratio', status: 'Healthy', color: 'var(--success)', desc: 'Your DTI ratio of 28% is within recommended limits.' },
        { label: 'Late Payment Risk', status: 'Very Low', color: 'var(--accent)', desc: 'No missed payments detected in the last 12 months.' },
    ];

    container.innerHTML = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;">
    ${indicators.map(ind => `
      <div style="padding:16px;background:var(--bg-surface);border:1px solid var(--border);border-radius:var(--radius-sm);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <span style="font-size:0.85rem;font-weight:600;">${ind.label}</span>
          <span style="font-size:0.75rem;font-weight:700;color:${ind.color};">${ind.status}</span>
        </div>
        <div style="font-size:0.78rem;color:var(--text-secondary);line-height:1.5;">${ind.desc}</div>
      </div>
    `).join('')}
  </div>`;
}

// ---- Anomaly Detection ----
function renderAnomalyPage() {
    renderAnomalyAlerts();
    animateChart(renderAnomalyChart);
}

function renderAnomalyAlerts() {
    const container = document.getElementById('anomalyAlerts');
    if (!container) return;

    const alerts = [
        {
            severity: 'critical',
            title: 'Suspicious Wire Transfer Detected',
            desc: 'An unusual outgoing wire transfer of $2,500 was flagged on Jan 28. This amount is 340% above your typical transfer pattern.',
            time: '2 days ago',
            amount: '$2,500.00'
        },
        {
            severity: 'warning',
            title: 'Unusual Spending Location',
            desc: 'A transaction of $156.78 at an Amazon merchant differs from your typical purchasing pattern and location history.',
            time: '3 days ago',
            amount: '$156.78'
        },
        {
            severity: 'info',
            title: 'New Recurring Charge Detected',
            desc: 'A new subscription of $15.99/month from Netflix was detected. Verify if this is an authorized recurring charge.',
            time: '4 days ago',
            amount: '$15.99/mo'
        },
    ];

    container.innerHTML = alerts.map(a => `
    <div class="alert-card ${a.severity}">
      <div class="alert-icon ${a.severity}">
        ${a.severity === 'critical'
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
            : a.severity === 'warning'
                ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
                : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
        }
      </div>
      <div class="alert-content">
        <div class="alert-title">${a.title}</div>
        <div class="alert-desc">${a.desc}</div>
        <div class="alert-meta">
          <span>${a.time}</span>
          <span>Amount: ${a.amount}</span>
        </div>
      </div>
      <div class="alert-actions">
        <button class="alert-action-btn">Review</button>
        <button class="alert-action-btn dismiss">Dismiss</button>
      </div>
    </div>
  `).join('');
}

// ---- Financial News ----
function renderNewsPage() {
    renderNewsGrid('all');
}

function renderNewsGrid(filter) {
    const container = document.getElementById('newsGrid');
    if (!container) return;

    const filtered = filter === 'all' ? newsData : newsData.filter(n => n.sentiment === filter);

    const icons = {
        positive: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>',
        negative: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>',
        neutral: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
    };

    container.innerHTML = filtered.map(n => `
    <div class="news-card">
      <div class="news-card-img">
        <div class="news-icon">${icons[n.sentiment]}</div>
        <span class="news-sentiment ${n.sentiment}">${n.sentiment}</span>
      </div>
      <div class="news-card-body">
        <div class="news-card-source">${n.source} &middot; ${n.category}</div>
        <div class="news-card-title">${n.title}</div>
        <div class="news-card-excerpt">${n.excerpt}</div>
        <div class="news-card-footer">
          <span>${n.time}</span>
          <button class="card-action-btn" style="padding:4px 10px;font-size:0.7rem;">Read More</button>
        </div>
      </div>
    </div>
  `).join('');
}

function filterNews(filter) {
    document.querySelectorAll('#page-news .card-action-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderNewsGrid(filter);
}
