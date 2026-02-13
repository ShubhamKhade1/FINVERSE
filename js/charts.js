/* ============================================
   FINVERSE - Charts (Canvas-based with Animation)
   ============================================ */

function renderSpendingTrendChart(progress = 1) {
    const canvas = document.getElementById('spendingTrendChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px';
        canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
    } else {
        ctx.clearRect(0, 0, rect.width, rect.height);
    }
    const w = rect.width, h = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const spending = [3800, 4200, 3950, 4600, 4460, 4230];
    const income = [6200, 6500, 6400, 6800, 6840, 6840];
    const maxVal = Math.max(...income) * 1.1;
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    ctx.globalAlpha = progress;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(w - padding.right, y); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'right';
        ctx.fillText('$' + Math.round(maxVal - (maxVal / 4) * i).toLocaleString(), padding.left - 8, y + 4);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#64748b'; ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'center';
    months.forEach((m, i) => {
        const x = padding.left + (chartW / (months.length - 1)) * i;
        ctx.fillText(m, x, h - 10);
    });
    ctx.save();
    ctx.beginPath();
    ctx.rect(padding.left, padding.top, chartW * progress, chartH + padding.bottom);
    ctx.clip();
    drawLine(ctx, income, maxVal, padding, chartW, chartH, months.length, '#3b82f6', true);
    drawLine(ctx, spending, maxVal, padding, chartW, chartH, months.length, '#00d4aa', true);
    ctx.restore();
    ctx.globalAlpha = progress;
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = '#00d4aa'; ctx.fillRect(w - 180, 8, 10, 10);
    ctx.fillStyle = '#94a3b8'; ctx.fillText('Spending', w - 164, 17);
    ctx.fillStyle = '#3b82f6'; ctx.fillRect(w - 100, 8, 10, 10);
    ctx.fillStyle = '#94a3b8'; ctx.fillText('Income', w - 84, 17);
    ctx.globalAlpha = 1;
}

function drawLine(ctx, data, maxVal, padding, chartW, chartH, count, color, fill) {
    const points = data.map((val, i) => ({
        x: padding.left + (chartW / (count - 1)) * i,
        y: padding.top + chartH - (val / maxVal) * chartH
    }));
    if (fill) {
        ctx.beginPath();
        ctx.moveTo(points[0].x, padding.top + chartH);
        points.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
        ctx.closePath();
        const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
        gradient.addColorStop(0, color + '30');
        gradient.addColorStop(1, color + '05');
        ctx.fillStyle = gradient;
        ctx.fill();
    }
    ctx.beginPath();
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();
    points.forEach(p => {
        ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
        ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fillStyle = '#0a0e1a'; ctx.fill();
    });
}

function renderMonthlySpendChart(progress = 1) {
    const canvas = document.getElementById('monthlySpendChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
    } else { ctx.clearRect(0, 0, rect.width, rect.height); }
    const w = rect.width, h = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const data = [3800, 4200, 3950, 4600, 4460, 4230];
    const maxVal = 5000;
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;
    const barWidth = chartW / months.length * 0.6;
    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(w - padding.right, y); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'right';
        ctx.fillText('$' + Math.round(maxVal - (maxVal / 4) * i).toLocaleString(), padding.left - 8, y + 4);
    }
    months.forEach((m, i) => {
        const x = padding.left + (chartW / months.length) * i + (chartW / months.length - barWidth) / 2;
        let barH = (data[i] / maxVal) * chartH;
        barH = barH * progress;
        const y = padding.top + chartH - barH;
        const gradient = ctx.createLinearGradient(x, y, x, padding.top + chartH);
        gradient.addColorStop(0, '#00d4aa'); gradient.addColorStop(1, '#00d4aa40');
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barH, barH > 4 ? [4, 4, 0, 0] : 0);
        ctx.fillStyle = gradient; ctx.fill();
        ctx.fillStyle = '#64748b'; ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText(m, x + barWidth / 2, h - 10);
        if (progress > 0.8) {
            ctx.globalAlpha = (progress - 0.8) * 5;
            ctx.fillStyle = '#f1f5f9'; ctx.font = '10px Inter, sans-serif';
            ctx.fillText('$' + data[i].toLocaleString(), x + barWidth / 2, y - 6);
            ctx.globalAlpha = 1;
        }
    });
}

