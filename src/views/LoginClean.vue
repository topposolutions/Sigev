<template>
  <div class="auth-container">
    <div class="auth-content">
      <!-- Right side - Auth forms -->
      <div class="auth-section">
        <div class="auth-wrapper">
          <div class="brand-section">
             <div class="brand-icon">
               <svg
                 width="28"
                 height="28"
                 viewBox="0 0 24 24"
                 fill="none"
                 xmlns="http://www.w3.org/2000/svg"
               >
                 <rect width="24" height="24" rx="6" fill="white" />
                 <path
                   d="M6 9h12M6 12h12M6 15h9"
                   stroke="#4C6EF5"
                   stroke-width="1.5"
                   stroke-linecap="round"
                 />
                 <circle cx="16.5" cy="7.5" r="4.5" fill="#4C6EF5" />
                 <path
                   d="m18.75 9.75 1.5 1.5"
                   stroke="white"
                   stroke-width="1.5"
                   stroke-linecap="round"
                 />
               </svg>
             </div>
            <h1 class="brand-title">Sigo</h1>
          </div>
          <div class="auth-header">
            <h3 class="auth-title">Bem-vindo</h3>
            <p class="auth-subtitle">Faça login na sua conta</p>
          </div>

          <!-- Login Form -->
          <form @submit.prevent="login" class="auth-form">
            <input-text
              v-model="form.email"
              type="text"
              required
              label="E-mail"
              placeholder="jhondoe@gmail.com"
              ref="email"
            >
              <template #label>
                <i class="pi pi-envelope"></i>
                <span>Email</span>
              </template>
            </input-text>

            <input-text
              v-model="form.password"
              type="password"
              required
              label="Senha"
              placeholder="*******"
              ref="password"
            >
              <template #label>
                <i class="pi pi-lock"></i>
                <span>Senha</span>
              </template>
            </input-text>

            <div class="form-options">
              <label class="checkbox-wrapper">
                <input
                  type="checkbox"
                  v-model="form.rememberMe"
                  class="checkbox-input"
                />
                <span class="checkbox-custom"></span>
                <span class="checkbox-label">Lembrar-me</span>
              </label>
              <a
                href="#"
                class="forgot-password"
                @click.prevent="showForgotPassword = true"
              >
                Esqueceu a senha?
              </a>
            </div>

            <button type="submit" class="auth-submit-btn" :disabled="pending">
              <span v-if="pending" class="spinner"></span>
              Entrar
            </button>
          </form>

          <div class="divider">
            <span>ou continue com</span>
          </div>

          <!-- Social login buttons -->

          <!--   
          <div class="social-auth">
            <button type="button" class="social-btn google-btn">
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Google
            </button>
            <button type="button" class="social-btn facebook-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
                <path
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
              Facebook
            </button>
          </div>
           -->

          <!-- Mode toggle -->
          <div class="mode-toggle">
            <span>
              Não tem uma conta?
              <a href="#" @click.prevent="toggleMode" class="toggle-link"
                >Cadastre-se</a
              >
            </span>
          </div>

          <!-- Terms -->
          <div class="terms-text">
            Ao continuar, você concorda com nossos
            <a href="#" class="terms-link">Termos de Serviço</a> e
            <a href="#" class="terms-link">Política de Privacidade</a>
          </div>
        </div>
      </div>
    </div>

    <!-- Global Loading Overlay -->
    <GlobalLoadingOverlay />
  </div>
</template>

<script>
import InputText from "../components/ceos-inputs/CeosInput.vue";
import GlobalLoadingOverlay from "../components/common/GlobalLoadingOverlay.vue";
import { Login } from "../common/models/Login/Login.js";
import { useAuthStore } from "../stores/auth.store.js";
import Swal from "sweetalert2";
import { useHtmlClassStore } from "../stores/htmlclass.simple.store.js";
const htmlClassStore = useHtmlClassStore();

export default {
  name: "Login",
  components: { InputText, GlobalLoadingOverlay },
  data() {
    return {
      form: new Login({}),
      pending: false,
      error: "",
    };
  },
  computed: {
    enabledAccess() {
      return this.form.email && this.form.password;
    },
  },
  methods: {
    async login() {
      if (!this.enabledAccess) return;

      // Login mocado com setTimeout
      this.pending = true;

      setTimeout(() => {
        this.pending = false;

        // Verificar credenciais mocado
        if (
          this.form.email === "admin@gmail.com" &&
          this.form.password === "admin"
        ) {
          this.$router.push("/");
        } else {
          // Mostrar erro de credenciais inválidas
          Swal.fire({
            title: "Erro de Login",
            text: "Email ou senha incorretos",
            icon: "error",
            confirmButtonColor: "#3367d6",
            customClass: {
              icon: "swal2-custom-icon",
            },
          });
        }
      }, 2000);

      /*
      htmlClassStore.startLoading();
      this.pending = true;
      const authStore = useAuthStore();

      try {
        await authStore.login({
          username: this.form.email,
          password: this.form.password,
          grant_type: this.form.grant_type,
          client_id: this.form.client_id,
          client_secret: this.form.client_secret,
        });

        location.reload();
      } catch (error) {
        Swal.fire({
          title: this.$t("COMMONS.ERROR_TITLE"),
          text: this.$t("COMMONS.ERROR_MESSAGE"),
          icon: "error",
          confirmButtonColor: "#3367d6",
          customClass: {
            icon: "swal2-custom-icon",
          },
        });
        this.pending = false;
      } finally {
        htmlClassStore.stopLoading();
      }
      */
    },
  },
};
</script>
<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: #f8fafc;
}

