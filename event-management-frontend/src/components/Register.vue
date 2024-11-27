<template>
  <div class="auth-container" :style="containerStyle">
    <div class="auth-card">
      <h2 class="auth-title">Sign Up</h2>
      <form @submit.prevent="register" class="auth-form">
        <div class="form-group" :class="{ 'has-error': usernameError }">
          <label for="username">Username</label>
          <input 
            type="text" 
            v-model="username" 
            id="username" 
            required 
            placeholder="Enter your username"
            class="auth-input"
          />
          <span v-if="usernameError" class="error-message">Username is required.</span>
        </div>

        <div class="form-group" :class="{ 'has-error': emailError }">
          <label for="email">Email</label>
          <input 
            type="email" 
            v-model="email" 
            id="email" 
            required 
            placeholder="Enter your email"
            class="auth-input"
          />
          <span v-if="emailError" class="error-message">Invalid email address.</span>
        </div>

        <div class="form-group" :class="{ 'has-error': passwordError }">
          <label for="password">Password</label>
          <input 
            type="password" 
            v-model="password" 
            id="password" 
            required 
            placeholder="Enter your password"
            class="auth-input"
          />
          <span v-if="passwordError" class="error-message">Password must be at least 6 characters.</span>
        </div>

        <button 
          type="submit" 
          class="auth-button" 
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Register</span>
          <span v-else class="spinner"></span>
        </button>
      </form>
      <p class="auth-link">
        Already have an account? 
        <router-link to="/login" class="link">Sign In</router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const backgroundImages = [
  '/assets/events/pexels-bertellifotografia-2608517.jpg',
  '/assets/events/pexels-bertellifotografia-29406512.jpg',
  '/assets/events/pexels-ezequiel-alfonso-3234743-29347735.jpg',
  '/assets/events/pexels-franco-monsalvo-252430633-29356373.jpg',
  '/assets/events/pexels-icsa-833425-1709003.jpg',
  '/assets/events/pexels-israyosoy-29436830.jpg',
  '/assets/events/pexels-israyosoy-29436916.jpg',
  '/assets/events/pexels-jonathanborba-29382709.jpg',
  '/assets/events/pexels-juan-felipe-ramirez-312591454-29361381.jpg',
  '/assets/events/pexels-osvaldosam-29367552.jpg',
  '/assets/events/pexels-pixabay-433452.jpg',
  '/assets/events/pexels-sandra-nanteza-532613123-29370058.jpg',
  '/assets/events/pexels-sandra-nanteza-532613123-29370382.jpg',
  '/assets/events/pexels-srivathsa-3760743-29345538.jpg',
  '/assets/events/pexels-zhuhehuai-716276.jpg',
  '/assets/events/photo-1492684223066-81342ee5ff30.jpeg',
];

export default {
  name: 'RegisterPage',
  data() {
    return {
      username: '',
      email: '',
      password: '',
      backgroundImage: '',
      isLoading: false,
      usernameError: false,
      emailError: false,
      passwordError: false,
    };
  },
  computed: {
    containerStyle() {
      return {
        backgroundImage: `url(${this.backgroundImage})`,
      };
    },
  },
  created() {
    this.setRandomBackground();
  },
  methods: {
    setRandomBackground() {
      const randomIndex = Math.floor(Math.random() * backgroundImages.length);
      this.backgroundImage = backgroundImages[randomIndex];
    },
    async register() {
      this.isLoading = true;
      this.usernameError = false;
      this.emailError = false;
      this.passwordError = false;

      if (!this.username.trim()) {
        this.usernameError = true;
      }
      if (!this.email.trim()) {
        this.emailError = true;
      }
      if (this.password.length < 6) {
        this.passwordError = true;
      }

      if (this.usernameError || this.emailError || this.passwordError) {
        this.isLoading = false;
        return;
      }

      try {
        await axios.post('http://localhost:3000/api/auth/register', {
          username: this.username,
          email: this.email,
          password: this.password,
        });

        alert('Registration successful!');
        this.$router.push('/login');
      } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed, please try again.');
      } finally {
        this.isLoading = false;
      }
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
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.auth-card {
  background: rgba(255, 255, 255, 0.7); /* Semi-transparent white */
  padding: 2rem 2.5rem; /* Increased padding for the right side */
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px; /* Adjusted width to extend the card */
  margin: 1rem;
  transition: background-color 0.3s ease;
}

.auth-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); /* Enhances text readability */
}

.form-group {
  margin-bottom: 1rem;
  position: relative;
}

.auth-form label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555555;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); /* Enhances label readability */
}

.auth-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.auth-input:focus {
  border-color: #6c63ff;
  outline: none;
  box-shadow: 0 0 5px rgba(108, 99, 255, 0.5);
}

.has-error input {
  border-color: #e74c3c;
}

.error-message {
  color: #e74c3c;
  font-size: 0.875rem;
  position: absolute;
  bottom: -1.25rem;
  left: 0;
}

.auth-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #6c63ff;
  color: #ffffff;
  border: none;
  border-radius: 0.25rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

.auth-button:hover {
  background-color: #574b90;
}

.auth-button:active {
  background-color: #3f3070;
}

.auth-button:disabled {
  background-color: #a9a9a9;
  cursor: not-allowed;
}

.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-left-color: #ffffff;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  display: inline-block;
  animation: spin 1s linear infinite;
}

.auth-link {
  text-align: center;
  margin-top: 1rem;
  color: #333333;
}

.auth-link a {
  color: #6c63ff;
  text-decoration: none;
  font-weight: 500;
}

.auth-link a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .auth-card {
    padding: 1.5rem 2rem;
  }

  .auth-title {
    font-size: 1.25rem;
  }
}
</style>
