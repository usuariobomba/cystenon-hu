/**
 * Validação de Formulários - Cystenon HU
 * Valida inputs de nome e telefone com feedback visual em tempo real
 */

(function () {
    'use strict';

    // Configurações de validação
    const CONFIG = {
        name: {
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-ZáéíóöőúüűÁÉÍÓÖŐÚÜŰ\s'-]+$/,
            errorMessages: {
                empty: 'Kérjük, adja meg a nevét',
                invalid: 'Kérjük, csak betűket használjon',
                tooShort: 'A név legalább 2 karakter hosszú legyen',
                tooLong: 'A név maximum 50 karakter hosszú lehet'
            }
        },
        phone: {
            // Aceita formatos: +36301234567, 06301234567, 301234567, etc.
            pattern: /^(\+36|06)?[1-9][0-9]{8}$/,
            errorMessages: {
                empty: 'Kérjük, adja meg a telefonszámát',
                invalid: 'Érvénytelen telefonszám formátum (pl. +36301234567 vagy 06301234567)'
            }
        }
    };

    // Adiciona estilos CSS para feedback visual
    function addValidationStyles() {
        const styleId = 'form-validation-styles';

        // Evita duplicação
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            /* Estilos de validação */
            .input-error {
                border: 2px solid #ef4444 !important;
                background-color: #fee2e2 !important;
            }
            
            .input-success {
                border: 2px solid #10b981 !important;
                background-color: #d1fae5 !important;
            }
            
            .error-message {
                color: #dc2626;
                font-size: 12px;
                margin-top: 5px;
                display: block;
                font-weight: 500;
                animation: fadeIn 0.3s ease-in;
            }
            
            .success-message {
                color: #059669;
                font-size: 12px;
                margin-top: 5px;
                display: block;
                font-weight: 500;
                animation: fadeIn 0.3s ease-in;
            }
            
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(-5px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            /* Shake animation para erros */
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            
            .shake {
                animation: shake 0.5s;
            }
        `;
        document.head.appendChild(style);
    }

    // Remove mensagens de erro/sucesso anteriores
    function clearMessages(input) {
        const container = input.closest('.row_inner') || input.parentElement;
        const oldMessages = container.querySelectorAll('.error-message, .success-message');
        oldMessages.forEach(msg => msg.remove());
    }

    // Mostra mensagem de erro
    function showError(input, message) {
        clearMessages(input);

        input.classList.remove('input-success');
        input.classList.add('input-error', 'shake');

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;

        const container = input.closest('.row_inner') || input.parentElement;
        container.appendChild(errorDiv);

        // Remove a animação de shake após completar
        setTimeout(() => {
            input.classList.remove('shake');
        }, 500);
    }

    // Mostra mensagem de sucesso
    function showSuccess(input) {
        clearMessages(input);

        input.classList.remove('input-error');
        input.classList.add('input-success');
    }

    // Limpa estilos de validação
    function clearValidation(input) {
        clearMessages(input);
        input.classList.remove('input-error', 'input-success', 'shake');
    }

    // Valida campo de nome
    function validateName(input) {
        const value = input.value.trim();
        const config = CONFIG.name;

        if (value === '') {
            showError(input, config.errorMessages.empty);
            return false;
        }

        if (value.length < config.minLength) {
            showError(input, config.errorMessages.tooShort);
            return false;
        }

        if (value.length > config.maxLength) {
            showError(input, config.errorMessages.tooLong);
            return false;
        }

        if (!config.pattern.test(value)) {
            showError(input, config.errorMessages.invalid);
            return false;
        }

        showSuccess(input);
        return true;
    }

    // Valida campo de telefone
    function validatePhone(input) {
        const value = input.value.trim().replace(/[\s\-()]/g, ''); // Remove espaços, hífens e parênteses
        const config = CONFIG.phone;

        if (value === '') {
            showError(input, config.errorMessages.empty);
            return false;
        }

        if (!config.pattern.test(value)) {
            showError(input, config.errorMessages.invalid);
            return false;
        }

        showSuccess(input);
        return true;
    }

    // Valida campo baseado no tipo
    function validateField(input) {
        const name = input.getAttribute('name');

        if (name === 'name') {
            return validateName(input);
        } else if (name === 'phone') {
            return validatePhone(input);
        }

        return true;
    }

    // Configura validação em tempo real para um input
    function setupRealtimeValidation(input) {
        let typingTimer;
        const typingDelay = 500; // Valida 500ms após parar de digitar

        // Validação ao perder o foco
        input.addEventListener('blur', function () {
            if (this.value.trim() !== '') {
                validateField(this);
            }
        });

        // Validação em tempo real enquanto digita
        input.addEventListener('input', function () {
            clearTimeout(typingTimer);

            // Limpa estilos enquanto digita
            if (this.value.trim() === '') {
                clearValidation(this);
            } else {
                // Valida após parar de digitar
                typingTimer = setTimeout(() => {
                    validateField(this);
                }, typingDelay);
            }
        });

        // Limpa validação ao focar
        input.addEventListener('focus', function () {
            // Não limpa se já houver uma mensagem de erro
            if (!this.classList.contains('input-error')) {
                clearValidation(this);
            }
        });
    }

    // Valida formulário completo
    function validateForm(form) {
        let isValid = true;
        const nameInput = form.querySelector('input[name="name"]');
        const phoneInput = form.querySelector('input[name="phone"]');

        if (nameInput && !validateName(nameInput)) {
            isValid = false;
        }

        if (phoneInput && !validatePhone(phoneInput)) {
            isValid = false;
        }

        // Scroll para o primeiro campo com erro
        if (!isValid) {
            const firstError = form.querySelector('.input-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }

        return isValid;
    }

    // Inicializa validação para todos os formulários
    function initValidation() {
        // Adiciona estilos CSS
        addValidationStyles();

        // Seleciona todos os formulários
        const forms = document.querySelectorAll('form.form-vercel');

        forms.forEach(form => {
            // Configura validação em tempo real para cada input
            const nameInputs = form.querySelectorAll('input[name="name"]');
            const phoneInputs = form.querySelectorAll('input[name="phone"]');

            nameInputs.forEach(input => setupRealtimeValidation(input));
            phoneInputs.forEach(input => setupRealtimeValidation(input));

            // Previne submissão se houver erros
            form.addEventListener('submit', function (e) {
                if (!validateForm(this)) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Formulário contém erros de validação');
                    return false;
                }
            });
        });

        console.log('Validação de formulário inicializada para', forms.length, 'formulário(s)');
    }

    // Inicializa quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initValidation);
    } else {
        initValidation();
    }

    // Exporta funções para uso externo se necessário
    window.FormValidation = {
        validateForm: validateForm,
        validateField: validateField
    };

})();
