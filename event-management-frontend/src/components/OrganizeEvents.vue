<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">Organize Your Events</h2>

    <!-- Create Event Section -->
    <div class="section">
      <create-event @event-created="refreshEvents" />
    </div>

    <hr class="divider" />

    <!-- Search Bar Section -->
    <div class="section">
      <label for="searchQuery"><strong>Search Events:</strong></label>
      <input 
        v-model="searchQuery" 
        placeholder="Search by name" 
        @input="fetchMyEvents" 
        class="form-control"
      />
    </div>

    <hr class="divider" />

    <!-- Date Range Filter Section -->
    <div class="section">
      <strong>Filter by Date:</strong>
      <div class="date-filters">
        <div class="filter-item">
          <label for="startDate">Start Date:</label>
          <input 
            type="date" 
            v-model="startDate" 
            @change="fetchMyEvents" 
            class="form-control"
          />
        </div>

        <div class="filter-item">
          <label for="endDate">End Date:</label>
          <input 
            type="date" 
            v-model="endDate" 
            @change="fetchMyEvents" 
            class="form-control"
          />
        </div>
      </div>
      <button class="clear-btn" @click="clearFilters">Clear Filters</button>
    </div>

    <hr class="divider" />

    <!-- Navigation Buttons -->
    <div class="navigation-buttons mb-3">
      <button 
        class="nav-button left-button" 
        @click="scrollLeft" 
        aria-label="Scroll Left"
      >
        <!-- Left Arrow SVG Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
      <button 
        class="nav-button right-button" 
        @click="scrollRight" 
        aria-label="Scroll Right"
      >
        <!-- Right Arrow SVG Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" class="nav-icon" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>

    <!-- Event List Section -->
    <div class="section">
      <div 
        v-if="events.length" 
        class="event-list-container" 
        ref="eventList"
      >
        <div 
          v-for="event in events" 
          :key="event.id" 
          class="card event-card"
        >
          <img 
            :src="event.image ? `http://localhost:3000${event.image}` : 'http://localhost:3000/uploads/default-image.jpg'" 
            alt="Event Image" 
            class="card-img-top"
            loading="lazy"
          />
          <div class="card-body">
            <h5 class="card-title">{{ event.name }}</h5>
            <p class="card-text"><strong>Date:</strong> {{ formatDate(event.date) }}</p>
            <div class="event-actions">
              <router-link 
                :to="{ name: 'event-details', params: { id: event.id } }" 
                class="btn btn-view"
              >
                View Details
              </router-link>
              <button class="btn btn-edit" @click="editEvent(event.id)">
                Edit
              </button>
              <button class="btn btn-delete" @click="deleteEvent(event.id)">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="text-center">You haven't organized any events yet.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import CreateEvent from './CreateEvent.vue';

export default {
  components: {
    CreateEvent  // Import the CreateEvent component
  },
  data() {
    return {
      events: [],  // Holds the list of events created by the organizer
      searchQuery: '',  // For search functionality
      startDate: '',
      endDate: ''
    };
  },
  created() {
    this.fetchMyEvents();  // Fetch events created by the organizer on component creation
  },
  methods: {
    // Fetch events created by the logged-in organizer
    fetchMyEvents() {
      const params = {
        name: this.searchQuery,
        startDate: this.startDate,
        endDate: this.endDate
      };
      console.log('Fetching events with params:', params);  // Debug log

      axios.get('http://localhost:3000/api/events/myevents', {
        params,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`  // Include JWT token
        }
      })
      .then(response => {
        this.events = response.data;  // Store events data
      })
      .catch(error => {
        console.error('Error fetching events:', error);
      });
    },

    // Edit an event (redirect to edit page)
    editEvent(eventId) {
      this.$router.push({ name: 'edit-event', params: { id: eventId } });
    },

    // Clear search and date filters
    clearFilters() {
      this.searchQuery = '';
      this.startDate = '';
      this.endDate = '';
      this.fetchMyEvents();
    },

    // Delete an event
    deleteEvent(eventId) {
      if (confirm('Are you sure you want to delete this event?')) {
        axios.delete(`http://localhost:3000/api/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`  // Include JWT token
          }
        })
        .then(() => {
          alert('Event deleted successfully!');
          this.fetchMyEvents();  // Refresh the events list after deletion
        })
        .catch(error => {
          console.error('Error deleting event:', error);
        });
      }
    },

    // Format date for display
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);  // e.g., January 1, 2024
    },

    // Refresh events after event creation or deletion
    refreshEvents() {
      this.fetchMyEvents();  // Re-fetch the events list
    },

    // Scroll the event list to the left
    scrollLeft() {
      const container = this.$refs.eventList;
      const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    },

    // Scroll the event list to the right
    scrollRight() {
      const container = this.$refs.eventList;
      const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
      container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  }
};
</script>

