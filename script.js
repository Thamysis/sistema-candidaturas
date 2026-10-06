const signupForm = document.querySelector('#signup-form');

if (signupForm) {
  const email = document.querySelector('#email');
  const password = document.querySelector('#password');
  const revealButton = document.querySelector('.reveal-password');

  revealButton.addEventListener('click', () => {
    const visible = password.type === 'password';
    password.type = visible ? 'text' : 'password';
    revealButton.setAttribute('aria-label', visible ? 'Ocultar senha' : 'Mostrar senha');
    revealButton.setAttribute('aria-pressed', String(visible));
  });

  function setError(input, message) {
    input.setAttribute('aria-invalid', String(Boolean(message)));
    document.querySelector(`#${input.id}-error`).textContent = message;
  }

  signupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    const value = password.value;
    const validPassword = value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value) && /[^A-Za-z0-9]/.test(value);
    setError(email, validEmail ? '' : 'Digite um e-mail válido.');
    setError(password, validPassword ? '' : 'A senha deve atender a todos os requisitos.');
    if (!validEmail || !validPassword) {
      (!validEmail ? email : password).focus();
      return;
    }
    sessionStorage.setItem('candidateEmail', email.value.trim());
    window.location.href = 'formulario.html';
  });

  document.querySelector('.login-link').addEventListener('click', (event) => event.preventDefault());
}

const personalForm = document.querySelector('#personal-form');

if (personalForm) {
  const fields = [...personalForm.querySelectorAll('input, select')];
  const saved = JSON.parse(localStorage.getItem('candidatePersonalData') || '{}');
  fields.forEach((field) => {
    if (saved[field.name] !== undefined) field.value = saved[field.name];
  });

  function save() {
    localStorage.setItem('candidatePersonalData', JSON.stringify(Object.fromEntries(fields.map((field) => [field.name, field.value]))));
  }

  function mask(input, digits, pattern) {
    input.addEventListener('input', () => {
      const value = input.value.replace(/\D/g, '').slice(0, digits);
      let index = 0;
      input.value = pattern.replace(/#/g, () => value[index++] ?? '#').split('#')[0];
      save();
    });
  }

  mask(document.querySelector('#cpf'), 11, '###.###.###-##');
  mask(document.querySelector('#phone'), 11, '(##) #####-####');
  mask(document.querySelector('#birth-date'), 8, '##/##/####');
  personalForm.addEventListener('input', save);
  personalForm.addEventListener('change', save);
  document.querySelector('.header-link').addEventListener('click', (event) => event.preventDefault());

  document.querySelector('.add-social').addEventListener('click', () => {
    const wrapper = document.createElement('div');
    wrapper.className = 'social-input';
    const input = document.createElement('input');
    input.type = 'url';
    input.name = `social${fields.length + 1}`;
    input.setAttribute('aria-label', 'Link da rede social');
    wrapper.append(input);
    document.querySelector('#social-links').append(wrapper);
    fields.push(input);
    input.addEventListener('input', save);
    input.focus();
  });

  personalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const required = ['full-name', 'cpf', 'phone', 'birth-date'].map((id) => document.getElementById(id));
    const incomplete = required.find((field) => !field.value.trim() || (field.id === 'cpf' && field.value.length !== 14) || (field.id === 'phone' && field.value.length !== 15) || (field.id === 'birth-date' && field.value.length !== 10));
    if (incomplete) { incomplete.focus(); return; }
    save();
    window.location.href = 'anexar-curriculo.html';
  });
}

const resumeInput = document.querySelector('#resume-file');

if (resumeInput) {
  const error = document.querySelector('.upload-error');
  const openPicker = () => resumeInput.click();
  document.querySelector('.load-resume').addEventListener('click', openPicker);
  document.querySelector('.select-resume').addEventListener('click', openPicker);
  document.querySelector('.choose-another').addEventListener('click', openPicker);

  function validFile(file) {
    return file && /\.(pdf|doc|docx)$/i.test(file.name) && file.size < 2 * 1024 * 1024;
  }

  resumeInput.addEventListener('change', () => {
    const file = resumeInput.files[0];
    if (!file) return;
    document.querySelector('#resume-name').textContent = file.name;
    document.querySelector('#resume-meta').textContent = `${(file.size / 1024 / 1024).toFixed(1).replace('.', ',')} MB • ${file.name.split('.').pop().toUpperCase()}`;
    error.hidden = validFile(file);
  });

  document.querySelector('.try-again').addEventListener('click', () => {
    error.hidden = validFile(resumeInput.files[0]);
  });
  document.querySelector('.advance-button').addEventListener('click', () => {
    if (!validFile(resumeInput.files[0])) error.hidden = false;
  });
}
