const APPT_STUDENT_ID_REGEX = /^\d{2}-\d{2}-\d{3}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^09\d{9}$/;
const MAX_ENROLLMENT_YEAR_DIFF = 5;

function isStudentAuthorized(studentId) {
  if (!APPT_STUDENT_ID_REGEX.test(studentId)) return false;
  const enrollmentYear = parseInt(studentId.substring(0, 2), 10);
  const currentYear = new Date().getFullYear() % 100;
  if (enrollmentYear > currentYear) return false;
  if (currentYear - enrollmentYear > MAX_ENROLLMENT_YEAR_DIFF) return false;
  return true;
}

function isContactValid(val) {
  return EMAIL_REGEX.test(val) || PHONE_REGEX.test(val) || val.length >= 7;
}

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
    validateAllInputs();
  });
}

function setupSequentialInputs() {
  const fullname = document.getElementById('fullname');
  const studentId = document.getElementById('studentid');
  const contact = document.getElementById('contact');
  const schedule = document.getElementById('schedule');
  const calendarBtn = document.querySelector('.calendar-btn');

  studentId.disabled = true;
  contact.disabled = true;
  schedule.disabled = true;
  if (calendarBtn) calendarBtn.disabled = true;

  const enable = (src, target, fn) => {
    src.addEventListener('input', () => {
      if (fn(src.value.trim())) {
        target.disabled = false;
      } else {
        target.disabled = true;
        if (target === studentId) {
          contact.disabled = true;
          schedule.disabled = true;
          if (calendarBtn) calendarBtn.disabled = true;
        }
        if (target === contact) {
          schedule.disabled = true;
          if (calendarBtn) calendarBtn.disabled = true;
        }
      }
      validateAllInputs();
    });
  };

  enable(fullname, studentId, (v) => v.length > 2);
  enable(studentId, contact, (v) => APPT_STUDENT_ID_REGEX.test(v) && isStudentAuthorized(v));

  contact.addEventListener('input', () => {
    const val = contact.value.trim();
    if (isContactValid(val)) {
      schedule.disabled = false;
      if (calendarBtn) calendarBtn.disabled = false;
    } else {
      schedule.disabled = true;
      if (calendarBtn) calendarBtn.disabled = true;
    }
    validateAllInputs();
  });
}

function validateAllInputs() {
  const fullname = document.getElementById('fullname').value.trim();
  const studentId = document.getElementById('studentid').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const schedule = document.getElementById('schedule').value.trim();
  const confirmBtn = document.querySelector('button[onclick="submitForm()"]');

  if (!confirmBtn) return;

  const now = new Date().getFullYear().toString();
  const selectedYear = schedule.substring(0, 4);

  const okFull = fullname.length > 2;
  const okId = APPT_STUDENT_ID_REGEX.test(studentId) && isStudentAuthorized(studentId);
  const okContact = isContactValid(contact);
  const okSched = schedule.length === 10 && selectedYear === now && schedule !== 'Available Schedules';

  const allValid = okFull && okId && okContact && okSched;

  confirmBtn.disabled = !allValid;
  confirmBtn.style.opacity = allValid ? '1' : '0.5';
  confirmBtn.style.cursor = allValid ? 'pointer' : 'not-allowed';
}

function openCalendar() {
  const currentYear = new Date().getFullYear();
  const date = prompt(`Please select a date (${currentYear}). Format: YYYY-MM-DD`);
  if (date) {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    const year = date.substring(0, 4);
    if (regex.test(date) && year === currentYear.toString()) {
      document.getElementById('schedule').value = date;
    } else if (regex.test(date)) {
      alert(`Appointments allowed only for ${currentYear}.`);
    } else {
      alert('Invalid format. Use YYYY-MM-DD.');
    }
  }
  validateAllInputs();
}

function submitForm() {
  const btn = document.querySelector('button[onclick="submitForm()"]');
  if (btn.disabled) {
    showStatusModal('Please complete all fields correctly.');
    return;
  }

  const full = document.getElementById('fullname').value.trim();
  const id = document.getElementById('studentid').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const sched = document.getElementById('schedule').value.trim();
  const now = new Date().getFullYear().toString();

  if (!full || !APPT_STUDENT_ID_REGEX.test(id) || !isStudentAuthorized(id) || !isContactValid(contact) || sched.substring(0, 4) !== now) {
    showStatusModal('Please ensure all fields are valid.');
    return;
  }

  showStatusModal(`Appointment Submitted!\n\nName: ${full}\nID: ${id}\nContact: ${contact}\nSchedule: ${sched}`);
}

document.addEventListener('DOMContentLoaded', () => {
  const idField = document.getElementById('studentid');
  if (idField) applyInputMask(idField);
  setupSequentialInputs();
  validateAllInputs();
});