<style scoped>
/* Global Box Sizing */
* {
  box-sizing: border-box;
}

/* Section Styling */
.section {
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
}

/* Divider Styling */
.divider {
  border: none;
  border-top: 2px solid #ddd;
  margin: 20px 0;
}

/* Date Filters */
.date-filters {
  display: flex;
  gap: 20px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  flex-direction: column;
}

/* Search and Filter Inputs */
.form-control {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Clear Filters Button */
.clear-btn {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.clear-btn:hover {
  background-color: #e0e0e0;
}

/* Navigation Buttons Container */
.navigation-buttons {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  margin-bottom: 15px;
}

/* Navigation Buttons */
.nav-button {
  width: 45px;
  height: 45px;
  margin-left: 12px;
  border: none;
  background-color: #6c63ff; /* Primary color */
  color: #fff;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.nav-button:hover {
  background-color: #574b90; /* Darker shade on hover */
  transform: translateY(-3px);
}

.nav-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(108, 99, 255, 0.5);
}

.nav-icon {
  width: 20px;
  height: 20px;
}

/* Disabled Navigation Buttons */
.nav-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.nav-button:disabled .nav-icon {
  fill: #666666;
}

/* Event List Container */
.event-list-container {
  display: flex;
  overflow-x: auto;
  gap: 20px; /* Spacing between cards */
  padding: 10px;
  scroll-behavior: smooth; /* Smooth scrolling */
  position: relative;
}

.event-list-container::-webkit-scrollbar {
  height: 8px; /* Custom scrollbar height */
}

.event-list-container::-webkit-scrollbar-thumb {
  background-color: #888; /* Scrollbar color */
  border-radius: 4px;
}

.event-list-container::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

/* Event Card */
.event-card {
  flex: 0 0 auto; /* Prevent cards from shrinking */
  width: 300px; /* Fixed width */
  background-color: #fff; /* Background color for better contrast */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden; /* Ensure content doesn't overflow */
  display: flex;
  flex-direction: column;
  transition: transform 0.2s ease;
}

.event-card:hover {
  transform: translateY(-5px); /* Slight lift on hover */
}

/* Card Image */
.card-img-top {
  width: 100%; /* Full width */
  height: 180px; /* Fixed height */
  object-fit: cover; /* Maintain aspect ratio and cover the area */
}

/* Card Body */
.card-body {
  padding: 15px;
  flex-grow: 1; /* Ensure the body takes up remaining space */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Card Title */
.card-title {
  font-size: 1.25rem;
  margin-bottom: 10px;
  color: #333;
}

/* Card Text */
.card-text {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 15px;
}

/* Event Actions */
.event-actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

/* Buttons within Event Actions */
.btn-view,
.btn-edit,
.btn-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.95rem; /* Slightly larger font for readability */
  padding: 8px 14px; /* Consistent padding */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  color: #fff;
}

.btn-view {
  background-color: #17a2b8; /* Teal */
}

.btn-view:hover {
  background-color: #117a8b;
  transform: translateY(-2px);
}

.btn-edit {
  background-color: #28a745; /* Green */
}

.btn-edit:hover {
  background-color: #218838;
  transform: translateY(-2px);
}

.btn-delete {
  background-color: #dc3545; /* Red */
}

.btn-delete:hover {
  background-color: #c82333;
  transform: translateY(-2px);
}

/* Icon Spacing (if icons are added in the future) */
.btn-view i,
.btn-edit i,
.btn-delete i {
  margin-right: 5px;
}

/* Responsive Adjustments */
@media (max-width: 992px) {
  .event-card {
    width: 250px; /* Reduce card width on medium screens */
  }

  .card-img-top {
    height: 160px; /* Adjust image height */
  }
}

@media (max-width: 768px) {
  .date-filters {
    flex-direction: column;
    gap: 10px;
  }

  .navigation-buttons {
    justify-content: center;
  }

  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 1rem;
  }

  .event-card {
    width: 220px; /* Further reduce card width on small screens */
  }

  .card-img-top {
    height: 140px; /* Adjust image height */
  }
}

@media (max-width: 480px) {
  .nav-button {
    width: 35px;
    height: 35px;
    font-size: 0.9rem;
  }

  .event-card {
    width: 200px; /* Minimal card width on very small screens */
  }

  .card-img-top {
    height: 120px; /* Adjust image height */
  }
}
</style>
