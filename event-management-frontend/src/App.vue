<!-- src/App.vue -->

<template>
  <div id="app">
    <!-- Conditionally render Navbar based on route meta -->
    <AppNavbar v-if="!hideNavbar" @filter-events="handleFilter" />

    <!-- Routed components will be displayed here -->
    <router-view :filters="filters" />
  </div>
</template>

<script>
import AppNavbar from './components/AppNavbar.vue';
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  name: 'App',
  components: {
    AppNavbar
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const filters = ref({
      search: route.query.search || '',
      startDate: route.query.startDate || '',
      endDate: route.query.endDate || ''
    });

    // Computed property to check if navbar should be hidden
    const hideNavbar = computed(() => route.meta.hideNavbar);

    const handleFilter = (filterCriteria) => {
      filters.value = filterCriteria;
      // Update the route's query parameters to pass filters to routed components
      router.push({ 
        name: route.name, 
        query: filterCriteria 
      });
    };

    return {
      filters,
      handleFilter,
      hideNavbar
    };
  },
  created() {
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token Payload:', payload);
        localStorage.setItem('username', payload.username);
        localStorage.setItem('role', payload.role);
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

<style>
/* Global styles */
body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  background-color: #f9f9f9;
  margin: 0;
}
</style>
