/* ============================================
   FINVERSE - AI Copilot
   ============================================ */

let copilotHistory = [];

function initCopilot() {
    addCopilotMessage('assistant', 'Hello! I\'m your FinSight AI Copilot. I can help you understand your spending patterns, credit health, forecasts, and flag any unusual activity. What would you like to know about your finances?');
}

function addCopilotMessage(role, content) {
    copilotHistory.push({ role, content });
    renderCopilotMessages();
}

function renderCopilotMessages() {
    const container = document.getElementById('copilotMessages');
    if (!container) return;
    container.innerHTML = copilotHistory.map(m => `
    <div class="chat-message ${m.role}">
      <div class="chat-avatar ${m.role === 'assistant' ? 'ai' : 'human'}">
        ${m.role === 'assistant' ? 'AI' : 'AK'}
      </div>
      <div class="chat-bubble">${m.content}</div>
    </div>
  `).join('');
    container.scrollTop = container.scrollHeight;
}

function sendCopilotMessage() {
    const input = document.getElementById('copilotInput');
    const message = input.value.trim();
    if (!message) return;
    addCopilotMessage('user', message);
    input.value = '';
    document.getElementById('copilotSuggestions').style.display = 'none';
    const container = document.getElementById('copilotMessages');
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message assistant';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
    <div class="chat-avatar ai">AI</div>
    <div class="chat-bubble"><div class="typing-indicator"><span></span><span></span><span></span></div></div>
  `;
    container.appendChild(typingDiv);
    container.scrollTop = container.scrollHeight;
    setTimeout(() => {
        const indicator = document.getElementById('typingIndicator');
        if (indicator) indicator.remove();
        const response = generateCopilotResponse(message);
        addCopilotMessage('assistant', response);
    }, 1200 + Math.random() * 800);
}

function sendSuggestion(text) {
    document.getElementById('copilotInput').value = text;
    sendCopilotMessage();
}

function handleCopilotKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendCopilotMessage();
    }
}

function generateCopilotResponse(message) {
    const lower = message.toLowerCase();

    if (lower.includes('spending') || lower.includes('spend')) {
        const total = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + Math.abs(t.amount), 0);
        const categories = getCategoryBreakdown();
        const topCat = categories[0];
        return `Based on your recent transactions, your total spending is <code>$${total.toFixed(2)}</code>. Your highest spending category is <strong>${formatCategoryName(topCat.name)}</strong> at $${Math.abs(topCat.amount).toFixed(0)}. I notice your dining expenses are above your monthly average - consider setting a budget alert for this category. Would you like me to create a detailed spending report?`;
    }

    if (lower.includes('credit') || lower.includes('score')) {
        return 'Your alternative credit score is <strong>742 out of 900</strong>, rated as "Good". Key factors: <br><br>- Payment Regularity: <strong>95%</strong> (excellent)<br>- Spending Discipline: <strong>82%</strong> (good)<br>- Debt Signals: <strong>Low</strong><br>- Savings Rate: <strong>38%</strong><br><br>To improve, focus on reducing credit utilization below 30% and maintaining consistent savings. You\'re on track to reach "Excellent" within 3-4 months.';
    }

    if (lower.includes('unusual') || lower.includes('anomal') || lower.includes('suspicious')) {
        return 'I\'ve flagged <strong>3 alerts</strong> this month:<br><br>1. <span style="color:var(--danger)">Critical:</span> Suspicious wire transfer of $2,500 on Jan 28 - this is 340% above your typical pattern.<br>2. <span style="color:var(--warning)">Warning:</span> Unusual Amazon purchase location.<br>3. <span style="color:var(--info)">Info:</span> New Netflix subscription detected.<br><br>I recommend reviewing the critical wire transfer immediately. Would you like to navigate to the Anomaly Detection page?';
    }

    if (lower.includes('saving') || lower.includes('tips') || lower.includes('advice')) {
        return 'Here are personalized savings tips based on your data:<br><br>1. <strong>Meal Prep Strategy:</strong> You\'re spending ~$820/month on food. Cooking 3 more meals at home could save $140/month.<br>2. <strong>Subscription Audit:</strong> You have 6 subscriptions totaling $73/month. Consider if all are actively used.<br>3. <strong>High-Yield Savings:</strong> Move your idle savings to a HYSA for ~$45/month in extra interest.<br>4. <strong>Transport Optimization:</strong> Your Uber usage spikes on weekends - a transit pass could save $80/month.<br><br>Total potential monthly savings: <strong>~$265</strong>';
    }

    if (lower.includes('forecast') || lower.includes('predict') || lower.includes('next month')) {
        return 'Based on ML analysis of your 6-month spending history:<br><br>- <strong>Predicted total next month:</strong> $4,520 (+6.8%)<br>- <strong>Highest predicted category:</strong> Housing & Bills at $1,340<br>- <strong>Savings forecast:</strong> $2,320 (on track)<br><br>The slight increase is expected due to seasonal patterns. I recommend maintaining your current savings rate of 38% to stay on track with your goals.';
    }

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
        return 'Hello! Great to chat with you. I have full access to your financial data and can help with:<br><br>- Spending analysis and trends<br>- Credit score breakdown<br>- Anomaly alerts<br>- Budget forecasts and recommendations<br>- Financial news insights<br><br>What would you like to explore?';
    }

    return 'That\'s a great question! Based on your current financial profile, here\'s what I can share:<br><br>Your overall financial health is <strong>strong</strong> with a balance of $24,580, a credit score of 742, and savings rate of 38%. There are 3 active anomaly alerts to review. Your spending is trending 5.2% lower than last month, which is positive.<br><br>Would you like me to dive deeper into any specific area - spending patterns, credit health, forecasts, or anomaly alerts?';
}
