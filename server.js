const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const submissions = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'form.html'));
});

app.post('/submit', (req, res) => {
  const { fullname, email, age, password } = req.body;

  if (!fullname || !email || !age || !password) {
    return res.status(400).send('❌ All fields are required.');
  }

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  if (!emailPattern.test(email)) {
    return res.status(400).send('❌ Invalid email format.');
  }

  const strongPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
  if (!strongPattern.test(password)) {
    return res.status(400).send('❌ Password must include uppercase, number, and symbol.');
  }

  if (isNaN(age) || age < 18) {
    return res.status(400).send('❌ You must be at least 18 years old.');
  }

  submissions.push({ fullname, email, age, password });

  res.send(`
    <div style="margin:50px; font-family:Segoe UI;">
      <div class="alert alert-success text-center" role="alert">
        ✅ Form submitted successfully!
      </div>
      <div class="text-center">
        <a href="/" class="btn btn-primary">Go Back to Form</a>
      </div>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    </div>
  `);
});

app.get('/submissions', (req, res) => {
  let html = `
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <div class="container mt-5">
      <h2>Submitted Users</h2>
      <ul class="list-group mb-3">
  `;
  submissions.forEach((user, index) => {
    html += `<li class="list-group-item">${index + 1}. ${user.fullname} (${user.email}, Age: ${user.age})</li>`;
  });
  html += `
      </ul>
      <a href="/" class="btn btn-secondary">Back to Form</a>
    </div>
  `;
  res.send(html);
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
