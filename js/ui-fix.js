/**
 * UI Fix Script - Cystenon HU
 * Restaura funcionalidades visuais sem interferir nos formulários
 */

(function () {
    'use strict';

    // ========================================
    // 1. QUIZ FUNCTIONALITY (.testslider)
    // ========================================
    function initQuiz() {
        const testSlider = document.querySelector('.testslider');
        if (!testSlider) return;

        const slides = testSlider.querySelectorAll('li');
        let currentSlide = 0;

        // Mostrar apenas o primeiro slide inicialmente
        slides.forEach((slide, index) => {
            slide.style.display = index === 0 ? 'block' : 'none';
            slide.style.opacity = index === 0 ? '1' : '0';
        });

        // Função para mostrar próximo slide
        function showNextSlide() {
            if (currentSlide >= slides.length - 1) return;

            // Esconder slide atual com fade
            slides[currentSlide].style.opacity = '0';
            setTimeout(() => {
                slides[currentSlide].style.display = 'none';
                currentSlide++;

                // Mostrar próximo slide com fade
                slides[currentSlide].style.display = 'block';
                setTimeout(() => {
                    slides[currentSlide].style.opacity = '1';
                }, 50);
            }, 300);
        }

        // Botão "Começar Teste"
        const beginButton = testSlider.querySelector('.js-begintest');
        if (beginButton) {
            beginButton.addEventListener('click', showNextSlide);
        }

        // Botões de resposta (labels com classe js-checkanswer)
        const answerButtons = testSlider.querySelectorAll('.js-checkanswer');
        answerButtons.forEach(button => {
            button.addEventListener('click', function () {
                setTimeout(showNextSlide, 300); // Delay para dar tempo de selecionar
            });
        });

        // Botão de resultado final
        const resultButtons = testSlider.querySelectorAll('.js-getResult');
        resultButtons.forEach(button => {
            button.addEventListener('click', function () {
                setTimeout(showNextSlide, 300);
            });
        });
    }

    // ========================================
    // 2. REVIEW SLIDER (.review-slider)
    // ========================================
    function initReviewSlider() {
        const reviewSlider = document.querySelector('.review-slider');
        if (!reviewSlider) return;

        const reviews = reviewSlider.querySelectorAll('li');
        if (reviews.length === 0) return;

        let currentReview = 0;

        // Esconder todos os reviews exceto o primeiro
        reviews.forEach((review, index) => {
            review.style.display = index === 0 ? 'list-item' : 'none';
            review.style.opacity = index === 0 ? '1' : '0';
        });

        // Função para mudar review
        function changeReview(direction) {
            reviews[currentReview].style.opacity = '0';

            setTimeout(() => {
                reviews[currentReview].style.display = 'none';

                if (direction === 'next') {
                    currentReview = (currentReview + 1) % reviews.length;
                } else {
                    currentReview = (currentReview - 1 + reviews.length) % reviews.length;
                }

                reviews[currentReview].style.display = 'list-item';
                setTimeout(() => {
                    reviews[currentReview].style.opacity = '1';
                }, 50);
            }, 300);
        }

        // Criar controles de navegação
        const sliderContainer = reviewSlider.parentElement;

        // Container para as setas
        const controls = document.createElement('div');
        controls.style.cssText = 'text-align: center; margin-top: 20px;';

        // Botão anterior
        const prevBtn = document.createElement('button');
        prevBtn.innerHTML = '&#8592; Anterior';
        prevBtn.style.cssText = 'background: #10b981; color: white; border: none; padding: 10px 20px; margin: 0 10px; cursor: pointer; border-radius: 5px; font-size: 16px;';
        prevBtn.addEventListener('click', () => changeReview('prev'));

        // Botão próximo
        const nextBtn = document.createElement('button');
        nextBtn.innerHTML = 'Próximo &#8594;';
        nextBtn.style.cssText = 'background: #10b981; color: white; border: none; padding: 10px 20px; margin: 0 10px; cursor: pointer; border-radius: 5px; font-size: 16px;';
        nextBtn.addEventListener('click', () => changeReview('next'));

        controls.appendChild(prevBtn);
        controls.appendChild(nextBtn);
        sliderContainer.appendChild(controls);

        // Autoplay (opcional - 5 segundos)
        setInterval(() => {
            changeReview('next');
        }, 5000);
    }

    // ========================================
    // 3. MENU DE NAVEGAÇÃO - SMOOTH SCROLL
    // ========================================
    function initSmoothScroll() {
        const menuLinks = document.querySelectorAll('[class^="jsmenu"]');

        menuLinks.forEach(link => {
            link.addEventListener('click', function (e) {
                const href = this.getAttribute('href');

                // Verificar se é um link de âncora
                if (href && href.startsWith('#')) {
                    e.preventDefault();

                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);

                    if (targetElement) {
                        // Smooth scroll
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });

                        // Atualizar menu ativo
                        menuLinks.forEach(l => l.classList.remove('active'));
                        this.classList.add('active');
                    }
                }
            });
        });
    }

    // ========================================
    // 4. ACCORDION FAQ (.js-show-quest)
    // ========================================
    function initFAQAccordion() {
        const faqHeaders = document.querySelectorAll('.js-show-quest');

        faqHeaders.forEach(header => {
            // Esconder todas as respostas inicialmente
            const answer = header.nextElementSibling;
            if (answer && answer.classList.contains('hidden-text-q')) {
                answer.style.display = 'none';
            }

            // Toggle ao clicar
            header.addEventListener('click', function () {
                const answer = this.nextElementSibling;

                if (answer && answer.classList.contains('hidden-text-q')) {
                    const isVisible = answer.style.display === 'block';

                    // Esconder todas as outras respostas
                    document.querySelectorAll('.hidden-text-q').forEach(ans => {
                        ans.style.display = 'none';
                    });

                    // Toggle esta resposta
                    answer.style.display = isVisible ? 'none' : 'block';

                    // Remover classe active de todos
                    faqHeaders.forEach(h => h.classList.remove('active'));

                    // Adicionar active se estiver abrindo
                    if (!isVisible) {
                        this.classList.add('active');
                    }
                }
            });
        });
    }

    // ========================================
    // 5. ADICIONAR TRANSIÇÕES CSS
    // ========================================
    function addTransitions() {
        const style = document.createElement('style');
        style.textContent = `
            .testslider li {
                transition: opacity 0.3s ease-in-out;
            }
            .review-slider li {
                transition: opacity 0.3s ease-in-out;
            }
            .hidden-text-q {
                transition: all 0.3s ease-in-out;
            }
        `;
        document.head.appendChild(style);
    }

    // ========================================
    // INICIALIZAR TUDO QUANDO O DOM ESTIVER PRONTO
    // ========================================
    function init() {
        addTransitions();
        initQuiz();
        initReviewSlider();
        initSmoothScroll();
        initFAQAccordion();

        console.log('✅ UI Fix Script carregado com sucesso!');
    }

    // Verificar se o DOM já está pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
