// Global State
let banksData = [];
let filteredBanks = [];
let isExpanded = false;

// DOM Elements
const searchInput = document.getElementById('search-input');
const clearSearchBtn = document.getElementById('clear-search-btn');
const bankGrid = document.getElementById('bank-grid');
const bankGridWrapper = document.getElementById('bank-grid-wrapper');
const showAllBtn = document.getElementById('show-all-btn');
const expandActions = document.getElementById('expand-actions');
const visibleCount = document.getElementById('visible-count');
const totalCount = document.getElementById('total-count');
const terminalCode = document.getElementById('json-response');
const toast = document.getElementById('toast');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  fetchBanks();
  setupEventListeners();
});

// Fetch Banks JSON
async function fetchBanks() {
  try {
    // Fetch from relative path (will resolve to localhost/api/banks.json in dev, or domain/api/banks.json in prod)
    const response = await fetch('./api/banks.json');
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    banksData = await response.json();
    filteredBanks = [...banksData];
    
    // Sort alphabetically by short name
    banksData.sort((a, b) => a.name_singkat.localeCompare(b.name_singkat));
    filteredBanks = [...banksData];

    totalCount.textContent = banksData.length;
    renderBankGrid();
    
    // Set initial response in terminal to Bank Jago or BCA (some popular bank)
    const jago = banksData.find(b => b.code === '542') || banksData[0];
    updateTerminalResponse(jago);
  } catch (error) {
    console.error('Error fetching banks:', error);
    bankGrid.innerHTML = `
      <div class="no-results">
        <i data-lucide="alert-triangle" class="no-results-icon" style="color: #ef4444;"></i>
        <p style="font-weight: 600;">Gagal memuat data bank</p>
        <p style="font-size: 0.9rem; color: var(--text-muted);">Pastikan Anda telah menjalankan perintah build: <code>npm run build</code></p>
      </div>
    `;
    lucide.createIcons();
  }
}

// Setup Event Listeners
function setupEventListeners() {
  // Search Input
  searchInput.addEventListener('input', handleSearch);
  
  // Clear Search
  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    clearSearchBtn.classList.add('hidden');
    filteredBanks = [...banksData];
    if (!isExpanded) {
      bankGridWrapper.classList.remove('expanded');
    }
    expandActions.style.display = 'flex';
    renderBankGrid();
    searchInput.focus();
  });

  // Show All / Collapsible Directory Toggle
  showAllBtn.addEventListener('click', () => {
    isExpanded = !isExpanded;
    if (isExpanded) {
      bankGridWrapper.classList.add('expanded');
      showAllBtn.innerHTML = `<i data-lucide="chevrons-up" class="btn-icon-left"></i>Tampilkan Lebih Sedikit`;
    } else {
      bankGridWrapper.classList.remove('expanded');
      showAllBtn.innerHTML = `<i data-lucide="chevrons-down" class="btn-icon-left"></i>Lihat Semua Bank`;
      // Scroll back to directory header when collapsing
      document.getElementById('directory').scrollIntoView({ behavior: 'smooth' });
    }
    lucide.createIcons();
  });

  // Tab Buttons for Code Playground
  tabButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabId = e.target.getAttribute('data-tab');
      
      // Update buttons
      tabButtons.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      
      // Update contents
      tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === `tab-${tabId}`) {
          content.classList.add('active');
        }
      });
    });
  });

  // Global click delegator for Copy Buttons
  document.body.addEventListener('click', (e) => {
    // Handle main copy buttons in playground
    if (e.target.classList.contains('copy-btn') || e.target.closest('.copy-btn')) {
      const btn = e.target.classList.contains('copy-btn') ? e.target : e.target.closest('.copy-btn');
      const targetId = btn.getAttribute('data-target');
      const targetCode = document.getElementById(targetId);
      if (targetCode) {
        copyToClipboard(targetCode.textContent);
      }
    }
  });
}

// Handle Search Filter
function handleSearch(e) {
  const query = e.target.value.toLowerCase().trim();
  
  if (query.length > 0) {
    clearSearchBtn.classList.remove('hidden');
    bankGridWrapper.classList.add('expanded');
    expandActions.style.display = 'none';
  } else {
    clearSearchBtn.classList.add('hidden');
    if (!isExpanded) {
      bankGridWrapper.classList.remove('expanded');
    }
    expandActions.style.display = 'flex';
  }

  filteredBanks = banksData.filter(bank => {
    return (
      bank.name.toLowerCase().includes(query) ||
      bank.name_singkat.toLowerCase().includes(query) ||
      bank.code.includes(query) ||
      bank.sandi_bic.toLowerCase().includes(query)
    );
  });

  renderBankGrid();
}

// Render Bank Cards Grid
function renderBankGrid() {
  visibleCount.textContent = filteredBanks.length;
  
  if (filteredBanks.length === 0) {
    bankGrid.innerHTML = `
      <div class="no-results">
        <i data-lucide="search-x" class="no-results-icon"></i>
        <p style="font-weight: 600;">Bank tidak ditemukan</p>
        <p style="font-size: 0.9rem; color: var(--text-muted);">Coba cari kata kunci lain seperti "Mandiri", "BCA", atau kode "009".</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  // Populate cards
  bankGrid.innerHTML = filteredBanks.map(bank => {
    return `
      <div class="bank-card" id="bank-card-${bank.no}">
        <div class="card-top">
          <span class="bank-code-badge">${bank.code}</span>
          <div class="bank-actions">
            <button class="card-action-btn copy-json-btn" data-no="${bank.no}" title="Salin JSON Bank">
              <i data-lucide="copy"></i>
            </button>
            <button class="card-action-btn view-json-btn" data-no="${bank.no}" title="Lihat di Playground">
              <i data-lucide="terminal"></i>
            </button>
          </div>
        </div>
        <div class="bank-info">
          <h3 class="bank-short-name">${escapeHTML(bank.name_singkat)}</h3>
          <p class="bank-full-name">${escapeHTML(bank.name)}</p>
        </div>
        <div class="card-bottom">
          <div class="bank-bic-code">BIC: <span>${escapeHTML(bank.sandi_bic)}</span></div>
          <div class="bank-office-code">Kantor: <span>${escapeHTML(bank.kode_kantor)}</span></div>
        </div>
      </div>
    `;
  }).join('');

  lucide.createIcons();

  // Attach card event listeners
  document.querySelectorAll('.copy-json-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const no = parseInt(btn.getAttribute('data-no'));
      const bank = banksData.find(b => b.no === no);
      if (bank) {
        copyToClipboard(JSON.stringify(bank, null, 2));
      }
    });
  });

  document.querySelectorAll('.view-json-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const no = parseInt(btn.getAttribute('data-no'));
      const bank = banksData.find(b => b.no === no);
      if (bank) {
        updateTerminalResponse(bank);
        // Scroll to playground smoothly
        document.getElementById('playground').scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

// Update Simulated Response in Terminal Mockup
function updateTerminalResponse(bank) {
  const jsonStr = JSON.stringify(bank, null, 2);
  terminalCode.textContent = jsonStr;
  
  // Re-highlight using Prism
  if (window.Prism) {
    Prism.highlightElement(terminalCode);
  }
}

// Copy to Clipboard Utility
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast();
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

// Show Toast Alert
function showToast() {
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

// Escape HTML entities to prevent XSS
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}
