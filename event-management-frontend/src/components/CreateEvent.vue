<template>
  <div>
    <h2>Create a New Event</h2>
    <form @submit.prevent="createEvent">
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
        <input type="date" v-model="event.date" id="date" required />
      </div>

      <div>
        <label for="image">Thumbnail Image:</label>
        <input type="file" @change="handleFileUpload" id="image" />
      </div>
      <button type="submit">Create Event</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      event: {
        name: '',
        description: '',
        date: ''
      },
      image: null  // Add a property to store the selected image


    };
  },
  methods: {
    handleFileUpload(event) {
      this.image = event.target.files[0];  // Store the selected file
    },
    createEvent() {
      const formData = new FormData();
      formData.append('name', this.event.name);
      formData.append('description', this.event.description);
      formData.append('date', this.event.date);
      if (this.image) {
        formData.append('image', this.image);  // Append the image file
      }

 // const token = localStorage.getItem('token'); // Get the token from localStorage

  axios.post('http://localhost:3000/api/events', formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in Authorization header
        'Content-Type': 'multipart/form-data' 
      }
    })
    .then(response => {
      console.log('Event created:', response.data);
      this.$emit('event-created', response.data); // Emit an event to notify the parent component
      this.resetForm(); // Clear the form after event creation
    })
    .catch(error => {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please make sure you are logged in.');
    });
},
    resetForm() {
      this.event = { name: '', description: '', date: '' }; // Reset form data
      this.image = null;
    }
  }
};
</script>