<template>
  <div v-if="event">
    <h2>Edit Event: {{ event.name }}</h2>
    <form @submit.prevent="updateEvent">
      <div>
        <label for="name">Event Name:</label>
        <input type="text" v-model="event.name" id="name" required />
      </div>

      <div>
        <label for="description">Description:</label>
        <textarea v-model="event.description" id="description"></textarea>
      </div>

      <div>
        <label for="date">Date:</label>
        <!-- Format the date correctly for the date input field -->
        <input type="date" v-model="formattedDate" id="date" required />
      </div>

      <button type="submit">Update Event</button>
    </form>
  </div>
  <div v-else>
    <p v-if="errorMessage">{{ errorMessage }}</p>
    <p>Loading event data...</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['id'],
  data() {
    return {
      event: null,
      formattedDate: '', // Store the correctly formatted date for the input field
      errorMessage: ''
    };
  },
  created() {
    console.log('Event ID:', this.id);
    this.fetchEvent(); // Fetch event data when the component is created
  },
  methods: {


    // Fetch the event data from the server
    fetchEvent() {
        console.log('Fetching event with ID:', this.id);

      axios.get(`http://localhost:3000/api/events/${this.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Ensure the token is sent
        }
      })
      .then(response => {
        this.event = response.data;
        this.formattedDate = this.formatDate(this.event.date); // Format the date correctly for the input field
      })
      .catch(error => {
        console.error('Error fetching event data:', error);
        this.errorMessage = 'Failed to load event data.';
      });
    },

    // Format the date to "yyyy-MM-dd" format for the date input field
    formatDate(isoString) {
      const date = new Date(isoString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero
      const day = date.getDate().toString().padStart(2, '0'); // Add leading zero
      return `${year}-${month}-${day}`; // Return the formatted date
    },

    // Update the event with the new data
    updateEvent() {
      // Set the event's date to the correctly formatted date from the input field
      this.event.date = this.formattedDate;

      axios.put(`http://localhost:3000/api/events/${this.id}`, this.event, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}` // Ensure the token is sent
        }
      })
      .then(() => {
        alert('Event updated successfully!');
        this.$router.push('/organize'); // Redirect to the event list after a successful update
      })
      .catch(error => {
        console.error('Error updating event:', error);
        this.errorMessage = 'Failed to update the event.';
      });
    }
  }
};
</script>

<style scoped>
/* Your styles here */
</style>
