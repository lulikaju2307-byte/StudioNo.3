const products = [
      { id: 1, icon: 'image/сумка.jpg', title: 'Плетёная сумка «Дюна»', desc: 'Ручное плетение, натуральное волокно, на каждый день', price: 4200 },
      { id: 2, icon: 'image/свеча.jpg', title: 'Свеча соевая «Кедр и соль»', desc: '40 часов горения, стеклянный подсвечник', price: 1350 },
      { id: 3, icon: 'image/шарф.jpeg', title: 'Шарф из мериноса «Туман»', desc: 'Тонкая шерсть, лёгкая текстура, унисекс', price: 3800 },
      { id: 4, icon: 'image/чайник.jpg', title: 'Керамический чайник «Глина»', desc: 'Ручная работа, объём 600 мл', price: 2950 },
      { id: 5, icon: 'image/крем.jpg', title: 'Крем для рук «Овёс»', desc: 'Без отдушек, для чувствительной кожи', price: 890 },
      { id: 6, icon: 'image/блокнот.jpg', title: 'Блокнот в льняной обложке', desc: 'Плотная бумага, 96 листов, нелинованный', price: 1150 },
      { id: 7, icon: 'image/зеркало.jpeg', title: 'Настольное зеркало «Овал»', desc: 'Латунная рама, устойчивая подставка', price: 5200 },
      { id: 8, icon: 'image/мыло.jpg', title: 'Мыло ручной работы «Пихта»', desc: 'Набор из 3 штук, натуральные масла', price: 990 },
    ];

    const cart = {}; 

    const grid = document.getElementById('productGrid');
    const cartItemsEl = document.getElementById('cartItems');
    const cartBadge = document.getElementById('cartBadge');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    function formatPrice(n) {
      return n.toLocaleString('ru-RU') + ' ₽';
    }

    function getImageContent(icon, title) {
      if (/\.(jpg|jpeg|png|webp)$/i.test(icon)) {
        return `<img src="${icon}" alt="${title}" loading="lazy">`;
      }
      return icon;
    }

    function renderGrid() {
      grid.innerHTML = products.map(p => {
        const imageContent = getImageContent(p.icon, p.title);
        return `
          <article class="product-card" data-id="${p.id}">
            <div class="card-image">${imageContent}</div>
            <div class="card-info">
              <div class="card-title">${p.title}</div>
              <div class="card-desc">${p.desc}</div>
              <div class="card-bottom">
                <span class="card-price">${formatPrice(p.price)}</span>
                <button class="add-btn" data-id="${p.id}">В корзину</button>
              </div>
            </div>
          </article>
        `;
      }).join('');
    }

    function renderCart() {
      const ids = Object.keys(cart).filter(id => cart[id] > 0);
      const totalQty = ids.reduce((sum, id) => sum + cart[id], 0);

      cartBadge.textContent = totalQty;
      cartBadge.classList.toggle('show', totalQty > 0);
      checkoutBtn.disabled = totalQty === 0;

      if (ids.length === 0) {
        cartItemsEl.innerHTML = `<div class="cart-empty">Пока пусто. Загляните в каталог.</div>`;
        cartTotal.textContent = formatPrice(0);
        return;
      }

      let total = 0;
      cartItemsEl.innerHTML = ids.map(id => {
        const p = products.find(pr => pr.id == id);
        const qty = cart[id];
        total += p.price * qty;

        const thumbContent = getImageContent(p.icon, p.title);

        return `
          <div class="cart-item" data-id="${p.id}">
            <div class="cart-item-thumb">${thumbContent}</div>
            <div class="cart-item-info">
              <div class="cart-item-title">${p.title}</div>
              <div class="cart-item-price">${formatPrice(p.price)}</div>
              <div class="qty-control">
                <button class="qty-btn" data-action="dec" data-id="${p.id}">−</button>
                <span class="qty-val">${qty}</span>
                <button class="qty-btn" data-action="inc" data-id="${p.id}">+</button>
                <span class="remove-link" data-action="remove" data-id="${p.id}">Убрать</span>
              </div>
            </div>
          </div>
        `;
      }).join('');

      cartTotal.textContent = formatPrice(total);
    }

    function updateAddButtons() {
      document.querySelectorAll('.add-btn').forEach(btn => {
        const id = btn.dataset.id;
        const inCart = (cart[id] || 0) > 0;
        btn.textContent = inCart ? 'В корзине' : 'В корзину';
        btn.classList.toggle('added', inCart);
      });
    }

    grid.addEventListener('click', e => {
      const btn = e.target.closest('.add-btn');
      if (!btn) return;
      const id = btn.dataset.id;
      cart[id] = (cart[id] || 0) + 1;
      renderCart();
      updateAddButtons();
    });

    cartItemsEl.addEventListener('click', e => {
      const target = e.target.closest('[data-action]');
      if (!target) return;
      const id = target.dataset.id;
      const action = target.dataset.action;

      if (action === 'inc') cart[id] = (cart[id] || 0) + 1;
      if (action === 'dec') cart[id] = Math.max(0, (cart[id] || 0) - 1);
      if (action === 'remove') cart[id] = 0;

      renderCart();
      updateAddButtons();
    });

    const cartFab = document.getElementById('cartFab');
    const cartDrawer = document.getElementById('cartDrawer');
    const overlay = document.getElementById('overlay');
    const cartClose = document.getElementById('cartClose');

    function openCart() {
      cartDrawer.classList.add('open');
      overlay.classList.add('open');
    }
    function closeCart() {
      cartDrawer.classList.remove('open');
      overlay.classList.remove('open');
    }

    cartFab.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);

    checkoutBtn.addEventListener('click', () => {
      alert('Заказ оформлен (демо). В реальном проекте здесь был бы переход на страницу оплаты.');
    });

    renderGrid();
    renderCart();