<!-- src/components/AppNavbar.vue -->

<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link to="/" class="site-name">EventFizz</router-link>
    </div>
    
    <div class="navbar-right">
      <!-- If User is Logged In -->
      <div v-if="isLoggedIn" class="user-dropdown" ref="userDropdown">
        <span 
          class="username" 
          @click="toggleDropdown" 
          @keydown.enter.prevent="toggleDropdown" 
          tabindex="0" 
          aria-haspopup="true" 
          :aria-expanded="showDropdown"
        >
          Welcome, {{ username }}!
          <!-- Down Arrow Icon -->
          <svg 
            :class="{'rotate-180': showDropdown}" 
            class="arrow-icon" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            width="16" 
            height="16"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M19 9l-7 7-7-7" />
          </svg>
        </span>
        <div v-if="showDropdown" class="dropdown-menu" role="menu">
          <button 
            @click="logout" 
            class="dropdown-item" 
            role="menuitem"
          >
            Logout
          </button>
        </div>
      </div>

      <!-- If User is Not Logged In -->
      <div v-else class="auth-links">
        <router-link to="/login" class="nav-link">Sign In</router-link>
        <router-link to="/register" class="nav-link">Sign Up</router-link>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'AppNavbar', // **Multi-word component name**
  data() {
    return {
      username: localStorage.getItem('username') || '',
      token: localStorage.getItem('token') || '',
      searchQuery: '',
      startDate: '',
      endDate: '',
      showDropdown: false
    };
  },
  computed: {
    isLoggedIn() {
      return !!this.token;
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      this.token = '';
      this.username = '';
      this.showDropdown = false;
      this.$router.push('/');
      alert('You have successfully logged out!');
    },
    emitSearch() {
      // Emit the filter criteria to the parent component
      this.$emit('filter-events', {
        search: this.searchQuery,
        startDate: this.startDate,
        endDate: this.endDate
      });
    },
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    handleClickOutside(event) {
      const dropdown = this.$refs.userDropdown;
      if (dropdown && !dropdown.contains(event.target)) {
        this.showDropdown = false;
      }
    }
  },
  mounted() {
    // Listen for clicks outside the dropdown to close it
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    // Clean up the event listener
    document.removeEventListener('click', this.handleClickOutside);
  },
  created() {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token Payload:', payload);
        localStorage.setItem('username', payload.username);
        localStorage.setItem('role', payload.role);
        this.username = payload.username;
      } catch (error) {
        console.error('Error decoding token:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('role');
      }
    }
  }
};
</script>

<style scoped>
/* Navbar Styles */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #6c63ff;
  padding: 10px 20px;
  color: #fff;
  position: sticky;
  top: 0;
  z-index: 1000;
}

/* Site Name */
.site-name {
  font-size: 1.5rem;
  font-weight: bold;
  color: #fff;
  text-decoration: none;
}

.site-name:hover {
  text-decoration: underline;
}

/* Center Section (Search and Filters) */
.navbar-center {
  display: flex;
  align-items: center;
  gap: 15px;
}

.search-input {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  width: 200px;
}

.search-input:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
}

.date-filters {
  display: flex;
  align-items: center;
  gap: 5px;
}

.date-input {
  padding: 5px;
  border: none;
  border-radius: 4px;
}

.date-input:focus {
  outline: none;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.7);
}

.date-separator {
  color: #fff;
  font-size: 1rem;
}

/* Right Section (Auth Links or User Dropdown) */
.navbar-right {
  display: flex;
  align-items: center;
}

/* Auth Links */
.auth-links .nav-link {
  margin-left: 15px;
  color: #fff;
  text-decoration: none;
  font-weight: 500;
}

.auth-links .nav-link:hover {
  text-decoration: underline;
}

/* User Dropdown */
.user-dropdown {
  position: relative;
  cursor: pointer;
}

.username {
  font-weight: 500;
  user-select: none;
  display: flex;
  align-items: center;
}

.arrow-icon {
  margin-left: 5px;
  transition: transform 0.3s ease;
}

.rotate-180 {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 35px;
  background-color: #fff;
  color: #333;
  border-radius: 4px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  min-width: 100px;
  z-index: 1001;
}

.dropdown-item {
  padding: 10px 15px;
  cursor: pointer;
  background-color: #fff;
  border: none;
  width: 100%;
  text-align: left;
  font-size: 1rem;
}

.dropdown-item:hover {
  background-color: #f0f0f0;
}

/* Responsive Design */
@media (max-width: 992px) {
  .search-input {
    width: 150px;
  }

  .navbar-center {
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    align-items: flex-start;
  }

  .navbar-center {
    width: 100%;
    margin-top: 10px;
  }

  .search-input {
    width: 100%;
  }

  .date-filters {
    width: 100%;
    justify-content: space-between;
  }

  .navbar-right {
    width: 100%;
    justify-content: flex-end;
    margin-top: 10px;
  }
}

@media (max-width: 480px) {
  .site-name {
    font-size: 1.2rem;
  }

  .search-input {
    width: 100%;
  }

  .date-input {
    width: 45%;
  }
}
</style>
