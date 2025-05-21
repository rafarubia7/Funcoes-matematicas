// Classe principal da calculadora
class QuadraticCalculator {
    constructor() {
        this.initializeElements();
        this.initializeChart();
        this.initializeDecompositionChart();
        this.setupEventListeners();
        this.setupSliderSync();
        this.currentTheme = 'light';
        this.physicsMode = false;
        this.animationFrame = null;
        this.zoomLevel = 1;
        this.calculate();
    }

    initializeElements() {
        // Parâmetros
        this.paramA = document.getElementById('param-a');
        this.paramB = document.getElementById('param-b');
        this.paramC = document.getElementById('param-c');
        this.sliderA = document.getElementById('slider-a');
        this.sliderB = document.getElementById('slider-b');
        this.sliderC = document.getElementById('slider-c');

        // Controles
        this.calculateBtn = document.getElementById('calculateBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.animateBtn = document.getElementById('animateBtn');
        this.themeToggle = document.getElementById('themeToggle');
        this.physicsToggle = document.getElementById('physicsToggle');

        // Personalização
        this.curveColor = document.getElementById('curveColor');
        this.showGrid = document.getElementById('showGrid');
        this.showPoints = document.getElementById('showPoints');
        this.showVertex = document.getElementById('showVertex');
        this.showRoots = document.getElementById('showRoots');

        // Zoom
        this.zoomIn = document.getElementById('zoomIn');
        this.zoomOut = document.getElementById('zoomOut');
        this.resetZoom = document.getElementById('resetZoom');

        // Decomposição
        this.showQuadratic = document.getElementById('showQuadratic');
        this.showLinear = document.getElementById('showLinear');
        this.showConstant = document.getElementById('showConstant');
        this.showAll = document.getElementById('showAll');

        // Resultados
        this.discriminantEl = document.getElementById('discriminant');
        this.vertexEl = document.getElementById('vertex');
        this.axisEl = document.getElementById('axis');
        this.rootsEl = document.getElementById('roots');
        this.concavityEl = document.getElementById('concavity');
        this.vertexValueEl = document.getElementById('vertexValue');

        // Elementos de UI
        this.loading = document.getElementById('loading');
        this.toast = document.getElementById('toast');
        this.projectile = document.getElementById('projectile');
    }

    initializeChart() {
        const ctx = document.getElementById('quadraticChart').getContext('2d');
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'f(x) = ax² + bx + c',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    tension: 0.1,
                    pointRadius: 0,
                    pointHoverRadius: 6
                }, {
                    label: 'Vértice',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: '#ef4444',
                    borderWidth: 0,
                    pointRadius: 8,
                    pointHoverRadius: 10,
                    showLine: false
                }, {
                    label: 'Raízes',
                    data: [],
                    borderColor: '#10b981',
                    backgroundColor: '#10b981',
                    borderWidth: 0,
                    pointRadius: 6,
                    pointHoverRadius: 8,
                    showLine: false
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'index'
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    },
                    tooltip: {
                        callbacks: {
                            title: function(context) {
                                return `x = ${context[0].label}`;
                            },
                            label: function(context) {
                                return `${context.dataset.label}: ${context.parsed.y.toFixed(3)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'center',
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        title: {
                            display: true,
                            text: 'x'
                        }
                    },
                    y: {
                        type: 'linear',
                        position: 'center',
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.1)'
                        },
                        title: {
                            display: true,
                            text: 'f(x)'
                        }
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuart'
                }
            }
        });
    }

    initializeDecompositionChart() {
        const ctx = document.getElementById('decompChart').getContext('2d');
        this.decompChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'ax²',
                    data: [],
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    hidden: true
                }, {
                    label: 'bx',
                    data: [],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    hidden: true
                }, {
                    label: 'c',
                    data: [],
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    borderWidth: 2,
                    fill: false,
                    hidden: true
                }, {
                    label: 'Total',
                    data: [],
                    borderColor: '#3b82f6',
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    borderWidth: 3,
                    fill: false,
                    hidden: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'center'
                    },
                    y: {
                        type: 'linear',
                        position: 'center'
                    }
                },
                animation: {
                    duration: 800
                }
            }
        });
    }

    setupEventListeners() {
        // Parâmetros
        [this.paramA, this.paramB, this.paramC].forEach(input => {
            input.addEventListener('input', () => this.calculate());
        });

        // Botões principais
        this.calculateBtn.addEventListener('click', () => this.calculate());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.animateBtn.addEventListener('click', () => this.animateProjectile());

        // Tema e modo física
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
        this.physicsToggle.addEventListener('click', () => this.togglePhysicsMode());

        // Personalização
        this.curveColor.addEventListener('change', () => this.updateChartStyle());
        [this.showGrid, this.showPoints, this.showVertex, this.showRoots].forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateChartStyle());
        });

        // Zoom
        this.zoomIn.addEventListener('click', () => this.zoom(1.2));
        this.zoomOut.addEventListener('click', () => this.zoom(0.8));
        this.resetZoom.addEventListener('click', () => this.resetZoomLevel());

        // Decomposição
        this.showQuadratic.addEventListener('click', () => this.toggleDecomposition(0));
        this.showLinear.addEventListener('click', () => this.toggleDecomposition(1));
        this.showConstant.addEventListener('click', () => this.toggleDecomposition(2));
        this.showAll.addEventListener('click', () => this.showAllDecomposition());
    }

    setupSliderSync() {
        // Sincronizar sliders com inputs
        this.sliderA.addEventListener('input', () => {
            this.paramA.value = this.sliderA.value;
            this.calculate();
        });

        this.sliderB.addEventListener('input', () => {
            this.paramB.value = this.sliderB.value;
            this.calculate();
        });

        this.sliderC.addEventListener('input', () => {
            this.paramC.value = this.sliderC.value;
            this.calculate();
        });

        // Sincronizar inputs com sliders
        this.paramA.addEventListener('input', () => {
            this.sliderA.value = this.paramA.value;
        });

        this.paramB.addEventListener('input', () => {
            this.sliderB.value = this.paramB.value;
        });

        this.paramC.addEventListener('input', () => {
            this.sliderC.value = this.paramC.value;
        });
    }

    getCoefficients() {
        return {
            a: parseFloat(this.paramA.value) || 0,
            b: parseFloat(this.paramB.value) || 0,
            c: parseFloat(this.paramC.value) || 0
        };
    }

    calculateQuadratic(x, a, b, c) {
        return a * x * x + b * x + c;
    }

    calculateVertex(a, b, c) {
        if (a === 0) return null;
        const x = -b / (2 * a);
        const y = this.calculateQuadratic(x, a, b, c);
        return { x, y };
    }

    calculateRoots(a, b, c) {
        if (a === 0) {
            if (b === 0) return [];
            return [-c / b];
        }

        const discriminant = b * b - 4 * a * c;
        if (discriminant < 0) return [];
        if (discriminant === 0) return [-b / (2 * a)];
        
        const sqrt = Math.sqrt(discriminant);
        return [
            (-b + sqrt) / (2 * a),
            (-b - sqrt) / (2 * a)
        ];
    }

    calculateDiscriminant(a, b, c) {
        return b * b - 4 * a * c;
    }

    generateChartData() {
        const { a, b, c } = this.getCoefficients();
        const range = 20 / this.zoomLevel;
        const step = range / 100;
        const data = [];
        const labels = [];

        for (let x = -range/2; x <= range/2; x += step) {
            const y = this.calculateQuadratic(x, a, b, c);
            labels.push(x.toFixed(2));
            data.push({ x: x, y: y });
        }

        return { labels, data };
    }

    updateChart() {
        const { labels, data } = this.generateChartData();
        const { a, b, c } = this.getCoefficients();

        // Atualizar dados principais
        this.chart.data.labels = labels;
        this.chart.data.datasets[0].data = data;
        this.chart.data.datasets[0].borderColor = this.curveColor.value;

        // Atualizar vértice
        const vertex = this.calculateVertex(a, b, c);
        if (vertex && this.showVertex.checked) {
            this.chart.data.datasets[1].data = [vertex];
        } else {
            this.chart.data.datasets[1].data = [];
        }

        // Atualizar raízes
        const roots = this.calculateRoots(a, b, c);
        if (roots.length > 0 && this.showRoots.checked) {
            this.chart.data.datasets[2].data = roots.map(root => ({
                x: root,
                y: 0
            }));
        } else {
            this.chart.data.datasets[2].data = [];
        }

        this.chart.update('none');
    }

    updateDecompositionChart() {
        const { a, b, c } = this.getCoefficients();
        const range = 10;
        const step = 0.2;
        const labels = [];
        const quadraticData = [];
        const linearData = [];
        const constantData = [];
        const totalData = [];

        for (let x = -range; x <= range; x += step) {
            labels.push(x.toFixed(1));
            quadraticData.push({ x: x, y: a * x * x });
            linearData.push({ x: x, y: b * x });
            constantData.push({ x: x, y: c });
            totalData.push({ x: x, y: this.calculateQuadratic(x, a, b, c) });
        }

        this.decompChart.data.labels = labels;
        this.decompChart.data.datasets[0].data = quadraticData;
        this.decompChart.data.datasets[1].data = linearData;
        this.decompChart.data.datasets[2].data = constantData;
        this.decompChart.data.datasets[3].data = totalData;

        this.decompChart.update('none');
    }

    updateResults() {
        const { a, b, c } = this.getCoefficients();
        
        // Discriminante
        const discriminant = this.calculateDiscriminant(a, b, c);
        this.discriminantEl.textContent = discriminant.toFixed(3);
        this.discriminantEl.className = 'value';
        if (discriminant > 0) this.discriminantEl.classList.add('positive');
        else if (discriminant < 0) this.discriminantEl.classList.add('negative');

        // Vértice
        const vertex = this.calculateVertex(a, b, c);
        if (vertex) {
            this.vertexEl.textContent = `(${vertex.x.toFixed(3)}, ${vertex.y.toFixed(3)})`;
            this.vertexValueEl.textContent = vertex.y.toFixed(3);
        } else {
            this.vertexEl.textContent = 'N/A';
            this.vertexValueEl.textContent = 'N/A';
        }

        // Eixo de simetria
        if (a !== 0) {
            const axis = -b / (2 * a);
            this.axisEl.textContent = `x = ${axis.toFixed(3)}`;
        } else {
            this.axisEl.textContent = 'N/A';
        }

        // Raízes
        const roots = this.calculateRoots(a, b, c);
        if (roots.length === 0) {
            this.rootsEl.textContent = 'Sem raízes reais';
        } else if (roots.length === 1) {
            this.rootsEl.textContent = `x = ${roots[0].toFixed(3)}`;
        } else {
            this.rootsEl.textContent = `x₁ = ${roots[0].toFixed(3)}, x₂ = ${roots[1].toFixed(3)}`;
        }

        // Concavidade
        if (a > 0) {
            this.concavityEl.textContent = 'Para cima (U)';
            this.concavityEl.className = 'value positive';
        } else if (a < 0) {
            this.concavityEl.textContent = 'Para baixo (∩)';
            this.concavityEl.className = 'value negative';
        } else {
            this.concavityEl.textContent = 'Função linear';
            this.concavityEl.className = 'value';
        }
    }

    updateChartStyle() {
        // Cor da curva
        this.chart.data.datasets[0].borderColor = this.curveColor.value;
        
        // Grade
        this.chart.options.scales.x.grid.display = this.showGrid.checked;
        this.chart.options.scales.y.grid.display = this.showGrid.checked;

        // Pontos de interesse
        this.chart.data.datasets[1].hidden = !this.showVertex.checked;
        this.chart.data.datasets[2].hidden = !this.showRoots.checked;

        this.chart.update('none');
    }

    calculate() {
        this.showLoading();
        
        setTimeout(() => {
            this.updateChart();
            this.updateDecompositionChart();
            this.updateResults();
            this.hideLoading();
            this.showToast('Cálculos atualizados!', 'success');
        }, 300);
    }

    reset() {
        this.paramA.value = '1';
        this.paramB.value = '0';
        this.paramC.value = '0';
        this.sliderA.value = '1';
        this.sliderB.value = '0';
        this.sliderC.value = '0';
        this.curveColor.value = '#3b82f6';
        this.zoomLevel = 1;
        
        // Reset checkboxes
        this.showGrid.checked = false;
        this.showPoints.checked = true;
        this.showVertex.checked = true;
        this.showRoots.checked = true;

        this.calculate();
        this.showToast('Valores resetados!', 'success');
    }

    zoom(factor) {
        this.zoomLevel *= factor;
        this.zoomLevel = Math.max(0.1, Math.min(10, this.zoomLevel));
        this.updateChart();
    }

    resetZoomLevel() {
        this.zoomLevel = 1;
        this.updateChart();
        this.showToast('Zoom resetado!', 'success');
    }

    toggleDecomposition(index) {
        const dataset = this.decompChart.data.datasets[index];
        dataset.hidden = !dataset.hidden;
        this.decompChart.update();
    }

    showAllDecomposition() {
        this.decompChart.data.datasets.forEach(dataset => {
            dataset.hidden = false;
        });
        this.decompChart.update();
    }

    animateProjectile() {
        const { a, b, c } = this.getCoefficients();
        
        if (a >= 0) {
            this.showToast('Para animação de projétil, o coeficiente "a" deve ser negativo!', 'warning');
            return;
        }

        const roots = this.calculateRoots(a, b, c);
        if (roots.length < 2) {
            this.showToast('Para animação de projétil, a parábola deve ter duas raízes!', 'warning');
            return;
        }

        const startX = Math.min(...roots);
        const endX = Math.max(...roots);
        const vertex = this.calculateVertex(a, b, c);

        if (!vertex || vertex.y <= 0) {
            this.showToast('Para animação de projétil, o vértice deve estar acima do eixo x!', 'warning');
            return;
        }

        this.projectile.classList.add('animating');
        
        const duration = 3000; // 3 segundos
        const startTime = Date.now();
        const chartRect = this.chart.canvas.getBoundingClientRect();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const currentX = startX + (endX - startX) * progress;
            const currentY = this.calculateQuadratic(currentX, a, b, c);

            // Converter coordenadas do gráfico para pixels
            const xPixel = this.chart.scales.x.getPixelForValue(currentX);
            const yPixel = this.chart.scales.y.getPixelForValue(currentY);

            this.projectile.style.left = `${xPixel}px`;
            this.projectile.style.top = `${yPixel}px`;

            if (progress < 1) {
                this.animationFrame = requestAnimationFrame(animate);
            } else {
                this.projectile.classList.remove('animating');
                this.showToast('Animação concluída!', 'success');
            }
        };

        animate();
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
        
        const icon = this.themeToggle.querySelector('.theme-icon');
        icon.textContent = this.currentTheme === 'light' ? '🌙' : '☀️';
        
        this.showToast(`Tema ${this.currentTheme === 'light' ? 'claro' : 'escuro'} ativado!`, 'success');
    }

    togglePhysicsMode() {
        this.physicsMode = !this.physicsMode;
        document.body.classList.toggle('physics-mode', this.physicsMode);
        this.physicsToggle.classList.toggle('active', this.physicsMode);
        
        this.showToast(`Modo física ${this.physicsMode ? 'ativado' : 'desativado'}!`, 'success');
    }

    showLoading() {
        this.loading.classList.remove('hidden');
    }

    hideLoading() {
        this.loading.classList.add('hidden');
    }

    showToast(message, type = 'success') {
        this.toast.textContent = message;
        this.toast.className = `toast ${type} show`;
        
        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }
}

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    const calculator = new QuadraticCalculator();
    
    // Adicionar efeitos de entrada
    document.querySelectorAll('.card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('animate-fade-in');
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'r':
                    e.preventDefault();
                    calculator.reset();
                    break;
                case 'Enter':
                    e.preventDefault();
                    calculator.calculate();
                    break;
                case 't':
                    e.preventDefault();
                    calculator.toggleTheme();
                    break;
                case 'p':
                    e.preventDefault();
                    calculator.togglePhysicsMode();
                    break;
            }
        }
    });

    // Adicionar tooltip para atalhos
    const shortcuts = [
        { element: calculator.resetBtn, shortcut: 'Ctrl+R' },
        { element: calculator.calculateBtn, shortcut: 'Ctrl+Enter' },
        { element: calculator.themeToggle, shortcut: 'Ctrl+T' },
        { element: calculator.physicsToggle, shortcut: 'Ctrl+P' }
    ];

    shortcuts.forEach(({ element, shortcut }) => {
        if (element) {
            element.title += ` (${shortcut})`;
        }
    });
});

// Service Worker para cache (opcional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
    // Adicione esta classe ao seu arquivo JavaScript
class ARViewer {
    constructor(calculator) {
        this.calculator = calculator;
        this.isARActive = false;
        this.arButton = document.createElement('button');
        this.setupARButton();
        this.initializeARComponents();
    }

    setupARButton() {
        this.arButton.id = 'arToggle';
        this.arButton.className = 'btn btn-accent';
        this.arButton.innerHTML = '🎯 Modo AR';
        this.arButton.addEventListener('click', () => this.toggleARMode());
        
        // Adicionar o botão ao header controls
        const headerControls = document.querySelector('.header-controls');
        if (headerControls) {
            headerControls.appendChild(this.arButton);
        }
    }

    initializeARComponents() {
        // Criar container AR
        this.arContainer = document.createElement('div');
        this.arContainer.id = 'ar-container';
        this.arContainer.className = 'hidden';
        this.arContainer.innerHTML = `
            <div class="ar-overlay">
                <div class="ar-header">
                    <h3>Visualização AR da Parábola</h3>
                    <button id="close-ar" class="btn btn-icon btn-small">✕</button>
                </div>
                <div id="ar-scene"></div>
                <div class="ar-controls">
                    <button id="ar-zoom-in" class="btn btn-icon">+</button>
                    <button id="ar-zoom-out" class="btn btn-icon">-</button>
                    <button id="ar-rotate" class="btn btn-icon">↻</button>
                    <button id="ar-reset" class="btn btn-secondary">Resetar</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(this.arContainer);
        
        // Configurar eventos AR
        document.getElementById('close-ar').addEventListener('click', () => this.toggleARMode());
        document.getElementById('ar-zoom-in').addEventListener('click', () => this.adjustARZoom(1.2));
        document.getElementById('ar-zoom-out').addEventListener('click', () => this.adjustARZoom(0.8));
        document.getElementById('ar-rotate').addEventListener('click', () => this.rotateModel());
        document.getElementById('ar-reset').addEventListener('click', () => this.resetARView());
    }

    toggleARMode() {
        this.isARActive = !this.isARActive;
        
        if (this.isARActive) {
            this.startARView();
            this.arButton.classList.add('active');
            this.arButton.innerHTML = '🚫 Sair do AR';
        } else {
            this.stopARView();
            this.arButton.classList.remove('active');
            this.arButton.innerHTML = '🎯 Modo AR';
        }
    }

    startARView() {
        this.arContainer.classList.remove('hidden');
        this.render3DParabola();
        this.calculator.showToast('Modo AR ativado! Mova seu dispositivo para explorar.', 'success');
    }

    stopARView() {
        this.arContainer.classList.add('hidden');
        // Limpar cena 3D se estiver usando Three.js ou similar
        if (this.scene) {
            // Limpar a cena aqui
        }
    }

    render3DParabola() {
        const { a, b, c } = this.calculator.getCoefficients();
        const sceneEl = document.getElementById('ar-scene');
        
        // Limpar conteúdo anterior
        sceneEl.innerHTML = '';
        
        // Verificar suporte para WebXR
        if (!navigator.xr) {
            this.renderFallback3DView(sceneEl, a, b, c);
            return;
        }
        
        // Implementação com Three.js para WebXR
        this.setupThreeJSScene(sceneEl, a, b, c);
    }

    renderFallback3DView(container, a, b, c) {
        // Implementação alternativa sem WebXR
        container.innerHTML = `
            <div class="ar-fallback">
                <p>Seu navegador não suporta WebXR. Aqui está uma visualização 3D simulada:</p>
                <canvas id="fallback-3d-canvas"></canvas>
                <p>Função: f(x) = ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}</p>
            </div>
        `;
        
        // Implementar renderização 3D básica com Three.js ou similar
        this.setupFallback3DScene('fallback-3d-canvas', a, b, c);
    }

    setupThreeJSScene(container, a, b, c) {
        // Implementação básica com Three.js para WebXR
        // Nota: Você precisará incluir a biblioteca Three.js e WebXR.js
        
        try {
            // Inicializar cena, câmera e renderizador
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ antialias: true });
            
            renderer.setSize(container.clientWidth, container.clientHeight);
            container.appendChild(renderer.domElement);
            
            // Adicionar luzes
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
            scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(1, 1, 1);
            scene.add(directionalLight);
            
            // Criar parábola 3D
            this.create3DParabola(scene, a, b, c);
            
            // Configurar controles AR
            camera.position.z = 5;
            
            // Animação
            const animate = () => {
                requestAnimationFrame(animate);
                renderer.render(scene, camera);
            };
            
            animate();
            
            // Configurar WebXR
            renderer.xr.enabled = true;
            
            const enterAR = async () => {
                try {
                    await renderer.xr.setSession(navigator.xr.requestSession("immersive-ar", {
                        requiredFeatures: ['hit-test', 'dom-overlay'],
                        domOverlay: { root: container }
                    }))
                    
                    // Configurar controles AR
                    const controller = renderer.xr.getController(0);
                    scene.add(controller);
                    
                    renderer.setAnimationLoop(() => {
                        renderer.render(scene, camera);
                    });
                } catch (error) {
                    console.error("AR error:", error);
                    this.renderFallback3DView(container, a, b, c);
                }
            };
            
            // Verificar suporte e iniciar AR
            navigator.xr.isSessionSupported('immersive-ar').then((supported) => {
                if (supported) {
                    enterAR();
                } else {
                    this.renderFallback3DView(container, a, b, c);
                }
            });
            
        } catch (error) {
            console.error("3D rendering error:", error);
            container.innerHTML = `
                <div class="ar-error">
                    <p>Erro ao carregar a visualização 3D. Verifique o console para detalhes.</p>
                    <p>Função: f(x) = ${a}x² ${b >= 0 ? '+' : ''}${b}x ${c >= 0 ? '+' : ''}${c}</p>
                </div>
            `;
        }
    }

    create3DParabola(scene, a, b, c) {
        // Criar geometria da parábola
        const geometry = new THREE.ParametricGeometry((u, v, target) => {
            const x = (u - 0.5) * 10;
            const z = (v - 0.5) * 10;
            const y = a * x * x + b * x + c;
            target.set(x, y, z);
        }, 50, 50);
        
        // Criar material
        const material = new THREE.MeshPhongMaterial({
            color: 0x3b82f6,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8,
            wireframe: false
        });
        
        // Criar malha
        const parabola = new THREE.Mesh(geometry, material);
        scene.add(parabola);
        
        // Adicionar eixos
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);
        
        // Adicionar grade
        const gridHelper = new THREE.GridHelper(10, 10);
        scene.add(gridHelper);
    }

