<template>
  <div>
    <h2>Event List</h2>

    <!-- Search Bar -->
    <input v-model="searchQuery" placeholder="Search by name" @input="fetchEvents" />

    <!-- Date Range Filter -->
    <div>
      <label for="startDate">Start Date:</label>
      <input type="date" v-model="startDate" @change="fetchEvents" />

      <label for="endDate">End Date:</label>
      <input type="date" v-model="endDate" @change="fetchEvents" />
    </div>

    <!-- Clear Filters Button -->
    <button @click="clearFilters">Clear Filters</button>

    <!-- Create Event Component -->
    <CreateEvent @event-created="refreshEvents" />

    <!-- Event List -->
    <ul>
      <li v-for="event in events" :key="event.id">
        <router-link :to="{ name: 'event-details', params: { id: event.id } }">
          {{ event.name }} - {{ formatDate(event.date) }}
        </router-link>
        <button @click="editEvent(event.id)">Edit</button>
        <button @click="deleteEvent(event.id)">Delete</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';
import CreateEvent from './CreateEvent.vue';

export default {
  components: {
    CreateEvent
  },
  data() {
    return {
      events: [],
      searchQuery: '',
      startDate: '',
      endDate: ''
    };
  },
  created() {
    this.refreshEvents();
  },
  methods: {
    fetchEvents() {
      const params = {
        name: this.searchQuery,
        startDate: this.startDate,
        endDate: this.endDate
      };
      axios.get('http://localhost:3000/api/events', {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        this.events = response.data;
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
    },
    clearFilters() {
      this.searchQuery = '';
      this.startDate = '';
      this.endDate = '';
      this.fetchEvents();
    },
    refreshEvents() {
      axios.get('http://localhost:3000/api/events', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(response => {
        this.events = response.data;
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
    },
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    },
    editEvent(eventId) {
      this.$router.push({ name: 'edit-event', params: { id: eventId } });
    },
    deleteEvent(eventId) {
      if (confirm('Are you sure you want to delete this event?')) {
        axios.delete(`http://localhost:3000/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })
        .then(() => {
          this.refreshEvents();
        })
        .catch(error => {
          console.error('Error deleting event:', error);
        });
      }
    }
  }
};
</script>
