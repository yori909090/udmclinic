(function () {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
        window.location.href = "../login/login.html";
        return;
    }

    const getUsers = () => JSON.parse(localStorage.getItem("users") || "{}");
    const saveUsers = (users) => localStorage.setItem("users", JSON.stringify(users));
    const saveCurrentProfile = (profile) => {
        const users = getUsers();
        users[currentUser] = profile;
        saveUsers(users);
    };

    const birthdayInput = document.getElementById("birthdayInput");
    const ageOutput = document.getElementById("ageOutput");
    const weightInput = document.getElementById("weightInput");
    const heightInput = document.getElementById("heightInput");
    const bmiOutput = document.getElementById("bmiOutput");
    const allergyContainer = document.getElementById("allergyTagContainer");
    const allergyInput = document.getElementById("allergyInput");
    const addAllergyBtn = document.getElementById("addAllergyBtn");
    const exitBtn = document.getElementById("exitBtn");
    const healthNotes = document.querySelector(".editable-textarea");
    const genderInput = document.getElementById("genderInput");
    const dayPeriodFields = document.getElementById("dayPeriodFields");

    const users = getUsers();
    const profile = Object.assign({}, users[currentUser] || {});
    profile.studentId = currentUser;

    function setElementValue(el, value) {
        if (!el) return;
        if (el.tagName === "SELECT") {
            const found = Array.from(el.options).some(opt => {
                if (opt.value === value || opt.text === value) {
                    el.value = opt.value || opt.text;
                    return true;
                }
                return false;
            });
        } else if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
            el.value = value !== undefined && value !== null ? value : "";
        }
    }

    const keyedEls = Array.from(document.querySelectorAll("[data-key]"));

    keyedEls.forEach(el => {
        const key = el.dataset.key;
        setElementValue(el, profile[key]);

        const isSelect = el.tagName === "SELECT";
        const isDate = el.type === "date";
        const isNumber = el.type === "number";

        function saveThisField() {
            const usersNow = getUsers();
            const profNow = usersNow[currentUser] || {};
            if (key !== "studentId") {
                profNow[key] = el.value || "";
            }
            usersNow[currentUser] = profNow;
            saveUsers(usersNow);
        }

        if (isSelect || isDate || isNumber) {
            el.addEventListener("change", () => {
                saveThisField();
                if (key === "gender") updateDayPeriodVisibility();
            });
        } else {
            el.addEventListener("blur", saveThisField);
            el.addEventListener("input", () => {});
        }
    });

    function computeAgeFromBirthday(birthIso) {
        if (!birthIso) return "";
        const birth = new Date(birthIso);
        if (isNaN(birth)) return "";
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        const d = today.getDate() - birth.getDate();
        if (m < 0 || (m === 0 && d < 0)) age--;
        return age;
    }

    if (birthdayInput) {
        birthdayInput.addEventListener("change", () => {
            const age = computeAgeFromBirthday(birthdayInput.value);
            if (ageOutput) ageOutput.value = age !== "" ? String(age) : "";
            const usersNow = getUsers();
            const profNow = usersNow[currentUser] || {};
            profNow.birthday = birthdayInput.value || "";
            profNow.age = ageOutput.value || "";
            usersNow[currentUser] = profNow;
            saveUsers(usersNow);
        });
    }

    function calcAndSaveBMI() {
        const w = parseFloat(weightInput?.value);
        const h = parseFloat(heightInput?.value);
        let bmiDisplay = "";
        let bmiValueToSave = "";

        if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
            bmiOutput.value = "";
        } else {
            const heightM = h / 100;
            const rawBmi = w / (heightM * heightM);
            bmiValueToSave = rawBmi.toFixed(2);

            let category = "";
            if (rawBmi < 18.5) category = "Underweight";
            else if (rawBmi < 24.9) category = "Normal weight";
            else if (rawBmi < 29.9) category = "Overweight";
            else category = "Obese";

            bmiDisplay = `${bmiValueToSave} - ${category}`;
            bmiOutput.value = bmiDisplay;
        }

        const usersNow = getUsers();
        const profNow = usersNow[currentUser] || {};
        profNow.weight = weightInput.value || "";
        profNow.height = heightInput.value || "";
        profNow.bmi = bmiValueToSave || "";
        usersNow[currentUser] = profNow;
        saveUsers(usersNow);
    }

    if (weightInput) {
        weightInput.addEventListener("change", calcAndSaveBMI);
        weightInput.addEventListener("blur", calcAndSaveBMI);
    }
    if (heightInput) {
        heightInput.addEventListener("change", calcAndSaveBMI);
        heightInput.addEventListener("blur", calcAndSaveBMI);
    }

    function renderAllergies(arr) {
        allergyContainer.innerHTML = "";
        (arr || []).forEach(a => {
            const span = document.createElement("span");
            span.className = "tag";
            span.innerHTML = `${a} <span class="remove-tag" title="Remove">×</span>`;
            allergyContainer.appendChild(span);
            span.querySelector(".remove-tag").addEventListener("click", () => {
                const usersNow = getUsers();
                const profNow = usersNow[currentUser] || {};
                profNow.allergies = (profNow.allergies || []).filter(x => x !== a);
                usersNow[currentUser] = profNow;
                saveUsers(usersNow);
                renderAllergies(profNow.allergies);
            });
        });
    }

    renderAllergies(profile.allergies || []);

    if (addAllergyBtn) {
        addAllergyBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const val = (allergyInput?.value || "").trim();
            if (!val) return;
            const usersNow = getUsers();
            const profNow = usersNow[currentUser] || {};
            profNow.allergies = profNow.allergies || [];
            if (!profNow.allergies.includes(val)) {
                profNow.allergies.push(val);
                usersNow[currentUser] = profNow;
                saveUsers(usersNow);
                renderAllergies(profNow.allergies);
            }
            allergyInput.value = "";
        });
    }

    if (healthNotes) {
        healthNotes.addEventListener("blur", () => {
            const usersNow = getUsers();
            const profNow = usersNow[currentUser] || {};
            profNow.healthNotes = healthNotes.value || "";
            usersNow[currentUser] = profNow;
            saveUsers(usersNow);
        });
    }

    function updateDayPeriodVisibility() {
        if (!genderInput || !dayPeriodFields) return;
        dayPeriodFields.style.display = genderInput.value === "Female" ? "grid" : "none";
    }

    updateDayPeriodVisibility();
    if (genderInput) {
        genderInput.addEventListener("change", updateDayPeriodVisibility);
    }

    function finalSaveOnLoad() {
        const usersNow = getUsers();
        const profNow = usersNow[currentUser] || {};
        keyedEls.forEach(el => {
            const k = el.dataset.key;
            if (k === "newAllergy") return;
            profNow[k] = profNow[k] !== undefined && profNow[k] !== null ? profNow[k] : (el.value || "");
        });
        profNow.allergies = profNow.allergies || profile.allergies || [];
        usersNow[currentUser] = profNow;
        saveUsers(usersNow);
    }
    finalSaveOnLoad();

    function reDisplayBMI() {
        if (weightInput?.value && heightInput?.value) {
            calcAndSaveBMI();
        }
    }
    reDisplayBMI();

    if (exitBtn) {
        exitBtn.addEventListener("click", (e) => {
            e.preventDefault();
            window.location.href = "../log/log.html";
        });
    }

    document.querySelectorAll("input.editable, select.editable, textarea.editable, #ageOutput, #bmiOutput").forEach(field => {
        if (field.dataset.asteriskInit === "1") return;
        field.dataset.asteriskInit = "1";
        const label = field.closest(".form-row, .full-width-line")?.querySelector("label");
        if (!label) return;
        let asterisk = label.querySelector(".required-asterisk");
        if (!asterisk) {
            asterisk = document.createElement("span");
            asterisk.classList.add("required-asterisk");
            asterisk.textContent = "*";
            label.appendChild(asterisk);
        }
        function update() {
            let isEmpty = false;
            if (field.tagName === "SELECT") {
                const selected = field.options[field.selectedIndex];
                if (!selected || selected.disabled) isEmpty = true;
            }
            if (!field.value || !String(field.value).trim()) isEmpty = true;
            asterisk.style.display = isEmpty ? "inline" : "none";
        }
        update();
        field.addEventListener("input", update);
        field.addEventListener("change", update);
        field.addEventListener("blur", update);
    });
})();