function renderCategoryPieChart(progress = 1) {
    const canvas = document.getElementById('categoryPieChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
    } else { ctx.clearRect(0, 0, rect.width, rect.height); }
    const w = rect.width, h = rect.height;
    const cx = w / 2, cy = h / 2;
    const radius = Math.min(w, h) / 2 - 40;
    const categories = [
        { name: 'Bills', amount: 2332, color: '#8b5cf6' },
        { name: 'Food', amount: 254, color: '#f59e0b' },
        { name: 'Shopping', amount: 481, color: '#ec4899' },
        { name: 'Transport', amount: 70, color: '#3b82f6' },
        { name: 'Health', amount: 82, color: '#ef4444' },
        { name: 'Entertainment', amount: 55, color: '#06b6d4' },
    ];
    const total = categories.reduce((s, c) => s + c.amount, 0);
    let startAngle = -Math.PI / 2;
    categories.forEach(cat => {
        const targetSliceAngle = (cat.amount / total) * Math.PI * 2;
        const sliceAngle = targetSliceAngle * progress;
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath(); ctx.fillStyle = cat.color; ctx.fill();
        ctx.beginPath(); ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
        ctx.closePath(); ctx.strokeStyle = '#1a1f35'; ctx.lineWidth = 2; ctx.stroke();
        const midAngle = startAngle + sliceAngle / 2;
        const labelRadius = radius * 0.7;
        const lx = cx + Math.cos(midAngle) * labelRadius;
        const ly = cy + Math.sin(midAngle) * labelRadius;
        if (sliceAngle > 0.2 && progress > 0.6) {
            ctx.globalAlpha = Math.min(1, (progress - 0.6) * 2.5);
            ctx.fillStyle = '#f1f5f9'; ctx.font = 'bold 11px Inter, sans-serif'; ctx.textAlign = 'center';
            ctx.fillText(cat.name, lx, ly);
            ctx.font = '10px Inter, sans-serif';
            ctx.fillText(Math.round(cat.amount / total * 100) + '%', lx, ly + 14);
            ctx.globalAlpha = 1;
        }
        startAngle += sliceAngle;
    });
    ctx.beginPath(); ctx.arc(cx, cy, radius * 0.45, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1f35'; ctx.fill();
    if (progress > 0.5) {
        ctx.globalAlpha = (progress - 0.5) * 2;
        ctx.fillStyle = '#f1f5f9'; ctx.font = 'bold 18px Inter, sans-serif'; ctx.textAlign = 'center';
        ctx.fillText('$' + total.toLocaleString(), cx, cy + 2);
        ctx.fillStyle = '#64748b'; ctx.font = '11px Inter, sans-serif';
        ctx.fillText('Total', cx, cy + 18);
        ctx.globalAlpha = 1;
    }
}

function renderForecastChart(progress = 1) {
    const canvas = document.getElementById('forecastChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
    } else { ctx.clearRect(0, 0, rect.width, rect.height); }
    const w = rect.width, h = rect.height;
    const padding = { top: 30, right: 20, bottom: 40, left: 60 };
    const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar*', 'Apr*', 'May*'];
    const actual = [3800, 4200, 3950, 4600, 4460, 4230, null, null, null];
    const predicted = [null, null, null, null, null, 4230, 4520, 4380, 4450];
    const upper = [null, null, null, null, null, 4230, 4820, 4750, 4900];
    const lower = [null, null, null, null, null, 4230, 4220, 4010, 4000];
    const maxVal = 5500;
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartH / 5) * i;
        ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(w - padding.right, y); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'right';
        ctx.fillText('$' + Math.round(maxVal - (maxVal / 5) * i).toLocaleString(), padding.left - 8, y + 4);
    }
    ctx.textAlign = 'center';
    months.forEach((m, i) => {
        const x = padding.left + (chartW / (months.length - 1)) * i;
        ctx.fillStyle = m.includes('*') ? '#00d4aa' : '#64748b';
        ctx.fillText(m, x, h - 10);
    });

    ctx.save();
    ctx.beginPath();
    ctx.rect(padding.left, padding.top, chartW * progress, chartH + padding.bottom);
    ctx.clip();

    const bandPoints = [];
    for (let i = 0; i < months.length; i++) {
        if (upper[i] !== null) {
            bandPoints.push({
                x: padding.left + (chartW / (months.length - 1)) * i,
                upper: padding.top + chartH - (upper[i] / maxVal) * chartH,
                lower: padding.top + chartH - (lower[i] / maxVal) * chartH
            });
        }
    }
    if (bandPoints.length > 1) {
        ctx.beginPath();
        bandPoints.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.upper) : ctx.lineTo(p.x, p.upper));
        for (let i = bandPoints.length - 1; i >= 0; i--) ctx.lineTo(bandPoints[i].x, bandPoints[i].lower);
        ctx.closePath(); ctx.fillStyle = '#00d4aa15'; ctx.fill();
    }

    const divX = padding.left + (chartW / (months.length - 1)) * 5;
    ctx.setLineDash([4, 4]); ctx.strokeStyle = '#334155';
    ctx.beginPath(); ctx.moveTo(divX, padding.top); ctx.lineTo(divX, padding.top + chartH); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#64748b'; ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Forecast', divX + 40, padding.top + 12);

    const actualPts = actual.map((val, i) => val !== null ? {
        x: padding.left + (chartW / (months.length - 1)) * i,
        y: padding.top + chartH - (val / maxVal) * chartH
    } : null).filter(Boolean);
    ctx.beginPath(); ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2.5;
    actualPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();
    actualPts.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fillStyle = '#3b82f6'; ctx.fill(); });

    const predPts = predicted.map((val, i) => val !== null ? {
        x: padding.left + (chartW / (months.length - 1)) * i,
        y: padding.top + chartH - (val / maxVal) * chartH
    } : null).filter(Boolean);
    ctx.beginPath(); ctx.strokeStyle = '#00d4aa'; ctx.lineWidth = 2.5; ctx.setLineDash([6, 4]);
    predPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke(); ctx.setLineDash([]);
    predPts.forEach(p => { ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fillStyle = '#00d4aa'; ctx.fill(); });
    ctx.restore();

    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = '#3b82f6'; ctx.fillRect(padding.left, 6, 10, 10);
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'left'; ctx.fillText('Actual', padding.left + 16, 15);
    ctx.fillStyle = '#00d4aa'; ctx.fillRect(padding.left + 80, 6, 10, 10);
    ctx.fillStyle = '#94a3b8'; ctx.fillText('Predicted', padding.left + 96, 15);
}

