document.addEventListener('DOMContentLoaded', function() {
    // ========== МОБИЛЬНОЕ МЕНЮ ==========
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileOverlay = document.getElementById('mobileOverlay');
    const mobileClose = document.getElementById('mobileClose');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function openMobileMenu() {
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (burger) burger.addEventListener('click', openMobileMenu);
    if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

    // ========== ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ ==========
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========== КНОПКА НАВЕРХ ==========
    const scrollTopBtn = document.getElementById('scrollTop');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ========== АНИМАЦИЯ ЧИСЕЛ В СТАТИСТИКЕ ==========
    const statNumbers = document.querySelectorAll('.stat-num[data-target]');
    const statsSection = document.querySelector('.hero__stats');
    let animated = false;

    function animateNumbers() {
        if (animated) return;
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            if (isNaN(target)) return;
            let current = 0;
            const increment = target / 50;
            const updateNumber = () => {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    requestAnimationFrame(updateNumber);
                } else {
                    stat.textContent = target;
                }
            };
            updateNumber();
        });
        animated = true;
    }

    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumbers();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // ========== ТАБЫ КАТАЛОГА ==========
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            tabPanes.forEach(pane => {
                pane.classList.remove('active');
                if (pane.id === `tab-${tab}`) {
                    pane.classList.add('active');
                }
            });
        });
    });

    // ========== ПОИСК ПО ТОВАРАМ ==========
    const searchInput = document.getElementById('searchInput');
    const allProducts = document.querySelectorAll('.product-card');

    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            allProducts.forEach(product => {
                const name = product.dataset.name ? product.dataset.name.toLowerCase() : '';
                if (name.includes(query)) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    }

    // ========== СЛАЙДЕР ОТЗЫВОВ ==========
    const track = document.getElementById('reviewsTrack');
    const prevBtn = document.getElementById('revPrev');
    const nextBtn = document.getElementById('revNext');
    const dotsContainer = document.getElementById('revDots');
    let currentSlide = 0;
    let slides = [];
    let slideWidth = 0;

    function initSlider() {
        if (!track) return;
        slides = Array.from(track.children);
        if (slides.length === 0) return;
        slideWidth = slides[0].offsetWidth + 20; // включая margin
        updateSlider();
        createDots();
    }

    function updateSlider() {
        track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
        updateDots();
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        slides.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                currentSlide = i;
                updateSlider();
            });
            dotsContainer.appendChild(dot);
        });
        updateDots();
    }

    function updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSlider();
            } else {
                currentSlide = slides.length - 1;
                updateSlider();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentSlide < slides.length - 1) {
                currentSlide++;
                updateSlider();
            } else {
                currentSlide = 0;
                updateSlider();
            }
        });
    }

    window.addEventListener('resize', () => {
        if (slides.length > 0) {
            slideWidth = slides[0].offsetWidth + 20;
            updateSlider();
        }
    });

    initSlider();

    // ========== ТАЙМЕР АКЦИИ ==========
    function startTimer(duration) {
        const timerHours = document.getElementById('tHours');
        const timerMinutes = document.getElementById('tMinutes');
        const timerSeconds = document.getElementById('tSeconds');
        if (!timerHours || !timerMinutes || !timerSeconds) return;

        let time = duration;
        const interval = setInterval(() => {
            const hours = Math.floor(time / 3600);
            const minutes = Math.floor((time % 3600) / 60);
            const seconds = time % 60;

            timerHours.textContent = hours.toString().padStart(2, '0');
            timerMinutes.textContent = minutes.toString().padStart(2, '0');
            timerSeconds.textContent = seconds.toString().padStart(2, '0');

            if (--time < 0) {
                clearInterval(interval);
                timerHours.textContent = '00';
                timerMinutes.textContent = '00';
                timerSeconds.textContent = '00';
            }
        }, 1000);
    }

    startTimer(86400); // 24 часа

    // ========== ВАЛИДАЦИЯ ФОРМЫ ==========
    const orderForm = document.getElementById('orderForm');
    const modalOverlay = document.getElementById('modalOverlay');
    const modalClose = document.getElementById('modalClose');
    const nameInput = document.getElementById('fName');
    const phoneInput = document.getElementById('fPhone');
    const emailInput = document.getElementById('fEmail');
    const agreementCheck = document.getElementById('fAgreement');
    const submitBtn = document.getElementById('submitBtn');
    const agreementGroup = document.getElementById('fg-agreement');
    const agreementError = document.getElementById('err-agreement');
    const emailGroup = document.getElementById('fg-email');
    const emailError = document.getElementById('err-email');

    // Маска для телефона
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            let formatted = '';
            if (value.length > 0) {
                formatted = '+7';
                if (value.length > 1) {
                    formatted += ' (' + value.slice(1, 4);
                }
                if (value.length >= 5) {
                    formatted += ') ' + value.slice(4, 7);
                }
                if (value.length >= 8) {
                    formatted += '-' + value.slice(7, 9);
                }
                if (value.length >= 10) {
                    formatted += '-' + value.slice(9, 11);
                }
            }
            this.value = formatted;
        });
    }

    // Функция обновления состояния кнопки
    function updateSubmitButton() {
        if (agreementCheck && submitBtn) {
            if (!agreementCheck.checked) {
                submitBtn.classList.add('btn-grey');
            } else {
                submitBtn.classList.remove('btn-grey');
            }
        }
    }

    if (agreementCheck) {
        agreementCheck.addEventListener('change', updateSubmitButton);
    }
    updateSubmitButton();

    // Функция валидации
    function validateForm() {
        let isValid = true;

        // Имя
        const nameGroup = document.getElementById('fg-name');
        if (!nameInput.value.trim()) {
            nameGroup.classList.add('error');
            isValid = false;
        } else {
            nameGroup.classList.remove('error');
        }

        // Телефон
        const phoneGroup = document.getElementById('fg-phone');
        const phoneValue = phoneInput.value.replace(/\D/g, '');
        if (phoneValue.length < 11) {
            phoneGroup.classList.add('error');
            isValid = false;
        } else {
            phoneGroup.classList.remove('error');
        }

        // Email (необязательное поле, но если заполнено — проверяем формат)
        if (emailInput) {
            const emailValue = emailInput.value.trim();
            if (emailValue !== '') {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailPattern.test(emailValue)) {
                    emailGroup.classList.add('error');
                    emailError.style.display = 'block';
                    isValid = false;
                } else {
                    emailGroup.classList.remove('error');
                    emailError.style.display = 'none';
                }
            } else {
                emailGroup.classList.remove('error');
                emailError.style.display = 'none';
            }
        }

        // Соглашение
        if (!agreementCheck.checked) {
            agreementGroup.classList.add('error');
            agreementError.style.display = 'block';
            setTimeout(() => {
                agreementError.style.display = 'none';
                agreementGroup.classList.remove('error');
            }, 2000);
            isValid = false;
        } else {
            agreementGroup.classList.remove('error');
        }

        return isValid;
    }

    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm()) {
                modalOverlay.classList.add('active');
                orderForm.reset();
                updateSubmitButton(); // после сброса кнопка станет серой
            }
        });
    }

    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
        });
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
            }
        });
    }

    // ========== КНОПКИ "ЗАКАЗАТЬ" В КАРТОЧКАХ ==========
    document.querySelectorAll('.product-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const productName = this.dataset.product || 'товар';
            const productField = document.getElementById('fProduct');
            if (productField) {
                productField.value = productName;
            }
            document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
        });
    });

    // ========== ФИКСИРОВАННЫЙ ХЕДЕР ПРИ СКРОЛЛЕ ==========
    const header = document.getElementById('header');
    if (header) {
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > lastScroll && currentScroll > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            lastScroll = currentScroll;
        });
    }

    // ========== РАБОТА ССЫЛОК В ФУТЕРЕ (МОДАЛЬНЫЕ ОКНА) ==========
    document.querySelectorAll('.footer-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const modalId = link.dataset.modal; // privacy, terms, delivery, about, faq
            const modal = document.getElementById(`modal${modalId.charAt(0).toUpperCase() + modalId.slice(1)}`);
            if (modal) {
                modal.classList.add('active');
            }
        });
    });

    // Закрытие модальных окон (общее для всех)
    document.querySelectorAll('.modal-overlay .modal-close, .modal-overlay .btn-yellow').forEach(btn => {
        btn.addEventListener('click', () => {
            btn.closest('.modal-overlay').classList.remove('active');
        });
    });
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
            }
        });
    });

    // ========== КАРУСЕЛЬ ЭКСПЕРТОВ ==========
    const mastersGrid = document.getElementById('mastersGrid');
    const masterPrev = document.getElementById('masterPrev');
    const masterNext = document.getElementById('masterNext');
    if (mastersGrid && masterPrev && masterNext) {
        const scrollAmount = 300;
        masterPrev.addEventListener('click', () => {
            mastersGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
        masterNext.addEventListener('click', () => {
            mastersGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });
    }

    // ========== ЧАТ ПОДДЕРЖКИ ==========
    const chatBtn = document.getElementById('chatBtn');
    const chatModal = document.getElementById('chatModal');
    if (chatBtn && chatModal) {
        chatBtn.addEventListener('click', () => {
            chatModal.classList.add('active');
        });
    }

    // ========== ПРИ КЛИКЕ НА ССЫЛКУ "ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ" В ФОРМЕ ==========
    const privacyLink = document.getElementById('privacyLink');
    if (privacyLink) {
        privacyLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('modalPrivacy').classList.add('active');
        });
    }

    // ========== ПРИ КЛИКЕ НА ССЫЛКУ ПОЛЬЗОВАТЕЛЬСКОГО СОГЛАШЕНИЯ ==========
    const agreementLink = document.getElementById('agreementLink');
    if (agreementLink) {
        agreementLink.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('modalTerms').classList.add('active');
        });
    }

    // ========== ВЫБОР ЭКСПЕРТА И ЗАМЕНА В БЛОКЕ ЗАЯВКИ И В КАТАЛОГЕ ==========
    const masterCards = document.querySelectorAll('.master-card');
    const mascotAvatar = document.getElementById('mascotAvatar');
    const mascotBubble = document.getElementById('mascotBubble');
    const orderMascot = document.getElementById('orderMascot');
    const catalogAvatar = document.getElementById('catalogMascotAvatar');
    const catalogBubble = document.getElementById('catalogMascotBubble');

    if (masterCards.length > 0 && mascotAvatar && mascotBubble && catalogAvatar && catalogBubble) {
        // Установим начальное активное состояние на Мастере Штрих
        masterCards.forEach(card => {
            if (card.querySelector('h3')?.textContent === 'Мастер Штрих') {
                card.classList.add('active');
            }
        });

        masterCards.forEach(card => {
            card.addEventListener('click', function() {
                masterCards.forEach(c => c.classList.remove('active'));
                this.classList.add('active');

                const avatar = this.dataset.avatar || '🎩';
                const quote = this.dataset.quote || 'Не знаете с чего начать? Просто напишите нам — мы подберём всё сами!';
                const name = this.querySelector('h3')?.textContent || 'Мастер';

                mascotAvatar.textContent = avatar;
                mascotBubble.innerHTML = `<strong>${name}</strong> говорит:<br><em>«${quote}»</em>`;

                catalogAvatar.textContent = avatar;
                catalogBubble.innerHTML = `<strong>${name}</strong>: ${quote}`;

                orderMascot.style.transform = 'scale(1.02)';
                setTimeout(() => orderMascot.style.transform = 'scale(1)', 200);
            });
        });
    }

    // ========== ПРОГРАММА ЛОЯЛЬНОСТИ (МОДАЛЬНОЕ ОКНО) ==========
    const loyaltyBtn = document.getElementById('loyaltyBtn');
    const loyaltyModal = document.getElementById('modalLoyalty');
    if (loyaltyBtn && loyaltyModal) {
        loyaltyBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loyaltyModal.classList.add('active');
        });
    }

    // ========== МОДАЛЬНОЕ ОКНО КОНТАКТОВ ==========
    const modalContacts = document.getElementById('modalContacts');
    document.querySelectorAll('a[href="#contacts"]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (modalContacts) modalContacts.classList.add('active');
        });
    });
});