    setupFallback3DScene(canvasId, a, b, c) {
        // Implementação simplificada para navegadores sem WebXR
        const canvas = document.getElementById(canvasId);
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas });
        
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
        
        // Luzes
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Criar parábola
        this.create3DParabola(scene, a, b, c);
        
        // Controles de órbita
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        camera.position.z = 5;
        
        // Animação
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };
        
        animate();
    }

    adjustARZoom(factor) {
        // Ajustar zoom na cena AR
        if (this.camera) {
            this.camera.fov /= factor;
            this.camera.updateProjectionMatrix();
        }
        this.calculator.showToast(`Zoom ${factor > 1 ? 'aumentado' : 'diminuído'}`, 'success');
    }

    rotateModel() {
        // Rotacionar o modelo 3D
        if (this.parabola) {
            this.parabola.rotation.y += Math.PI / 4;
        }
        this.calculator.showToast('Modelo rotacionado', 'success');
    }

    resetARView() {
        // Resetar visualização AR
        if (this.camera && this.parabola) {
            this.camera.position.set(0, 0, 5);
            this.camera.lookAt(0, 0, 0);
            this.parabola.rotation.set(0, 0, 0);
            this.camera.fov = 75;
            this.camera.updateProjectionMatrix();
        }
        this.calculator.showToast('Visualização resetada', 'success');
    }
}


class QuadraticCalculator {
    constructor() {
        this.initializeElements();
        this.initializeChart();
        this.initializeDecompositionChart();
        this.setupEventListeners();
        this.setupSliderSync();
        this.currentTheme = 'light';
        this.physicsMode = false;
        this.animationFrame = null;
        this.zoomLevel = 1;
        
        // Inicializar AR Viewer
        this.arViewer = new ARViewer(this);
        
        this.calculate();
    }
    

}
}