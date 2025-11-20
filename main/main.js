
(function () {
    const hamburger = document.querySelector('.hamburger-menu');
    const dropdown = document.getElementById('navDropdown');

    if (!hamburger || !dropdown) return;

    function toggleMenu() {
        dropdown.classList.toggle('open');
        dropdown.setAttribute('aria-hidden',
            dropdown.classList.contains('open') ? 'false' : 'true'
        );
    }

    // open & close using hamburger menu
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    // close when clicking outside
    document.addEventListener('click', (e) => {
        if (dropdown.classList.contains('open') && !dropdown.contains(e.target)) {
            toggleMenu();
        }
    });

    // close using ESC key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dropdown.classList.contains('open')) {
            toggleMenu();
        }
    });
})();

(function () {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScrollTop = 0;
    const scrollThreshold = 10;

    window.addEventListener('scroll', () => {
        const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

        if (currentScrollTop > 100) {
            if (currentScrollTop > lastScrollTop && currentScrollTop > scrollThreshold) {
                header.classList.add('header-hidden');
            } else if (currentScrollTop < lastScrollTop) {
                header.classList.remove('header-hidden');
            }
        } else {
            header.classList.remove('header-hidden');
        }

        lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop;
    });

    document.addEventListener('mousemove', (e) => {
        if (e.clientY < 100) {
            header.classList.remove('header-hidden');
        }
    });
})();

