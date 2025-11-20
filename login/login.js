// header
const PASSWORD = "UDM_Clinic025";
const STUDENT_ID_REGEX = /^\d{2}-\d{2}-\d{3}$/;

// ids
function generateAllowedStudentIDs(startYear, endYear, maxSequence) {
    const ids = [];
    const departmentCode = '22';

    for (let year = startYear; year <= endYear; year++) {
        const yearStr = year.toString().padStart(2, '0');

        for (let seq = 1; seq <= maxSequence; seq++) {
            const sequenceStr = seq.toString().padStart(3, '0');
            ids.push(`${yearStr}-${departmentCode}-${sequenceStr}`);
        }
    }
    return ids;
}

const allowedStudentsForPassword = generateAllowedStudentIDs(21, 26, 600);

// modal
const statusModal = document.getElementById('statusModal');
const modalMessage = document.getElementById('modalMessage');
const closeBtn = document.querySelector('.close-btn');

function showStatusModal(message) {
    modalMessage.textContent = message;
    if (statusModal) statusModal.style.display = 'flex';
}

function hideStatusModal() {
    if (statusModal) statusModal.style.display = 'none';
}

if (closeBtn) closeBtn.onclick = hideStatusModal;

window.onclick = (e) => {
    if (e.target === statusModal) hideStatusModal();
};

// mask
function applyInputMask(inputElement) {
    const maxDigits = 7;

    inputElement.addEventListener('input', (e) => {
        let raw = e.target.value.replace(/[^0-9]/g, '').substring(0, maxDigits);
        let masked = '';

        for (let i = 0; i < raw.length; i++) {
            masked += raw[i];
            if (i === 1 && raw.length > 2) masked += '-';
            if (i === 3 && raw.length > 4) masked += '-';
        }

        e.target.value = masked;
    });
}

// login form
function initializeLoginPage() {
    const loginBtn = document.getElementById("loginBtn");
    const studentIdInput = document.getElementById("studentId");
    const passwordInput = document.getElementById("password");
    const errorMsg = document.getElementById("errorMessage");

    if (!loginBtn) return;

    applyInputMask(studentIdInput);

    const displayError = (msg) => {
        errorMsg.textContent = msg;
        errorMsg.style.display = "block";
    };

    const clearErrors = () => {
        errorMsg.style.display = "none";
        studentIdInput.classList.remove("input-error");
        passwordInput.classList.remove("input-error");
    };

    loginBtn.addEventListener("click", (e) => {
        e.preventDefault();
        clearErrors();

        const studentId = studentIdInput.value.trim();
        const password = passwordInput.value.trim();

        if (!studentId || !password) {
            displayError("Please enter both Student ID and Password.");
            studentIdInput.classList.add("input-error");
            passwordInput.classList.add("input-error");
            return;
        }

        if (!STUDENT_ID_REGEX.test(studentId)) {
            displayError("Student ID format is incorrect. Please use the YY-YY-XXX format.");
            studentIdInput.classList.add("input-error");
            return;
        }

        if (!allowedStudentsForPassword.includes(studentId)) {
            displayError("Student ID not found in the authorized list. You are not authorized.");
            studentIdInput.classList.add("input-error");
            return;
        }

        if (password !== PASSWORD) {
            displayError("Incorrect password. Please try again.");
            passwordInput.classList.add("input-error");
            return;
        }

        localStorage.setItem("currentUser", studentId);
        localStorage.setItem('isLoggedIn', 'true');
        sessionStorage.setItem('showWelcome', 'true');

        window.location.href = "../log/log.html";
    });

    document.addEventListener("keypress", (e) => {
        if (e.key === "Enter" && studentIdInput.value && passwordInput.value) {
            loginBtn.click();
            e.preventDefault();
        }
    });
}

// session
function initializeLoggedInPages() {
    const loginNavLink = document.getElementById('loginNav');
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const showWelcome = sessionStorage.getItem('showWelcome') === 'true';
    const isLoginPage = window.location.pathname.includes('/login/login.html') || window.location.pathname.endsWith('/login.html');

    if (showWelcome) {
        if (window.location.pathname.includes('/log/log.html') || window.location.pathname.endsWith('/log.html')) {
            const studentId = localStorage.getItem("currentUser") || "User";
            showStatusModal(` Welcome back, Student ${studentId}! You are now securely logged into your Clinic Dashboard.`);
            sessionStorage.removeItem('showWelcome');
        }
    }

    if (loginNavLink) {
        if (isLoginPage) {
            loginNavLink.textContent = isLoggedIn ? 'Login' : 'Login';
            loginNavLink.href = '#';
            return;
        }

        if (isLoggedIn) {
            loginNavLink.textContent = 'Login';
            loginNavLink.href = '#';
            loginNavLink.addEventListener('click', (e) => {
                e.preventDefault();
                showStatusModal('You are already logged in! Click the x button to proceed.');
            });
        }
    }
}

// init
document.addEventListener("DOMContentLoaded", () => {
    initializeLoginPage();
    initializeLoggedInPages();
});