function renderCreditTrendChart(progress = 1) {
    const canvas = document.getElementById('creditTrendChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
    } else { ctx.clearRect(0, 0, rect.width, rect.height); }
    const w = rect.width, h = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const months = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
    const scores = [680, 685, 692, 698, 705, 710, 718, 722, 728, 735, 738, 742];
    const maxVal = 800, minVal = 650;
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        const val = maxVal - ((maxVal - minVal) / 4) * i;
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(w - padding.right, y); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'right';
        ctx.fillText(Math.round(val), padding.left - 8, y + 4);
    }
    ctx.textAlign = 'center';
    months.forEach((m, i) => {
        const x = padding.left + (chartW / (months.length - 1)) * i;
        ctx.fillStyle = '#64748b'; ctx.fillText(m, x, h - 10);
    });

    ctx.save();
    ctx.beginPath();
    ctx.rect(padding.left, padding.top, chartW * progress, chartH + padding.bottom);
    ctx.clip();

    const points = scores.map((val, i) => ({
        x: padding.left + (chartW / (months.length - 1)) * i,
        y: padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH
    }));
    ctx.beginPath();
    ctx.moveTo(points[0].x, padding.top + chartH);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.lineTo(points[points.length - 1].x, padding.top + chartH);
    ctx.closePath();
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, '#00d4aa30'); gradient.addColorStop(1, '#00d4aa05');
    ctx.fillStyle = gradient; ctx.fill();

    ctx.beginPath(); ctx.strokeStyle = '#00d4aa'; ctx.lineWidth = 2.5;
    points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();

    points.forEach((p, i) => {
        const pointProgress = i / (points.length - 1);
        if (progress >= pointProgress) {
            if (i === points.length - 1) {
                ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
                ctx.fillStyle = '#00d4aa30'; ctx.fill();
            }
            ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#00d4aa'; ctx.fill();
        }
    });
    ctx.restore();
}

