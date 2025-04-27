// مصفوفة تحتوي على الاقتباسات والمؤلفين مع تصنيفات
const quotes = [
    {
        text: "لا تحكم على نجاحك بما تملكه، بل بما تفعله بما تملك.",
        author: "توماس إديسون",
        category: "success"
    },
    {
        text: "الحياة إما أن تكون مغامرة جريئة أو لا شيء.",
        author: "هيلين كيلر",
        category: "life"
    },
    {
        text: "النجاح ليس نهائيًا، والفشل ليس قاتلًا، الشجاعة للاستمرار هي ما يهم.",
        author: "ونستون تشرشل",
        category: "motivation"
    },
    {
        text: "الطريقة الوحيدة للقيام بعمل عظيم هي أن تحب ما تفعله.",
        author: "ستيف جوبز",
        category: "success"
    },
    {
        text: "لا تقلق بشأن الفشل، عليك أن تقلق بشأن الفرص التي تخسرها عندما لا تحاول حتى.",
        author: "جاك كانفيلد",
        category: "motivation"
    },
    {
        text: "أفضل وقت لزرع شجرة كان قبل عشرين عامًا. ثاني أفضل وقت هو الآن.",
        author: "مثل صيني",
        category: "wisdom"
    },
    {
        text: "لا تنتظر، فلن يكون الوقت مناسبًا أبدًا.",
        author: "نابليون هيل",
        category: "motivation"
    },
    {
        text: "إذا كنت تريد أن تعيش حياة سعيدة، اربطها بهدف، وليس بأشخاص أو أشياء.",
        author: "ألبرت أينشتاين",
        category: "wisdom"
    },
    {
        text: "الحياة هي ما نصنعه بها، دائمًا كانت كذلك، ودائمًا ستكون.",
        author: "غراندما موسى",
        category: "life"
    },
    {
        text: "لا يمكنك تغيير الريح، ولكن يمكنك ضبط الأشرعة للوصول إلى وجهتك.",
        author: "جيمي دين",
        category: "wisdom"
    }
];

// عناصر DOM
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');
const newQuoteBtn = document.getElementById('new-quote');
const shareQuoteBtn = document.getElementById('share-quote');
const favoriteQuoteBtn = document.getElementById('favorite-quote');
const categorySelect = document.getElementById('quote-category');
const favoritesList = document.getElementById('favorites');
const favoritesContainer = document.getElementById('favorites-list');
const currentYearSpan = document.getElementById('current-year');

// تعيين السنة الحالية في التذييل
currentYearSpan.textContent = new Date().getFullYear();

// المتغيرات العامة
let currentQuote = null;
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// وظيفة لعرض اقتباس عشوائي
function displayRandomQuote() {
    // تصفية الاقتباسات حسب الفئة المحددة
    const selectedCategory = categorySelect.value;
    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);
    
    // التحقق من وجود اقتباسات في الفئة المحددة
    if (filteredQuotes.length === 0) {
        quoteText.innerHTML = '<span class="quote-icon">❝</span> لا توجد اقتباسات في هذه الفئة حاليًا';
        quoteAuthor.textContent = '';
        currentQuote = null;
        return;
    }
    
    // اختيار اقتباس عشوائي من المصفوفة المصفاة
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    currentQuote = filteredQuotes[randomIndex];
    
    // تحديث النص في واجهة المستخدم
    quoteText.innerHTML = `<span class="quote-icon">❝</span> ${currentQuote.text}`;
    quoteAuthor.textContent = `- ${currentQuote.author}`;
    
    // تحديث حالة زر المفضلة
    updateFavoriteButtonState();
    
    // إضافة تأثير بسيط
    quoteText.classList.add('fade');
    quoteAuthor.classList.add('fade');
    
    // إزالة التأثير بعد التحميل
    setTimeout(() => {
        quoteText.classList.remove('fade');
        quoteAuthor.classList.remove('fade');
    }, 500);
}

// وظيفة لتحديث حالة زر المفضلة
function updateFavoriteButtonState() {
    if (!currentQuote) return;
    
    const isInFavorites = favorites.some(fav => 
        fav.text === currentQuote.text && fav.author === currentQuote.author
    );
    
    if (isInFavorites) {
        favoriteQuoteBtn.textContent = 'إزالة من المفضلة';
        favoriteQuoteBtn.classList.add('active');
    } else {
        favoriteQuoteBtn.textContent = 'حفظ المفضلة';
        favoriteQuoteBtn.classList.remove('active');
    }
}

