document.addEventListener('DOMContentLoaded', () => {
    const langElements = document.querySelectorAll('[data-lang-en], [data-lang-my]');
    const langButtons = {
        en: [document.getElementById('lang-en'), document.getElementById('lang-en-mobile')],
        my: [document.getElementById('lang-my'), document.getElementById('lang-my-mobile')]
    };

    const setLanguage = (lang) => {
        langElements.forEach(el => {
            const text = el.dataset[lang === 'my' ? 'langMy' : 'langEn'];
            if (text) {
                el.innerText = text;
            }
        });

        Object.keys(langButtons).forEach(key => {
            langButtons[key].forEach(btn => {
                if (key === lang) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
        });
        localStorage.setItem('zentho_language', lang);
    };

    Object.keys(langButtons).forEach(key => {
        langButtons[key].forEach(btn => {
            btn.addEventListener('click', () => setLanguage(key));
        });
    });

    const savedLang = localStorage.getItem('zentho_language') || 'en';
    setLanguage(savedLang);

    // --- Mobile Menu ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    mobileMenu.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });

    // --- Smooth Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = document.getElementById('navbar').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });

    // --- Modal Logic ---
    const modal = document.getElementById('create-post-modal');
    const openModalButton = document.getElementById('open-post-modal-button');
    const closeModalButton = document.getElementById('close-post-modal-button');
    const closeModalX = document.getElementById('close-modal-x');
    const postForm = document.getElementById('create-post-form');
    const modalOverlay = modal.querySelector('.modal-overlay');

    const openModal = () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        document.body.style.overflow = 'hidden';
    };
    const closeModal = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        postForm.reset();
        document.body.style.overflow = 'auto';
    };

    openModalButton.addEventListener('click', openModal);
    closeModalButton.addEventListener('click', closeModal);
    closeModalX.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // --- Post Management ---
    const postsContainer = document.getElementById('posts-container');
    const initialPosts = [
        {
            en: { title: "We've Launched Our New Website!", text: "Welcome to the new digital home of ZenTho! We've redesigned our website to better showcase our services and portfolio. Explore the new sections and let us know what you think." },
            my: { title: "ကျွန်ုပ်တို့၏ ဝဘ်ဆိုဒ်အသစ်ကို လွှင့်တင်လိုက်ပါပြီ။", text: "ZenTho ၏ ဒစ်ဂျစ်တယ်နေရာသစ်မှ ကြိုဆိုပါသည်။ ကျွန်ုပ်တို့၏ ဝန်ဆောင်မှုများနှင့် လက်ရာများကို ပိုမိုကောင်းမွန်စွာ ပြသနိုင်ရန် ဝဘ်ဆိုဒ်ကို ပြန်လည်ဒီဇိုင်းဆွဲထားပါသည်။ အပိုင်းအသစ်များကို လေ့လာပြီး သင်၏အမြင်ကို ပြောပြပေးပါ။" },
            imageUrl: "https://placehold.co/1200x600/4DD0E1/FFFFFF?text=New+Website+Launched",
            date: new Date('2025-08-30T10:00:00+06:30')
        },
        {
            en: { title: "Now Offering Game Development", text: "Big news! ZenTho is officially expanding its services to include full-cycle game development. Our team is ready to bring your gaming ideas to life." },
            my: { title: "ယခု Game Development ဝန်ဆောင်မှုပါ ရရှိနိုင်ပါပြီ။", text: "သတင်းကောင်းပါ။ ZenTho သည် Game ရေးဆွဲခြင်းဝန်ဆောင်မှုကို တရားဝင်တိုးချဲ့လိုက်ပြီဖြစ်ပါသည်။ ကျွန်ုပ်တို့အဖွဲ့သည် သင်၏ Game စိတ်ကူးများကို အသက်သွင်းရန် အသင့်ရှိနေပါသည်။" },
            imageUrl: "https://placehold.co/1200x600/80DEEA/FFFFFF?text=Now+Offering+Game+Dev",
            date: new Date('2025-08-25T15:30:00+06:30')
        }
    ];
    let allPosts = [...initialPosts];

    const createPostElement = (post) => {
        const currentLang = localStorage.getItem('zentho_language') || 'en';
        const postLang = post[currentLang] || post['en'];
        const myanmarTime = new Intl.DateTimeFormat('en-US', { timeZone: 'Asia/Yangon', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }).format(post.date);

        const postElement = document.createElement('div');
        postElement.className = 'bg-white rounded-xl card-shadow overflow-hidden';
        postElement.innerHTML = `
            <img src="${post.imageUrl}" alt="${postLang.title}" class="w-full h-64 object-cover" onerror="this.onerror=null;this.src='https://placehold.co/1200x600/CCCCCC/FFFFFF?text=Image+Not+Found';">
            <div class="p-8">
                <p class="text-sm text-gray-500 mb-2">${myanmarTime}</p>
                <h3 class="text-2xl font-bold text-gray-800 mb-4">${postLang.title}</h3>
                <p class="text-gray-700 leading-relaxed">${postLang.text.replace(/\n/g, '<br>')}</p>
            </div>
        `;
        return postElement;
    };

    const renderPosts = () => {
        postsContainer.innerHTML = '';
        allPosts.forEach(post => postsContainer.appendChild(createPostElement(post)));
    };
    
    langButtons.en.forEach(btn => btn.addEventListener('click', renderPosts));
    langButtons.my.forEach(btn => btn.addEventListener('click', renderPosts));
    
    renderPosts();

    postForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('post-title').value;
        const text = document.getElementById('post-text').value;

        const newPostData = {
            en: { title: title, text: text },
            my: { title: title, text: text }, // Defaulting Burmese to English input
            imageUrl: document.getElementById('post-image-url').value,
            date: new Date()
        };
        allPosts.unshift(newPostData);
        postsContainer.prepend(createPostElement(newPostData));
        closeModal();
    });
});