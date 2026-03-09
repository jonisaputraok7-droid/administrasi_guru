/* js/components.js */

const Components = {
    // --- Reusable Searchable Dropdown --- //
    // To satisfy: "Menu aplikasi dibuat dropdown dan ketik manual"
    createSearchableDropdown(targetElementId, optionsArray, onSelectCallback, placeholderText = "Ketik untuk mencari...") {
        const container = document.getElementById(targetElementId);
        if (!container) return;

        container.innerHTML = `
            <div class="menu-search-container" style="width: 100%;">
                <input type="text" class="menu-search-input" placeholder="${placeholderText}" id="search-input-${targetElementId}">
                <i class="ph ph-magnifying-glass menu-search-icon"></i>
                <div class="menu-search-dropdown" id="search-dropdown-${targetElementId}"></div>
            </div>
        `;

        const input = document.getElementById(`search-input-${targetElementId}`);
        const dropdown = document.getElementById(`search-dropdown-${targetElementId}`);

        const renderOptions = (filter = '') => {
            const filteredOptions = optionsArray.filter(opt =>
                opt.toLowerCase().includes(filter.toLowerCase())
            );

            dropdown.innerHTML = filteredOptions.length > 0
                ? filteredOptions.map(opt => `<div class="menu-search-result">${opt}</div>`).join('')
                : `<div class="menu-search-result text-muted">Tidak ditemukan</div>`;

            // Add click listeners to items
            const items = dropdown.querySelectorAll('.menu-search-result');
            items.forEach(item => {
                item.addEventListener('click', (e) => {
                    const selectedValue = e.target.textContent;
                    if (selectedValue !== "Tidak ditemukan") {
                        input.value = selectedValue;
                        dropdown.classList.remove('show');
                        if (typeof onSelectCallback === 'function') {
                            onSelectCallback(selectedValue);
                        }
                    }
                });
            });
        };

        // Event Listeners
        input.addEventListener('focus', () => {
            renderOptions(input.value);
            dropdown.classList.add('show');
        });

        input.addEventListener('input', (e) => {
            renderOptions(e.target.value);
            dropdown.classList.add('show');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!container.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });
    },

    // --- Modal System --- //
    showModal(title, bodyHTML, footerHTML = '') {
        const modalHtml = `
            <div class="modal-overlay active" id="dynamic-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="font-bold">${title}</h3>
                        <button class="modal-close" onclick="Components.closeModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        ${bodyHTML}
                    </div>
                    ${footerHTML ? `<div class="modal-footer">${footerHTML}</div>` : ''}
                </div>
            </div>
        `;

        // Remove existing modal if any
        this.closeModal();

        document.body.insertAdjacentHTML('beforeend', modalHtml);
    },

    closeModal() {
        const modal = document.getElementById('dynamic-modal');
        if (modal) {
            modal.classList.remove('active');
            setTimeout(() => modal.remove(), 300); // Wait for transition
        }
    },

    // Premium Toast Notifications using SweetAlert2
    notify(title, icon = 'success') {
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: icon,
            title: title,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
        });
    },

    confirm(title, text, confirmCallback) {
        Swal.fire({
            title: title,
            text: text,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: 'var(--danger)',
            cancelButtonColor: 'var(--text-muted)',
            confirmButtonText: 'Ya, Lanjutkan!',
            cancelButtonText: 'Batal'
        }).then((result) => {
            if (result.isConfirmed) {
                confirmCallback();
            }
        });
    }
};
