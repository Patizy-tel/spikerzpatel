import { Component, OnInit, OnDestroy, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="login-container">
      <!-- Animated Background -->
      <div class="background-layer">
        <canvas #particleCanvas class="particle-canvas"></canvas>
        <div class="gradient-overlay"></div>
        <div class="grid-overlay"></div>

        <!-- Floating Shapes -->
        <div class="floating-shapes">
          @for (shape of shapes; track shape.id) {
            <div
              class="shape"
              [class]="shape.type"
              [style.left.%]="shape.x"
              [style.top.%]="shape.y"
              [style.animation-delay]="shape.delay + 's'"
              [style.animation-duration]="shape.duration + 's'"
            ></div>
          }
        </div>

        <!-- Cyber Lines -->
        <div class="cyber-lines">
          @for (line of cyberLines; track line.id) {
            <div
              class="cyber-line"
              [style.left.%]="line.x"
              [style.animation-delay]="line.delay + 's'"
            ></div>
          }
        </div>
      </div>

      <!-- Login Card -->
      <div class="login-wrapper" [class.loaded]="isLoaded()">
        <div class="login-card">
          <!-- Logo Section -->
          <div class="logo-section">
            <div class="logo-container">
              <div class="logo-shield">
                <mat-icon class="shield-icon">security</mat-icon>
                <div class="shield-pulse"></div>
              </div>
              <div class="logo-text">
                <span class="company-name">SPIKERZ</span>
                <span class="company-tagline">Security Intelligence Platform</span>
              </div>
            </div>
          </div>

          <!-- Welcome Text -->
          <div class="welcome-section">
            <h1 class="welcome-title">Welcome Back</h1>
            <p class="welcome-subtitle">Sign in to access your security dashboard</p>
          </div>

          <!-- Login Form -->
          <form class="login-form" (submit)="onLogin($event)">
            <div class="form-group" [class.focused]="emailFocused()" [class.filled]="emailValue()">
              <label for="email">
                <mat-icon>email</mat-icon>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                (focus)="emailFocused.set(true)"
                (blur)="emailFocused.set(false)"
                (input)="onEmailInput($event)"
                autocomplete="email"
              />
              <div class="input-border"></div>
              <div class="input-glow"></div>
            </div>

            <div class="form-group" [class.focused]="passwordFocused()" [class.filled]="passwordValue()">
              <label for="password">
                <mat-icon>lock</mat-icon>
                Password
              </label>
              <input
                [type]="showPassword() ? 'text' : 'password'"
                id="password"
                (focus)="passwordFocused.set(true)"
                (blur)="passwordFocused.set(false)"
                (input)="onPasswordInput($event)"
                autocomplete="current-password"
              />
              <button
                type="button"
                class="toggle-password"
                (click)="showPassword.set(!showPassword())"
              >
                <mat-icon>{{ showPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <div class="input-border"></div>
              <div class="input-glow"></div>
            </div>

            <div class="form-options">
              <label class="remember-me">
                <input type="checkbox" />
                <span class="checkbox-custom"></span>
                Remember me
              </label>
              <a href="#" class="forgot-link">Forgot password?</a>
            </div>

            <button type="submit" class="login-btn" [class.loading]="isLoading()">
              <span class="btn-text">Sign In</span>
              <span class="btn-loader">
                <span class="loader-dot"></span>
                <span class="loader-dot"></span>
                <span class="loader-dot"></span>
              </span>
              <mat-icon class="btn-icon">arrow_forward</mat-icon>
              <div class="btn-ripple"></div>
            </button>
          </form>

          <!-- Divider -->
          <div class="divider">
            <span>or continue with</span>
          </div>

          <!-- Social Login -->
          <div class="social-login">
            <button class="social-btn google">
              <svg viewBox="0 0 24 24" class="social-icon">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button class="social-btn microsoft">
              <svg viewBox="0 0 24 24" class="social-icon">
                <path d="M11.4 24H0V12.6h11.4V24z" fill="#00A4EF"/>
                <path d="M24 24H12.6V12.6H24V24z" fill="#FFB900"/>
                <path d="M11.4 11.4H0V0h11.4v11.4z" fill="#F25022"/>
                <path d="M24 11.4H12.6V0H24v11.4z" fill="#7FBA00"/>
              </svg>
              Microsoft
            </button>
            <button class="social-btn sso">
              <mat-icon>vpn_key</mat-icon>
              SSO
            </button>
          </div>

          <!-- Footer -->
          <div class="card-footer">
            <p>Protected by enterprise-grade security</p>
            <div class="security-badges">
              <span class="badge">
                <mat-icon>verified_user</mat-icon>
                SOC 2
              </span>
              <span class="badge">
                <mat-icon>lock</mat-icon>
                256-bit SSL
              </span>
            </div>
          </div>
        </div>

        <!-- Side Info -->
        <div class="side-info">
          <div class="info-content">
            <h2>Secure Your Infrastructure</h2>
            <p>Real-time vulnerability detection and remediation for enterprise environments.</p>

            <div class="features-list">
              <div class="feature-item">
                <div class="feature-icon">
                  <mat-icon>radar</mat-icon>
                </div>
                <div class="feature-text">
                  <span class="feature-title">Continuous Scanning</span>
                  <span class="feature-desc">24/7 automated vulnerability detection</span>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <mat-icon>speed</mat-icon>
                </div>
                <div class="feature-text">
                  <span class="feature-title">Instant Alerts</span>
                  <span class="feature-desc">Real-time threat notifications</span>
                </div>
              </div>
              <div class="feature-item">
                <div class="feature-icon">
                  <mat-icon>auto_fix_high</mat-icon>
                </div>
                <div class="feature-text">
                  <span class="feature-title">Auto Remediation</span>
                  <span class="feature-desc">One-click security patches</span>
                </div>
              </div>
            </div>

            <div class="stats-row">
              <div class="stat">
                <span class="stat-value">99.9%</span>
                <span class="stat-label">Uptime</span>
              </div>
              <div class="stat">
                <span class="stat-value">50K+</span>
                <span class="stat-label">CVEs Tracked</span>
              </div>
              <div class="stat">
                <span class="stat-value">&lt;1min</span>
                <span class="stat-label">Response Time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: `
    .login-container {
      min-height: 100vh;
      min-height: 100dvh;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      background: #0a0a1a;
    }

    /* ========== ANIMATED BACKGROUND ========== */
    .background-layer {
      position: absolute;
      inset: 0;
      overflow: hidden;
    }

    .particle-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .gradient-overlay {
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 50%, rgba(139, 92, 246, 0.1) 0%, transparent 60%);
      animation: gradientShift 15s ease-in-out infinite;
    }

    @keyframes gradientShift {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); }
    }

    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(16, 185, 129, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16, 185, 129, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      animation: gridMove 20s linear infinite;
    }

    @keyframes gridMove {
      0% { transform: translate(0, 0); }
      100% { transform: translate(50px, 50px); }
    }

    /* Floating Shapes */
    .floating-shapes {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }

    .shape {
      position: absolute;
      border-radius: 50%;
      opacity: 0.1;
      animation: float 20s ease-in-out infinite;
    }

    .shape.circle-lg {
      width: 300px;
      height: 300px;
      background: linear-gradient(135deg, #10b981, #3b82f6);
      filter: blur(60px);
    }

    .shape.circle-md {
      width: 200px;
      height: 200px;
      background: linear-gradient(135deg, #8b5cf6, #ec4899);
      filter: blur(40px);
    }

    .shape.circle-sm {
      width: 100px;
      height: 100px;
      background: linear-gradient(135deg, #06b6d4, #10b981);
      filter: blur(30px);
    }

    @keyframes float {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(30px, -30px) rotate(90deg); }
      50% { transform: translate(-20px, 20px) rotate(180deg); }
      75% { transform: translate(20px, 30px) rotate(270deg); }
    }

    /* Cyber Lines */
    .cyber-lines {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .cyber-line {
      position: absolute;
      width: 2px;
      height: 100px;
      background: linear-gradient(to bottom, transparent, #10b981, transparent);
      animation: cyberLineMove 3s linear infinite;
      opacity: 0.3;
    }

    @keyframes cyberLineMove {
      0% { top: -100px; opacity: 0; }
      10% { opacity: 0.3; }
      90% { opacity: 0.3; }
      100% { top: 100%; opacity: 0; }
    }

    /* ========== LOGIN WRAPPER ========== */
    .login-wrapper {
      display: flex;
      gap: var(--spacing-xl);
      max-width: 1000px;
      width: 100%;
      padding: var(--spacing-lg);
      position: relative;
      z-index: 10;
      opacity: 0;
      transform: translateY(30px);
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .login-wrapper.loaded {
      opacity: 1;
      transform: translateY(0);
    }

    /* ========== LOGIN CARD ========== */
    .login-card {
      flex: 1;
      max-width: 420px;
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(20px);
      border-radius: var(--radius-xl);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: var(--spacing-xl);
      box-shadow:
        0 25px 50px -12px rgba(0, 0, 0, 0.5),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    /* Logo Section */
    .logo-section {
      text-align: center;
      margin-bottom: var(--spacing-lg);
    }

    .logo-container {
      display: inline-flex;
      align-items: center;
      gap: var(--spacing-md);
    }

    .logo-shield {
      position: relative;
      width: 3.5rem;
      height: 3.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #10b981, #059669);
      border-radius: var(--radius-lg);
      box-shadow: 0 10px 30px -10px rgba(16, 185, 129, 0.5);
    }

    .shield-icon {
      font-size: 1.75rem;
      width: 1.75rem;
      height: 1.75rem;
      color: white;
    }

    .shield-pulse {
      position: absolute;
      inset: -4px;
      border-radius: var(--radius-lg);
      border: 2px solid #10b981;
      animation: shieldPulse 2s ease-out infinite;
    }

    @keyframes shieldPulse {
      0% { transform: scale(1); opacity: 0.5; }
      100% { transform: scale(1.3); opacity: 0; }
    }

    .logo-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .company-name {
      font-size: 1.75rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      background: linear-gradient(135deg, #ffffff, #a1a1aa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .company-tagline {
      font-size: 0.625rem;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.15em;
    }

    /* Welcome Section */
    .welcome-section {
      text-align: center;
      margin-bottom: var(--spacing-lg);
    }

    .welcome-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      margin: 0 0 var(--spacing-xs);
    }

    .welcome-subtitle {
      font-size: 0.875rem;
      color: #71717a;
      margin: 0;
    }

    /* Login Form */
    .login-form {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
    }

    .form-group {
      position: relative;
    }

    .form-group label {
      position: absolute;
      left: var(--spacing-md);
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      font-size: 0.875rem;
      color: #71717a;
      pointer-events: none;
      transition: all 0.3s ease;
    }

    .form-group label mat-icon {
      font-size: 1.125rem;
      width: 1.125rem;
      height: 1.125rem;
    }

    .form-group.focused label,
    .form-group.filled label {
      top: 0;
      transform: translateY(-50%);
      font-size: 0.75rem;
      background: linear-gradient(to bottom, transparent 45%, rgba(10, 10, 26, 0.9) 45%);
      padding: 0 var(--spacing-xs);
      left: var(--spacing-sm);
    }

    .form-group.focused label {
      color: #10b981;
    }

    .form-group input {
      width: 100%;
      padding: var(--spacing-md);
      padding-left: var(--spacing-md);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      font-size: 0.875rem;
      color: white;
      transition: all 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: #10b981;
      background: rgba(16, 185, 129, 0.05);
    }

    .input-border {
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 0;
      height: 2px;
      background: linear-gradient(90deg, #10b981, #3b82f6);
      transition: all 0.3s ease;
      transform: translateX(-50%);
      border-radius: 0 0 var(--radius-md) var(--radius-md);
    }

    .form-group.focused .input-border {
      width: 100%;
    }

    .input-glow {
      position: absolute;
      inset: 0;
      border-radius: var(--radius-md);
      opacity: 0;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.3);
      transition: opacity 0.3s ease;
      pointer-events: none;
    }

    .form-group.focused .input-glow {
      opacity: 1;
    }

    .toggle-password {
      position: absolute;
      right: var(--spacing-sm);
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #71717a;
      cursor: pointer;
      padding: var(--spacing-xs);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: color 0.2s ease;
    }

    .toggle-password:hover {
      color: white;
    }

    /* Form Options */
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.8125rem;
    }

    .remember-me {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: #a1a1aa;
      cursor: pointer;
    }

    .remember-me input {
      display: none;
    }

    .checkbox-custom {
      width: 1rem;
      height: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: var(--radius-xs);
      position: relative;
      transition: all 0.2s ease;
    }

    .remember-me input:checked + .checkbox-custom {
      background: #10b981;
      border-color: #10b981;
    }

    .remember-me input:checked + .checkbox-custom::after {
      content: '';
      position: absolute;
      left: 5px;
      top: 2px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .forgot-link {
      color: #10b981;
      text-decoration: none;
      transition: color 0.2s ease;
    }

    .forgot-link:hover {
      color: #34d399;
    }

    /* Login Button */
    .login-btn {
      position: relative;
      width: 100%;
      padding: var(--spacing-md) var(--spacing-lg);
      background: linear-gradient(135deg, #10b981, #059669);
      border: none;
      border-radius: var(--radius-md);
      color: white;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-sm);
    }

    .login-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px -10px rgba(16, 185, 129, 0.5);
    }

    .login-btn:active {
      transform: translateY(0);
    }

    .btn-icon {
      transition: transform 0.3s ease;
    }

    .login-btn:hover .btn-icon {
      transform: translateX(4px);
    }

    .btn-loader {
      display: none;
      gap: 4px;
    }

    .login-btn.loading .btn-text,
    .login-btn.loading .btn-icon {
      display: none;
    }

    .login-btn.loading .btn-loader {
      display: flex;
    }

    .loader-dot {
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
      animation: loaderBounce 0.6s ease-in-out infinite;
    }

    .loader-dot:nth-child(2) {
      animation-delay: 0.1s;
    }

    .loader-dot:nth-child(3) {
      animation-delay: 0.2s;
    }

    @keyframes loaderBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }

    .btn-ripple {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at center, rgba(255,255,255,0.3) 0%, transparent 70%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    .login-btn:hover .btn-ripple {
      opacity: 1;
    }

    /* Divider */
    .divider {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin: var(--spacing-lg) 0;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
    }

    .divider span {
      font-size: 0.75rem;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    /* Social Login */
    .social-login {
      display: flex;
      gap: var(--spacing-sm);
    }

    .social-btn {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--spacing-xs);
      padding: var(--spacing-sm) var(--spacing-md);
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      color: #a1a1aa;
      font-size: 0.8125rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .social-btn:hover {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.2);
      color: white;
    }

    .social-icon {
      width: 1rem;
      height: 1rem;
    }

    .social-btn mat-icon {
      font-size: 1rem;
      width: 1rem;
      height: 1rem;
    }

    /* Card Footer */
    .card-footer {
      margin-top: var(--spacing-lg);
      padding-top: var(--spacing-md);
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      text-align: center;
    }

    .card-footer p {
      font-size: 0.75rem;
      color: #52525b;
      margin: 0 0 var(--spacing-sm);
    }

    .security-badges {
      display: flex;
      justify-content: center;
      gap: var(--spacing-md);
    }

    .badge {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 0.625rem;
      color: #71717a;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .badge mat-icon {
      font-size: 0.75rem;
      width: 0.75rem;
      height: 0.75rem;
      color: #10b981;
    }

    /* ========== SIDE INFO ========== */
    .side-info {
      flex: 1;
      max-width: 400px;
      display: flex;
      align-items: center;
    }

    .info-content {
      color: white;
    }

    .info-content h2 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 var(--spacing-md);
      background: linear-gradient(135deg, #ffffff, #a1a1aa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .info-content > p {
      font-size: 1rem;
      color: #a1a1aa;
      line-height: 1.6;
      margin: 0 0 var(--spacing-xl);
    }

    /* Features List */
    .features-list {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-xl);
    }

    .feature-item {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      padding: var(--spacing-md);
      background: rgba(255, 255, 255, 0.03);
      border-radius: var(--radius-md);
      border: 1px solid rgba(255, 255, 255, 0.05);
      transition: all 0.3s ease;
    }

    .feature-item:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(16, 185, 129, 0.3);
      transform: translateX(8px);
    }

    .feature-icon {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(16, 185, 129, 0.1);
      border-radius: var(--radius-md);
      color: #10b981;
      flex-shrink: 0;
    }

    .feature-text {
      display: flex;
      flex-direction: column;
    }

    .feature-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: white;
    }

    .feature-desc {
      font-size: 0.75rem;
      color: #71717a;
    }

    /* Stats Row */
    .stats-row {
      display: flex;
      gap: var(--spacing-lg);
    }

    .stat {
      display: flex;
      flex-direction: column;
    }

    .stat-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #10b981;
    }

    .stat-label {
      font-size: 0.75rem;
      color: #71717a;
    }

    /* ========== RESPONSIVE ========== */
    @media (max-width: 900px) {
      .side-info {
        display: none;
      }

      .login-wrapper {
        justify-content: center;
      }
    }

    @media (max-width: 480px) {
      .login-wrapper {
        padding: var(--spacing-md);
      }

      .login-card {
        padding: var(--spacing-lg);
      }

      .logo-container {
        flex-direction: column;
        text-align: center;
      }

      .logo-text {
        align-items: center;
      }

      .social-login {
        flex-direction: column;
      }

      .form-options {
        flex-direction: column;
        gap: var(--spacing-sm);
        align-items: flex-start;
      }
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .gradient-overlay,
      .grid-overlay,
      .shape,
      .cyber-line,
      .shield-pulse {
        animation: none;
      }
    }
  `,
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  isLoaded = signal(false);
  isLoading = signal(false);
  emailFocused = signal(false);
  passwordFocused = signal(false);
  emailValue = signal('');
  passwordValue = signal('');
  showPassword = signal(false);

  shapes = [
    { id: 1, type: 'circle-lg', x: 10, y: 20, delay: 0, duration: 25 },
    { id: 2, type: 'circle-md', x: 80, y: 60, delay: 5, duration: 20 },
    { id: 3, type: 'circle-sm', x: 60, y: 10, delay: 10, duration: 18 },
    { id: 4, type: 'circle-md', x: 20, y: 70, delay: 3, duration: 22 },
    { id: 5, type: 'circle-sm', x: 90, y: 30, delay: 7, duration: 19 },
  ];

  cyberLines = [
    { id: 1, x: 15, delay: 0 },
    { id: 2, x: 35, delay: 1 },
    { id: 3, x: 55, delay: 2 },
    { id: 4, x: 75, delay: 0.5 },
    { id: 5, x: 95, delay: 1.5 },
  ];

  private animationFrameId: number | null = null;
  private particles: Particle[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    setTimeout(() => this.isLoaded.set(true), 100);
  }

  ngAfterViewInit(): void {
    this.initParticles();
  }

  ngOnDestroy(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  private initParticles(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Create particles
    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw particles
      this.particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity})`;
        ctx.fill();

        // Draw connections
        this.particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.1 * (1 - dist / 120)})`;
            ctx.stroke();
          }
        });
      });

      this.animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  }

  onEmailInput(event: Event): void {
    this.emailValue.set((event.target as HTMLInputElement).value);
  }

  onPasswordInput(event: Event): void {
    this.passwordValue.set((event.target as HTMLInputElement).value);
  }

  onLogin(event: Event): void {
    event.preventDefault();
    this.isLoading.set(true);

    // Simulate login
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/dashboard']);
    }, 1500);
  }
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}
