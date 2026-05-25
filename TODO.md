# TODO - OTP Auth + Protected Routes (Code-A-Nova)

- [ ] Update User model with `otp`, `otpExpires`, `isVerified`
- [ ] Update backend auth routes:
  - [ ] Register: generate OTP, store + expiry, send email
  - [ ] Add `POST /verify-otp`
  - [ ] Login: require `isVerified === true` and issue JWT
  - [ ] Logout: clear token response (stateless)
- [x] Fix `/profile` to use correct `req.user.id`

- [x] Update backend to use existing helpers (`generateOTP`, `sendEmail`, `generateToken`)

- [x] Frontend: implement React Router + pages

  - [ ] App routes: Home, Signup, Verify OTP, Login, Dashboard
  - [ ] ProtectedRoute component
  - [ ] AuthContext (localStorage token) + logout
  - [ ] Signup form -> register API -> navigate to verify
  - [ ] Verify OTP form -> verify-otp API -> navigate to login
  - [ ] Login form -> login API -> navigate to dashboard
  - [ ] Dashboard protected UI (basic)
- [x] Run backend/frontend dev servers and do quick manual tests

