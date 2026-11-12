/* =========================================
   ABHIGAM WELFARE FOUNDATION — script.js v2
   ========================================= */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ==================
     PAGE LOADER
     ================== */
  const loader = $('#page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hide'), 1200);
    });
    // Fallback: hide after 3s
    setTimeout(() => loader && loader.classList.add('hide'), 3000);
  }

  /* ==================
     HEADER
     ================== */
  const hd = $('.hd');
  const nav = $('.nav');
  const bg = $('.burger');
  const up = $('.up');
  const pr = $('.prog');

  // Burger menu
  if (bg && nav) {
    bg.onclick = () => {
      const o = nav.classList.toggle('open');
      bg.setAttribute('aria-expanded', o);
      bg.innerHTML = o
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';
      document.body.style.overflow = o ? 'hidden' : '';
    };

    // Close on nav link click
    $$('.nav a').forEach(a => a.onclick = () => {
      nav.classList.remove('open');
      bg.setAttribute('aria-expanded', false);
      bg.innerHTML = '<i class="fa-solid fa-bars"></i>';
      document.body.style.overflow = '';
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (nav.classList.contains('open') && !nav.contains(e.target) && e.target !== bg) {
        nav.classList.remove('open');
        bg.setAttribute('aria-expanded', false);
        bg.innerHTML = '<i class="fa-solid fa-bars"></i>';
        document.body.style.overflow = '';
      }
    });
  }

  /* ==================
     DROPDOWN
     ================== */
  $$('.dd').forEach(ddEl => {
    const db = $('.ddb', ddEl);
    if (!db) return;
    db.onclick = e => {
      e.stopPropagation();
      const o = ddEl.classList.toggle('open');
      db.setAttribute('aria-expanded', o);
    };
  });
  document.onclick = e => {
    $$('.dd').forEach(ddEl => {
      if (!ddEl.contains(e.target)) {
        ddEl.classList.remove('open');
        const db = $('.ddb', ddEl);
        if (db) db.setAttribute('aria-expanded', false);
      }
    });
  };

  /* ==================
     SCROLL EVENTS
     ================== */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const sy = window.scrollY;
        // Header shadow
        if (hd) hd.classList.toggle('sc', sy > 10);
        // Back to top
        if (up) up.classList.toggle('show', sy > 400);
        // Progress bar
        if (pr) {
          const total = document.documentElement.scrollHeight - window.innerHeight;
          pr.style.width = total > 0 ? (sy / total * 100) + '%' : '0%';
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Back to top
  if (up) up.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  /* ==================
     KEYBOARD
     ================== */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      $$('.dd').forEach(d => d.classList.remove('open'));
      const lb = $('.lb');
      if (lb) lb.hidden = true;
      if (nav) {
        nav.classList.remove('open');
        document.body.style.overflow = '';
        if (bg) {
          bg.setAttribute('aria-expanded', false);
          bg.innerHTML = '<i class="fa-solid fa-bars"></i>';
        }
      }
    }
    const lb = $('.lb');
    if (lb && !lb.hidden) {
      if (e.key === 'ArrowRight') lbGo(1);
      if (e.key === 'ArrowLeft') lbGo(-1);
    }
  });

  /* ==================
     SCROLL REVEAL
     (Always re-trigger)
     ================== */
  const revealEls = $$('.rv, .rv-left, .rv-right, .rv-scale, .rv-stagger');

  if (revealEls.length) {
    // Add stagger delay to individual card children
    $$('.rv-stagger').forEach(parent => {
      [...parent.children].forEach((child, i) => {
        child.style.transitionDelay = (i * 80) + 'ms';
      });
    });

    // Apply delay to plain .rv elements in grids
    $$('.grid .rv, .grid .rv-scale').forEach((el, i) => {
      el.style.transitionDelay = ((i % 3) * 90) + 'ms';
    });

    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        // Add 'in' when enters viewport
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
        } else {
          // Remove 'in' when leaves — so animation retriggers on next scroll
          entry.target.classList.remove('in');
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => io.observe(el));
  }

  /* ==================
     LIGHTBOX
     ================== */
  const lb = $('.lb');
  const lc = $('.lbc');
  let lbItems = [], lbIx = 0;

  const lbShow = () => {
    const el = lbItems[lbIx];
    if (!el) return;
    // Try to show real image inside
    const img = $('img', el);
    if (img) {
      lc.innerHTML = `<img src="${img.src}" alt="${img.alt || ''}" style="max-width:85vw;max-height:80vh;border-radius:12px;object-fit:contain;">`;
    } else {
      lc.textContent = el.dataset.lb || '';
    }
  };

  const lbGo = d => {
    lbIx = (lbIx + d + lbItems.length) % lbItems.length;
    lbShow();
  };

  // All clickable images open lightbox
  $$('.real-img[data-lb], .card-img[data-lb], .img[data-lb], .community-photo[data-lb]').forEach(el => {
    el.style.cursor = 'zoom-in';
    el.onclick = () => {
      lbItems = $$('.real-img[data-lb], .card-img[data-lb], .img[data-lb], .community-photo[data-lb]');
      lbIx = lbItems.indexOf(el);
      lbShow();
      if (lb) lb.hidden = false;
    };
  });

  if (lb) {
    $('.lbx').onclick = () => lb.hidden = true;
    $('.lbp').onclick = () => lbGo(-1);
    $('.lbn').onclick = () => lbGo(1);
    lb.onclick = e => { if (e.target === lb) lb.hidden = true; };
  }

  /* ==================
     VIDEO MODAL
     ================== */
  $$('.vid').forEach(v => {
    const playBtn = $('.play', v);
    if (!playBtn) return;
    playBtn.onclick = () => {
      if (!lb) return;
      lb.hidden = false;
      lc.innerHTML = `
        <video src="${v.dataset.video}" controls autoplay
          style="max-width:85vw;max-height:72vh;border-radius:12px;">
          <p style="color:#fff">If nothing plays, add your video at ${v.dataset.video}</p>
        </video>`;
      const closeVideo = () => {
        const vi = $('video', lc);
        if (vi) vi.pause();
      };
      $('.lbx').addEventListener('click', closeVideo, { once: true });
    };
  });

  /* ==================
     DONATION
     ================== */
  const amBtns = $$('.am');
  if (amBtns.length) {
    let cur = '', pur = 'General Support';
    const selAmt = $('#selAmt');
    const cu = $('#custom');
    const df = $('#dform');

    const upd = () => {
      if (selAmt) selAmt.textContent = cur ? '₹' + Number(cur).toLocaleString('en-IN') : 'Not chosen';
      const sp = $('#selPur');
      if (sp) sp.textContent = pur;
      if (df && cur) {
        const inp = $('input[type=number]', df);
        if (inp) inp.value = cur;
      }
    };

    amBtns.forEach(b => b.onclick = () => {
      amBtns.forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      if (b.dataset.a === 'custom') {
        if (cu) { cu.hidden = false; cu.focus(); cur = cu.value; }
      } else {
        if (cu) cu.hidden = true;
        cur = b.dataset.a;
      }
      upd();
    });

    if (cu) cu.oninput = () => { cur = cu.value; upd(); };
    $$('.pu').forEach(b => b.onclick = () => {
      $$('.pu').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      pur = b.textContent;
      upd();
    });
  }

  /* ==================
     FEED FILTER
     ================== */
  $$('.chip').forEach(c => c.onclick = () => {
    $$('.chip').forEach(x => x.classList.remove('on'));
    c.classList.add('on');
    $$('.fc').forEach(k =>
      k.classList.toggle('hide', c.dataset.f !== 'all' && k.dataset.c !== c.dataset.f)
    );
  });

  /* ==================
     FAQ ACCORDION
     ================== */
  $$('.aq').forEach(q => q.onclick = () => {
    const item = q.parentNode;
    const wasOpen = item.classList.contains('open');
    // Close all
    $$('.ai').forEach(ai => {
      ai.classList.remove('open');
      const aq = $('.aq', ai);
      if (aq) {
        aq.setAttribute('aria-expanded', false);
        const icon = $('i', aq);
        if (icon) icon.className = 'fa-solid fa-plus';
      }
    });
    // Toggle current
    if (!wasOpen) {
      item.classList.add('open');
      q.setAttribute('aria-expanded', true);
      const icon = $('i', q);
      if (icon) icon.className = 'fa-solid fa-minus';
    }
  });

  /* ==================
     WA FORMS
     ================== */
  const WA = '919326267560';
  $$('form[data-wa]').forEach(f => f.onsubmit = e => {
    e.preventDefault();
    let ok = true;
    let m = `*${f.dataset.wa}*\n`;
    $$('.fld', f).forEach(d => {
      const inp = $('input,select,textarea', d);
      if (!inp) return;
      const v = inp.value.trim();
      const er = $('.err', d);
      let msg = '';
      if (inp.required && !v) msg = 'This field is required.';
      else if (v && inp.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) msg = 'Enter a valid email.';
      else if (v && inp.type === 'tel' && !/^(\+?91)?[6-9]\d{9}$/.test(v.replace(/[\s-]/g, ''))) msg = 'Enter a valid 10-digit mobile number.';
      if (er) er.textContent = msg;
      d.classList.toggle('bad', !!msg);
      if (msg) ok = false;
      if (v) m += `${inp.name}: ${v}\n`;
    });
    const st = $('.status', f);
    if (!ok) { if (st) st.textContent = 'Please fix the highlighted fields.'; return; }
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(m)}`, '_blank');
    if (st) st.textContent = 'WhatsApp opened. Press Send to deliver your message.';
  });

  /* ==================
     SMOOTH ACTIVE NAV
     ================== */
  const page = document.body.dataset.page;
  if (page) {
    $$('.nav a').forEach(a => {
      const href = a.getAttribute('href') || '';
      if (href.includes(page === 'index' ? 'index.html' : page)) {
        a.classList.add('on');
      }
    });
  }

})();