<template>
  <div v-if="event">
    <h2>{{ event.name }}</h2>
    <p><strong>Description:</strong> {{ event.description }}</p>
    <p><strong>Date:</strong> {{ formatDate(event.date) }}</p>
    <!-- Add more event details here if needed -->
  </div>
  <div v-else>
    <p>Loading event details...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['id'],  // Receive event ID as a prop
  data() {
    return {
      event: null,  // Store event data
      errorMessage: ''
    }; 
  },
  created() {
    this.fetchEventDetails();  // Fetch event details when the component is created
  },
  methods: {
    fetchEventDetails() {
      axios.get(`http://localhost:3000/api/events/${this.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Include token in the header
        }
      })
      .then(response => {
        this.event = response.data;
      })
      .catch(error => {
        console.error('Error fetching event details:', error);
        this.errorMessage = 'Failed to load event details.';
      });
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];  // Format date as YYYY-MM-DD
    }
  }
};
</script>

<style scoped>
/* Add your styles here */
</style>