// وظيفة لإضافة/إزالة الاقتباس الحالي من المفضلة
function toggleFavorite() {
    if (!currentQuote) return;
    
    const isInFavorites = favorites.some(fav => 
        fav.text === currentQuote.text && fav.author === currentQuote.author
    );
    
    if (isInFavorites) {
        // إزالة من المفضلة
        favorites = favorites.filter(fav => 
            fav.text !== currentQuote.text || fav.author !== currentQuote.author
        );
    } else {
        // إضافة إلى المفضلة
        favorites.push(currentQuote);
    }
    
    // حفظ في التخزين المحلي
    localStorage.setItem('favorites', JSON.stringify(favorites));
    
    // تحديث واجهة المستخدم
    updateFavoriteButtonState();
    renderFavorites();
}

// وظيفة لعرض المفضلة
function renderFavorites() {
    favoritesList.innerHTML = '';
    
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<li class="no-favorites">لا توجد اقتباسات مفضلة حتى الآن</li>';
        return;
    }
    
    favorites.forEach((fav, index) => {
        const li = document.createElement('li');
        li.className = 'favorite-item';
        li.innerHTML = `
            <div class="favorite-quote">
                <p>${fav.text}</p>
                <small>- ${fav.author}</small>
            </div>
            <div class="favorite-actions">
                <button class="remove-favorite" data-index="${index}">حذف</button>
            </div>
        `;
        favoritesList.appendChild(li);
    });
    
    // إضافة مستمعي الأحداث لأزرار الحذف
    document.querySelectorAll('.remove-favorite').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            favorites.splice(index, 1);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            renderFavorites();
            updateFavoriteButtonState();
        });
    });
}

// وظيفة لمشاركة الاقتباس
function shareQuote() {
    if (!currentQuote) return;
    
    // التحقق من دعم واجهة مشاركة الويب
    if (navigator.share) {
        navigator.share({
            title: 'اقتباس ملهم',
            text: `"${currentQuote.text}" - ${currentQuote.author}`,
            url: window.location.href
        })
        .catch(error => {
            console.error('حدث خطأ أثناء المشاركة:', error);
        });
    } else {
        // نسخ الاقتباس إلى الحافظة كبديل
        const textToCopy = `"${currentQuote.text}" - ${currentQuote.author}`;
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                alert('تم نسخ الاقتباس إلى الحافظة');
            })
            .catch(err => {
                console.error('فشل نسخ النص: ', err);
            });
    }
}

// وظيفة لجلب اقتباسات إضافية من API (يمكن تنفيذها لاحقًا)
async function fetchQuotesFromAPI() {
    try {
        // هذه مجرد وظيفة وهمية، يمكنك استبدالها بـ API حقيقي لاحقًا
        console.log('جاري جلب اقتباسات إضافية...');
        // const response = await fetch('https://api.example.com/quotes');
        // const newQuotes = await response.json();
        // quotes = [...quotes, ...newQuotes];
    } catch (error) {
        console.error('حدث خطأ أثناء جلب الاقتباسات:', error);
    }
}

// وظيفة لتبديل عرض قائمة المفضلة
function toggleFavoritesList() {
    const isHidden = favoritesContainer.style.display === 'none';
    favoritesContainer.style.display = isHidden ? 'block' : 'none';
}

// إضافة مستمعي الأحداث
window.addEventListener('load', () => {
    displayRandomQuote();
    renderFavorites();
});

newQuoteBtn.addEventListener('click', displayRandomQuote);
shareQuoteBtn.addEventListener('click', shareQuote);
favoriteQuoteBtn.addEventListener('click', toggleFavorite);
categorySelect.addEventListener('change', displayRandomQuote);

// إضافة زر لعرض/إخفاء المفضلة
const toggleFavoritesBtn = document.createElement('button');
toggleFavoritesBtn.id = 'toggle-favorites';
toggleFavoritesBtn.textContent = 'عرض المفضلة';
toggleFavoritesBtn.className = 'toggle-favorites-btn';
document.querySelector('.button-container').appendChild(toggleFavoritesBtn);
toggleFavoritesBtn.addEventListener('click', toggleFavoritesList);