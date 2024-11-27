<template>
  <nav class="navbar">
    <div class="navbar-left">
      <router-link to="/" class="site-name">YourSiteName</router-link>
    </div>
    
    <div class="navbar-center">
      <!-- Search Bar -->
      <input 
        v-model="searchQuery" 
        class="search-input" 
        placeholder="Search by name" 
        @input="emitSearch"
      />

      <!-- Date Range Filters -->
      <div class="date-filters">
        <input 
          type="date" 
          v-model="startDate" 
          class="date-input" 
          @change="emitSearch" 
          placeholder="Start Date"
        />
        <span class="date-separator">-</span>
        <input 
          type="date" 
          v-model="endDate" 
          class="date-input" 
          @change="emitSearch" 
          placeholder="End Date"
        />
      </div>
    </div>
    
    <div class="navbar-right">
      <!-- If User is Logged In -->
      <div v-if="isLoggedIn" class="user-dropdown" @mouseover="showDropdown = true" @mouseleave="showDropdown = false">
        <span class="username">Welcome, {{ username }}!</span>
        <div v-if="showDropdown" class="dropdown-menu">
          <button @click="logout" class="dropdown-item">Logout</button>
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
  name: 'Navbar',
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
      this.$router.push('/');
      alert('You have successfully logged out!');
    },
    emitSearch() {
      // Emit an event to notify parent or other components about the search/filter criteria
      this.$emit('filter-events', {
        search: this.searchQuery,
        startDate: this.startDate,
        endDate: this.endDate
      });
    }
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
