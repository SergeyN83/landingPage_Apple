import Swiper from '../lib/swiper-bundle.esm.browser.min.js';

// Simplebar

new SimpleBar(document.querySelector('.country__list'), {
    classNames: {
        scrollbar: 'country__scrollbar',
        track: 'country__track'
    }
});

// Slider

new Swiper('.goods__block', {
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
        320: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        },
        1024: {
            slidesPerView: 2,
            spaceBetween: 24
        },
        1440: {
            slidesPerView: 3,
            spaceBetween: 24
        }
    },
    navigation: {
        prevEl: '.goods__arrow_prev',
        nextEl: '.goods__arrow_next'
    },
    preventClicks: true,
    a11y: false
});

// modal

const productMore = document.querySelectorAll('.product__more'),
    modal = document.querySelector('.modal'),
    closeModal = (event) => {
        if (
            (event.type === 'keyup' && event.key === 'Escape') || 
            (event.type === 'click' && event.target === modal)
        ) {
            modal.classList.remove('modal_open');
            window.removeEventListener('keyup', closeModal);
        }
    };

productMore.forEach((btn) => {
    btn.addEventListener('click', () => {
        modal.classList.add('modal_open');
        window.addEventListener('keyup', closeModal);
    });
});

modal.addEventListener('click', closeModal);

// Placeholder

const formPlaceholder = document.querySelectorAll('.form__placeholder'),
    formInput = document.querySelectorAll('.form__input');

formInput.forEach((input, i) => {
    input.addEventListener('focus', () => {
        formPlaceholder[i].classList.add('form__placeholder_active');
    });

    input.addEventListener('blur', () => {
        if (input.value === '') {
            formPlaceholder[i].classList.remove('form__placeholder_active');
        }
    });
});

// currency 

const dataCurrency = {};

const formatCurrency = (value, currency) => {
    return new Intl.NumberFormat('EU', {
        style: 'currency',
        currency,
        maximumFractionDigits: 2
    }).format(value);
};

const showPrice = (currency = 'USD') => {
    const priceElems = document.querySelectorAll('[data-price]');

    priceElems.forEach((elem) => {
        elem.textContent = formatCurrency(elem.dataset.price * dataCurrency[currency], currency);
    });
};

const myHeaders = new Headers();
myHeaders.append("apikey", "CUjFP29BSazgsWfkPGu2jvhZO1WXX9yG");

const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
};

fetch("https://api.apilayer.com/fixer/latest?base=USD", requestOptions)
    .then(response => response.json())
    .then(result => {
        Object.assign(dataCurrency, result.rates);
        showPrice();
    })
    .catch(error => console.log('error', error));

// popup menu - choises

const countryBtn = document.querySelector('.country__btn'),
    countryWrapper = document.querySelector('.country__wrapper');

countryBtn.addEventListener('click', () => {
    countryWrapper.classList.toggle('country__wrapper_open');
});

countryWrapper.addEventListener('click', ({target}) => {
    if (target.classList.contains('country__choise')) {
        // countryBtn.textContent = target.textContent.split(',')[0]; //страна
        // countryBtn.textContent = target.textContent.slice(-3); //slice - наименование валюты
        countryBtn.textContent = target.dataset.currency; // наименование валюты
        countryWrapper.classList.remove('country__wrapper_open');
        showPrice(target.dataset.currency);
    }
});

// Timer

const declOfNum = (n, titles) => titles[n % 10 === 1 && n % 100 !== 11 ?
    0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];

const timer = deadline => {

    const unitDay = document.querySelector('.timer__unit_day'),
        unitHour = document.querySelector('.timer__unit_hour'),
        unitMin = document.querySelector('.timer__unit_min'),
        descriptionDay = document.querySelector('.timer__unit-description_day'),
        descriptionHour = document.querySelector('.timer__unit-description_hour'),
        descriptionMin = document.querySelector('.timer__unit-description_min');

    const getTimeRemaning = () => {
        const dateStop = new Date(deadline).getTime(),
            dateNow = Date.now(),
            timeRemaning = dateStop - dateNow,

            minutes = Math.floor(timeRemaning / 1000 / 60 % 60),
            hours = Math.floor(timeRemaning / 1000 / 60 / 60 % 24),
            days = Math.floor(timeRemaning / 1000 / 60 / 60 / 24);

        return { timeRemaning, minutes, hours, days };
    };

    const start = () => {
        const timer = getTimeRemaning();

        unitDay.textContent = timer.days;
        unitHour.textContent = timer.hours;
        unitMin.textContent = timer.minutes;

        descriptionDay.textContent = declOfNum(timer.days, ['день', 'дня' , 'дней']);
        descriptionHour.textContent = declOfNum(timer.hours, ['час', 'часа', 'часов']);
        descriptionMin.textContent = declOfNum(timer.minutes, ['минута', 'минуты', 'минут']);

        const timerId = setTimeout(start, 60000);

        if (timer.timeRemaning < 0) {
            clearTimeout(timerId);
            unitDay.textContent = '0';
            unitHour.textContent = '0';
            unitMin.textContent = '0';
        }
    };

    start();
};

timer('2023/09/07 20:00');