document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------
    // 1. Lógica da Navegação (Troca de Telas)
    // ------------------------------------------------------------------
    const screens = document.querySelectorAll('.screen');
    
    document.querySelectorAll('[data-target]').forEach(element => {
        element.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-target');
            showScreen(targetId);
        });
    });

    function showScreen(targetId) {
        screens.forEach(screen => {
            screen.style.display = 'none';
        });
        document.getElementById(targetId).style.display = 'flex';
    }


    // ------------------------------------------------------------------
    // 2. Lógica da Senha (Tela de Bloqueio)
    // ------------------------------------------------------------------
    const correctPassword = "24092022"; 
    let enteredPassword = "";
    const passwordDisplay = document.getElementById('password-display');
    const keypadButtons = document.querySelectorAll('.keypad-button');

    keypadButtons.forEach(button => {
        button.addEventListener('click', () => {
            const key = button.getAttribute('data-key');

            if (key === 'X') {
                // Apaga o último caractere
                enteredPassword = enteredPassword.slice(0, -1);
            } else if (keypadButtons.length === 12) {
                // Adiciona a chave (máximo 8 dígitos)
                if (enteredPassword.length < 8) {
                    enteredPassword += key;
                }
            }

            updatePasswordDisplay();
            checkPassword();
        });
    });

    function updatePasswordDisplay() {
        // Mostra a senha como pontos, mas com a quantidade correta de dígitos
        const maskedPassword = '*'.repeat(enteredPassword.length);
        passwordDisplay.textContent = maskedPassword;

        if (enteredPassword.length >= 8 && enteredPassword !== correctPassword) {
            // Se a senha estiver completa e errada, limpa após um pequeno atraso
            passwordDisplay.style.backgroundColor = '#ffcccc';
            setTimeout(() => {
                enteredPassword = "";
                passwordDisplay.textContent = "";
                passwordDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            }, 500);
        }
    }

    function checkPassword() {
        if (enteredPassword.length === 8 && enteredPassword === correctPassword) {
            passwordDisplay.style.backgroundColor = '#ccffcc';
            setTimeout(() => {
                showScreen('menu-screen');
                passwordDisplay.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                enteredPassword = "";
            }, 300);
        }
    }


    // ------------------------------------------------------------------
    // 3. Lógica do Contador de Tempo (Calendário do Amor)
    // ------------------------------------------------------------------
    // Data de início do namoro: 24 de Setembro de 2022
    const startDate = new Date('2022-09-24T00:00:00');

    function updateCounter() {
        const now = new Date();
        const diff = now - startDate;

        if (diff < 0) return; 

        // Cálculos detalhados
        const totalSeconds = Math.floor(diff / 1000);
        const totalMinutes = Math.floor(totalSeconds / 60);
        const totalHours = Math.floor(totalMinutes / 60);
        const totalDays = Math.floor(totalHours / 24);

        // Uso a diferença de anos/meses/dias para maior precisão visual
        const currentYears = now.getFullYear() - startDate.getFullYear();
        let currentMonths = now.getMonth() - startDate.getMonth();
        let currentDays = now.getDate() - startDate.getDate();

        if (currentDays < 0) {
            currentMonths--;
            const daysInLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
            currentDays += daysInLastMonth;
        }

        if (currentMonths < 0) {
            currentYears--;
            currentMonths += 12;
        }

        // Horas, Minutos e Segundos
        const seconds = totalSeconds % 60;
        const minutes = totalMinutes % 60;
        const hours = totalHours % 24;

        // Atualiza o DOM
        document.getElementById('years').textContent = String(currentYears).padStart(2, '0');
        document.getElementById('months').textContent = String(currentMonths).padStart(2, '0');
        document.getElementById('days').textContent = String(currentDays).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    // Inicializa e atualiza a cada segundo
    updateCounter();
    setInterval(updateCounter, 1000);


    // ------------------------------------------------------------------
    // 4. Lógica do Jogo da Memória
    // ------------------------------------------------------------------
    const gameGrid = document.getElementById('game-grid');
    const imageCount = 8; // 8 pares = 16 cartas
    let cardsArray = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let matchesFound = 0;

    // Cria o array de cartas (pares de 1 a 8)
    for (let i = 1; i <= imageCount; i++) {
        cardsArray.push(i, i); 
    }

    // Embaralha as cartas
    cardsArray.sort(() => 0.5 - Math.random());

    // Cria o tabuleiro no HTML
    cardsArray.forEach((value, index) => {
        const card = document.createElement('div');
        card.classList.add('memory-card');
        card.setAttribute('data-value', value);
        
        // Face da frente (a foto)
        const frontFace = document.createElement('div');
        frontFace.classList.add('front-face', `card-img-${value}`);

        // Face de trás (o ponto de interrogação)
        const backFace = document.createElement('div');
        backFace.classList.add('back-face');
        
        card.appendChild(frontFace);
        card.appendChild(backFace);
        gameGrid.appendChild(card);
    });

    // Lógica do Clique
    document.querySelectorAll('.memory-card').forEach(card => card.addEventListener('click', flipCard));

    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;

        this.classList.add('flipped');

        if (!firstCard) {
            firstCard = this;
            return;
        }

        secondCard = this;
        lockBoard = true;

        checkForMatch();
    }

    function checkForMatch() {
        let isMatch = firstCard.getAttribute('data-value') === secondCard.getAttribute('data-value');

        isMatch ? disableCards() : unflipCards();
    }

    function disableCards() {
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        // Adiciona a classe 'match' para destaque
        firstCard.classList.add('match');
        secondCard.classList.add('match');

        matchesFound++;

        // Checa vitória
        if (matchesFound === imageCount) {
            setTimeout(() => {
                alert('Parabéns! Você encontrou todos os pares! ❤️');
                resetGame();
            }, 500);
        } else {
            resetBoard();
        }
    }

    function unflipCards() {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [firstCard, secondCard, lockBoard] = [null, null, false];
    }
    
    // Função para reiniciar o jogo
    function resetGame() {
        // Reinicializa variáveis
        matchesFound = 0;
        cardsArray.sort(() => 0.5 - Math.random());
        gameGrid.innerHTML = ''; 

        // Reconstroi o tabuleiro com as novas posições
        cardsArray.forEach((value, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.setAttribute('data-value', value);
            
            const frontFace = document.createElement('div');
            frontFace.classList.add('front-face', `card-img-${value}`);

            const backFace = document.createElement('div');
            backFace.classList.add('back-face');
            
            card.appendChild(frontFace);
            card.appendChild(backFace);
            gameGrid.appendChild(card);
        });

        // Reaplica os listeners
        document.querySelectorAll('.memory-card').forEach(card => card.addEventListener('click', flipCard));
    }


    // ------------------------------------------------------------------
    // 5. Lógica da Nota de Amor
    // ------------------------------------------------------------------
    const letterEnvelope = document.querySelector('.love-letter-envelope');
    const letterText = document.getElementById('love-letter-text');
    let isLetterOpen = false;

    window.openLetter = function() {
        if (!isLetterOpen) {
            letterEnvelope.style.opacity = 0;
            letterText.classList.add('open');
            isLetterOpen = true;
            setTimeout(() => {
                letterEnvelope.style.display = 'none';
            }, 300);
        }
    }

    // ------------------------------------------------------------------
    // 6. Lógica da Pilha de Memórias (Stack)
    // ------------------------------------------------------------------
    const stackContainer = document.querySelector('.stack-container');
    const stackPhotos = document.querySelectorAll('.stack-photo');
    // A foto de cima no HTML é a de índice 0 (memoria_8.jpg)
    let currentPhotoIndex = 0; 

    if (stackContainer) {
        stackContainer.addEventListener('click', () => {
            
            // 1. Checa se todas as fotos já foram 'passadas'
            if (currentPhotoIndex >= stackPhotos.length) {
                // Reinicia a pilha (faz as fotos reaparecerem)
                stackPhotos.forEach(photo => {
                    photo.classList.remove('hidden-photo');
                });
                currentPhotoIndex = 0;
                return; 
            }

            // 2. Seleciona a foto atual (a mais visível no topo da pilha)
            const photoToHide = stackPhotos[currentPhotoIndex];
            
            // 3. Aplica a animação de sumir
            photoToHide.classList.add('hidden-photo');

            // 4. Passa para a próxima foto
            currentPhotoIndex++;
        });
    }

});
                          
