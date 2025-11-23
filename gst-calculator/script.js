document.addEventListener('DOMContentLoaded', () => {
    // --- 3D Background with Three.js ---
    const initThreeJS = () => {
        const container = document.getElementById('canvas-container');
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(renderer.domElement);

        // Particles
        const geometry = new THREE.BufferGeometry();
        const particlesCount = 700;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 15; // Spread
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const material = new THREE.PointsMaterial({
            size: 0.02,
            color: 0x6366f1,
            transparent: true,
            opacity: 0.8,
        });

        const particlesMesh = new THREE.Points(geometry, material);
        scene.add(particlesMesh);

        // Connecting Lines
        const linesMaterial = new THREE.LineBasicMaterial({
            color: 0xec4899,
            transparent: true,
            opacity: 0.15
        });

        // Add some floating shapes
        const shapeGeometry = new THREE.IcosahedronGeometry(1, 0);
        const shapeMaterial = new THREE.MeshBasicMaterial({
            color: 0x8b5cf6,
            wireframe: true,
            transparent: true,
            opacity: 0.1
        });
        const shape = new THREE.Mesh(shapeGeometry, shapeMaterial);
        scene.add(shape);
        shape.position.x = 3;
        shape.position.y = 2;

        const shape2 = new THREE.Mesh(shapeGeometry, shapeMaterial);
        scene.add(shape2);
        shape2.position.x = -3;
        shape2.position.y = -2;

        camera.position.z = 4;

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;

        document.addEventListener('mousemove', (event) => {
            mouseX = event.clientX / window.innerWidth - 0.5;
            mouseY = event.clientY / window.innerHeight - 0.5;
        });

        const animate = () => {
            requestAnimationFrame(animate);

            particlesMesh.rotation.y += 0.001;
            particlesMesh.rotation.x += 0.001;

            shape.rotation.x += 0.002;
            shape.rotation.y += 0.002;
            shape2.rotation.x -= 0.002;
            shape2.rotation.y -= 0.002;

            // Parallax effect
            particlesMesh.rotation.y += mouseX * 0.05;
            particlesMesh.rotation.x += mouseY * 0.05;

            renderer.render(scene, camera);
        };

        animate();

        // Resize handler
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    };

    // Initialize 3D Background
    try {
        initThreeJS();
    } catch (e) {
        console.log("Three.js failed to load (likely offline), falling back to CSS background.");
    }

    // --- Calculator Logic ---

    // Elements
    const amountInput = document.getElementById('amount');
    const customRateInput = document.getElementById('custom-rate');
    const rateButtons = document.querySelectorAll('.rate-btn');
    const typeButtons = document.querySelectorAll('.toggle-group .type-btn'); // Select all type buttons

    const netAmountDisplay = document.getElementById('net-amount');
    const cgstAmountDisplay = document.getElementById('cgst-amount');
    const sgstAmountDisplay = document.getElementById('sgst-amount');
    const igstAmountDisplay = document.getElementById('igst-amount');
    const totalAmountDisplay = document.getElementById('total-amount');

    const cgstRateDisplay = document.getElementById('cgst-rate');
    const sgstRateDisplay = document.getElementById('sgst-rate');
    const igstRateDisplay = document.getElementById('igst-rate');

    const breakdownContainer = document.getElementById('breakdown-container');
    const igstContainer = document.getElementById('igst-container');

    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');
    const copyButtons = document.querySelectorAll('.copy-btn');

    // State
    let state = {
        amount: 0,
        rate: 18,
        isExclusive: true,
        isIntraState: true // true = CGST+SGST, false = IGST
    };

    // Load History
    let history = JSON.parse(localStorage.getItem('gst_history')) || [];

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    };

    const updateHistoryUI = () => {
        historyList.innerHTML = '';
        if (history.length === 0) {
            historyList.innerHTML = '<div class="empty-history">No history yet</div>';
            return;
        }

        history.slice().reverse().forEach(item => {
            const div = document.createElement('div');
            div.className = 'history-item';
            div.innerHTML = `
                <div class="h-top">
                    <span>₹${item.amount} @ ${item.rate}%</span>
                    <span>${item.type}</span>
                </div>
                <div class="h-bottom">
                    <span>Total</span>
                    <span>${formatCurrency(item.total)}</span>
                </div>
            `;
            historyList.appendChild(div);
        });
    };

    const addToHistory = (amount, rate, total, type) => {
        if (amount <= 0) return;

        // Avoid duplicates at the top of the stack
        if (history.length > 0) {
            const last = history[history.length - 1];
            if (last.amount === amount && last.rate === rate && last.total === total && last.type === type) return;
        }

        history.push({ amount, rate, total, type });
        if (history.length > 10) history.shift(); // Keep last 10
        localStorage.setItem('gst_history', JSON.stringify(history));
        updateHistoryUI();
    };

    // Debounce for history
    let historyTimeout;

    const calculate = () => {
        const amount = parseFloat(state.amount) || 0;
        const rate = parseFloat(state.rate) || 0;

        let netAmount = 0;
        let gstAmount = 0;
        let totalAmount = 0;

        if (state.isExclusive) {
            netAmount = amount;
            gstAmount = (amount * rate) / 100;
            totalAmount = amount + gstAmount;
        } else {
            totalAmount = amount;
            gstAmount = amount - (amount / (1 + (rate / 100)));
            netAmount = totalAmount - gstAmount;
        }

        // Update UI
        netAmountDisplay.textContent = formatCurrency(netAmount);
        totalAmountDisplay.textContent = formatCurrency(totalAmount);

        // Handle Breakdown
        if (state.isIntraState) {
            breakdownContainer.style.display = 'block';
            igstContainer.style.display = 'none';

            const halfRate = rate / 2;
            const halfGst = gstAmount / 2;

            cgstRateDisplay.textContent = halfRate;
            sgstRateDisplay.textContent = halfRate;

            cgstAmountDisplay.textContent = formatCurrency(halfGst);
            sgstAmountDisplay.textContent = formatCurrency(halfGst);
        } else {
            breakdownContainer.style.display = 'none';
            igstContainer.style.display = 'flex';

            igstRateDisplay.textContent = rate;
            igstAmountDisplay.textContent = formatCurrency(gstAmount);
        }

        // Add to history (debounced)
        clearTimeout(historyTimeout);
        if (amount > 0) {
            historyTimeout = setTimeout(() => {
                const typeStr = (state.isExclusive ? 'Excl.' : 'Incl.') + ' ' + (state.isIntraState ? 'Intra' : 'Inter');
                addToHistory(amount, rate, totalAmount, typeStr);
            }, 1500);
        }
    };

    // Event Listeners
    amountInput.addEventListener('input', (e) => {
        state.amount = e.target.value;
        calculate();
    });

    rateButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            rateButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            customRateInput.value = '';
            state.rate = parseFloat(btn.dataset.rate);
            calculate();
        });
    });

    customRateInput.addEventListener('input', (e) => {
        rateButtons.forEach(b => b.classList.remove('active'));
        let val = parseFloat(e.target.value);
        if (val < 0) val = 0;
        if (val > 100) val = 100;
        state.rate = val;
        calculate();
    });

    // Toggle Buttons (Exclusive/Inclusive & Intra/Inter)
    typeButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const parent = btn.parentElement;
            parent.querySelectorAll('.type-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (btn.id === 'btn-exclusive') state.isExclusive = true;
            if (btn.id === 'btn-inclusive') state.isExclusive = false;
            if (btn.id === 'btn-intra') state.isIntraState = true;
            if (btn.id === 'btn-inter') state.isIntraState = false;

            calculate();
        });
    });

    // History
    clearHistoryBtn.addEventListener('click', () => {
        history = [];
        localStorage.removeItem('gst_history');
        updateHistoryUI();
    });

    // Copy to Clipboard
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.target;
            const text = document.getElementById(targetId).textContent;
            navigator.clipboard.writeText(text).then(() => {
                // Visual feedback
                const originalHTML = btn.innerHTML;
                btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>';
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                }, 1000);
            });
        });
    });

    // --- Tab Switching ---
    const tabs = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(c => {
                c.classList.remove('active');
                c.style.display = 'none';
            });

            tab.classList.add('active');
            const target = document.getElementById(`tab-${tab.dataset.tab}`);
            target.style.display = 'block';
            setTimeout(() => target.classList.add('active'), 10);
        });
    });

    // --- AI Predictor (TensorFlow.js) ---
    const aiCategory = document.getElementById('ai-category');
    const aiYears = document.getElementById('ai-years');
    const aiYearsVal = document.getElementById('ai-years-val');
    const btnPredict = document.getElementById('btn-predict');
    const aiLoading = document.getElementById('ai-loading');
    const aiResult = document.getElementById('ai-result');

    const predPrice = document.getElementById('pred-price');
    const predInflation = document.getElementById('pred-inflation');
    const predGst = document.getElementById('pred-gst');

    aiYears.addEventListener('input', (e) => {
        aiYearsVal.textContent = e.target.value;
    });

    // Simple Neural Network Simulation
    // In a real app, this would load a pre-trained model or train on a large dataset.
    // Here we simulate training on-the-fly with category-specific trends.

    const trainAndPredict = async (currentPrice, category, years) => {
        // Define inflation rates based on category (simulated data)
        const inflationRates = {
            'electronics': 0.08, // 8% inflation
            'essentials': 0.04,  // 4% inflation
            'luxury': 0.12       // 12% inflation
        };

        const baseRate = inflationRates[category];

        // Create a simple model
        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
        model.compile({ loss: 'meanSquaredError', optimizer: 'sgd' });

        // Generate dummy training data (linear progression based on rate)
        const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
        const ys = tf.tensor2d([
            currentPrice * (1 + baseRate),
            currentPrice * (1 + baseRate * 2),
            currentPrice * (1 + baseRate * 3),
            currentPrice * (1 + baseRate * 4)
        ], [4, 1]);

        // Train the model (simulated delay)
        await model.fit(xs, ys, { epochs: 50 });

        // Predict
        const predictionTensor = model.predict(tf.tensor2d([parseInt(years)], [1, 1]));
        const predictedValue = predictionTensor.dataSync()[0];

        // Cleanup
        model.dispose();
        xs.dispose();
        ys.dispose();
        predictionTensor.dispose();

        return predictedValue;
    };

    btnPredict.addEventListener('click', async () => {
        const amount = parseFloat(state.amount);
        if (amount <= 0) {
            alert("Please enter a valid amount in the Calculator tab first.");
            return;
        }

        // UI State
        btnPredict.disabled = true;
        aiResult.style.display = 'none';
        aiLoading.style.display = 'block';

        const category = aiCategory.value;
        const years = aiYears.value;

        try {
            // Run TensorFlow prediction
            // We add a small artificial delay to show the "Thinking" animation
            await new Promise(r => setTimeout(r, 1500));

            const predictedPrice = await trainAndPredict(amount, category, years);

            // Calculate stats
            const inflation = ((predictedPrice - amount) / amount) * 100;
            let gstOutlook = "Stable";
            if (category === 'electronics' && years > 2) gstOutlook = "Likely Decrease";
            if (category === 'luxury') gstOutlook = "Likely Increase";

            // Update UI
            predPrice.textContent = formatCurrency(predictedPrice);
            predInflation.textContent = `+${inflation.toFixed(1)}%`;
            predGst.textContent = gstOutlook;

            aiLoading.style.display = 'none';
            aiResult.style.display = 'block';
        } catch (error) {
            console.error(error);
            aiLoading.style.display = 'none';
            alert("AI Prediction failed. Please try again.");
        } finally {
            btnPredict.disabled = false;
        }
    });
});