function renderAnomalyChart(progress = 1) {
    const canvas = document.getElementById('anomalyChart');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
        canvas.width = rect.width * dpr; canvas.height = rect.height * dpr;
        canvas.style.width = rect.width + 'px'; canvas.style.height = rect.height + 'px';
        ctx.scale(dpr, dpr);
    } else { ctx.clearRect(0, 0, rect.width, rect.height); }
    const w = rect.width, h = rect.height;
    const padding = { top: 30, right: 20, bottom: 40, left: 60 };

    const days = [], normal = [], anomalies = [];
    for (let i = 1; i <= 28; i++) {
        days.push(i);
        normal.push(100 + Math.random() * 150);
        anomalies.push(i === 15 ? 580 : i === 22 ? 420 : i === 28 ? 350 : null);
    }
    const maxVal = 650;
    const chartW = w - padding.left - padding.right;
    const chartH = h - padding.top - padding.bottom;

    for (let i = 0; i <= 4; i++) {
        const y = padding.top + (chartH / 4) * i;
        ctx.strokeStyle = '#1e293b'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(padding.left, y); ctx.lineTo(w - padding.right, y); ctx.stroke();
        ctx.fillStyle = '#64748b'; ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'right';
        ctx.fillText('$' + Math.round(maxVal - (maxVal / 4) * i), padding.left - 8, y + 4);
    }

    ctx.save();
    ctx.beginPath();
    ctx.rect(padding.left, padding.top, chartW * progress, chartH + padding.bottom);
    ctx.clip();
    const pts = normal.map((val, i) => ({
        x: padding.left + (chartW / (days.length - 1)) * i,
        y: padding.top + chartH - (val / maxVal) * chartH
    }));
    ctx.beginPath(); ctx.strokeStyle = '#3b82f6'; ctx.lineWidth = 2;
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.stroke();
    ctx.restore();

    if (progress > 0.3) {
        ctx.globalAlpha = Math.min(1, (progress - 0.3) * 2);
        const threshY = padding.top + chartH - (300 / maxVal) * chartH;
        ctx.setLineDash([6, 4]); ctx.strokeStyle = '#ef444480'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(padding.left, threshY); ctx.lineTo(w - padding.right, threshY); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#ef4444'; ctx.font = '10px Inter, sans-serif'; ctx.textAlign = 'left';
        ctx.fillText('Anomaly Threshold', w - padding.right - 110, threshY - 6);
        ctx.globalAlpha = 1;
    }

    anomalies.forEach((val, i) => {
        if (val !== null) {
            const pointProgress = i / (days.length - 1);
            if (progress >= pointProgress) {
                const x = padding.left + (chartW / (days.length - 1)) * i;
                const y = padding.top + chartH - (val / maxVal) * chartH;
                let scale = 1;
                if (progress < pointProgress + 0.1) scale = (progress - pointProgress) / 0.1;
                ctx.save(); ctx.translate(x, y); ctx.scale(scale, scale);
                ctx.beginPath(); ctx.arc(0, 0, 12, 0, Math.PI * 2); ctx.fillStyle = '#ef444430'; ctx.fill();
                ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fillStyle = '#ef4444'; ctx.fill();
                ctx.fillStyle = '#ef4444'; ctx.font = 'bold 10px Inter, sans-serif'; ctx.textAlign = 'center';
                ctx.fillText('$' + val, 0, -16);
                ctx.restore();
            }
        }
    });

    ctx.fillStyle = '#64748b'; ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'center';
    [1, 7, 14, 21, 28].forEach(d => {
        const x = padding.left + (chartW / 27) * (d - 1);
        ctx.fillText('Jan ' + d, x, h - 10);
    });

    ctx.globalAlpha = Math.max(0, (progress - 0.5) * 2);
    ctx.font = '11px Inter, sans-serif';
    ctx.fillStyle = '#3b82f6'; ctx.fillRect(padding.left, 6, 10, 10);
    ctx.fillStyle = '#94a3b8'; ctx.textAlign = 'left'; ctx.fillText('Normal Spending', padding.left + 16, 15);
    ctx.fillStyle = '#ef4444';
    ctx.beginPath(); ctx.arc(padding.left + 140, 11, 5, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#94a3b8'; ctx.fillText('Anomalies', padding.left + 150, 15);
    ctx.globalAlpha = 1;
}