.auth-content {
  width: 100%;
  max-width: 100%;
  background: white;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

/* Hero Section - Left side with documents image */
.hero-section {
  position: relative;
  background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.3),
      rgba(99, 102, 241, 0.4)
    ),
    url("https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2426&q=80")
      center/cover;
  display: flex;
  flex-direction: column;
  padding: 48px;
  color: white;
  height: 100%;
}

.hero-overlay {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.brand-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 60px;
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
}

.brand-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: white;
}

.hero-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 500px;
}

.hero-text {
  margin-bottom: 40px;
}

.hero-title {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 8px;
  color: white;
  word-wrap: break-word;
}

.hero-subtitle {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 10px;
  color: #e2e8f0;
  opacity: 0.9;
}

.hero-description {
  font-size: 16px;
  line-height: 1.6;
  opacity: 0.9;
  margin-bottom: 0;
  color: white;
}

.features-list {
  display: flex;
  flex-direction: row;
  gap: 20px;
  flex-wrap: wrap;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 15px;
}

.feature-icon {
  font-size: 20px;
  color: #60a5fa;
}

/* Brand Section */
.brand-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 40px;
}

.brand-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #4C6EF5, #3B82F6);
  box-shadow: 0 4px 12px rgba(76, 110, 245, 0.3);
}

.brand-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
  letter-spacing: -0.5px;
}

/* Auth Section - Right side */
.auth-section {
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  width: 100%;
  max-width: 500px;
}

.auth-wrapper {
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
  width: 100%;
}

.auth-title {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 8px;
  line-height: 1.2;
}

.auth-subtitle {
  color: #6b7280;
  font-size: 16px;
  margin: 0;
  font-weight: 400;
}

/* Form Styles */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
  width: 100%;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 500;
  color: #374151;
  font-size: 14px;
  margin-bottom: 4px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #9ca3af;
  z-index: 1;
}

.form-control-custom {
  width: 100%;
  padding: 16px 16px 16px 48px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.2s ease;
  background: white;
  color: #1f2937;
}

.form-control-custom::placeholder {
  color: #9ca3af;
}

.form-control-custom:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  outline: none;
}

/* Password Input */
.password-toggle {
  position: absolute;
  right: 16px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  z-index: 2;
}

.password-toggle:hover {
  color: #6b7280;
}

/* Form Options */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  width: 100%;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.checkbox-input {
  display: none;
}

.checkbox-custom {
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.checkbox-input:checked + .checkbox-custom {
  background: #3b82f6;
  border-color: #3b82f6;
}

.checkbox-input:checked + .checkbox-custom::after {
  content: "✓";
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.checkbox-label {
  font-size: 14px;
  color: #374151;
}

.forgot-password {
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.forgot-password:hover {
  text-decoration: underline;
}

/* Submit Button */
.auth-submit-btn {
  width: 100%;
  padding: 16px 24px;
  background: #3b82f6;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  margin: 0 auto;
}

.auth-submit-btn:hover {
  background: #2563eb;
}

.auth-submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Divider */
.divider {
  position: relative;
  text-align: center;
  margin: 32px auto 24px auto;
  color: #9ca3af;
  font-size: 14px;
  width: 100%;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  background: white;
  padding: 0 16px;
  position: relative;
  z-index: 1;
}

/* Social Auth */
.social-auth {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 32px;
  width: 100%;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s ease;
  background: white;
  color: #374151;
  cursor: pointer;
}

.social-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
}

/* Mode Toggle */
.mode-toggle {
  text-align: center;
  margin-bottom: 24px;
  color: #6b7280;
  font-size: 14px;
  width: 100%;
}

.toggle-link {
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
}

.toggle-link:hover {
  text-decoration: underline;
}

/* Terms */
.terms-text {
  text-align: center;
  font-size: 12px;
  color: #9ca3af;
  line-height: 1.4;
  width: 100%;
}

.terms-link {
  color: #3b82f6;
  text-decoration: none;
}

.terms-link:hover {
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .auth-content {
    grid-template-columns: 1fr;
    min-height: 100vh;
  }

  .hero-section {
    padding: 40px 24px;
    min-height: 40vh;
  }

  .hero-title {
    font-size: 28px;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 18px;
  }

  .hero-description {
    font-size: 14px;
  }

  .features-list {
    gap: 12px;
    flex-direction: column;
  }

  .feature-item {
    font-size: 14px;
    flex: none;
  }

  .feature-item span {
    white-space: normal;
    text-overflow: initial;
    overflow: visible;
  }

  .auth-section {
    padding: 20px;
    max-width: 100%;
  }

  .brand-section {
    margin-bottom: 32px;
  }

  .brand-icon {
    width: 40px;
    height: 40px;
  }

  .brand-title {
    font-size: 24px;
  }

  .auth-title {
    font-size: 24px;
  }

  .social-auth {
    grid-template-columns: 1fr;
  }

  .form-options {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
}

/* Focus styles for accessibility */
*:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
