<template>
  <div class="container mt-4">
    <h2 class="text-center mb-4">Event List</h2>

    <!-- Search Bar -->
    <div class="mb-3">
      <input 
        v-model="searchQuery" 
        class="form-control" 
        placeholder="Search by name" 
        @input="fetchEvents" 
      />
    </div>

    <!-- Date Range Filter -->
    <div class="d-flex justify-content-between mb-3">
      <div>
        <label for="startDate">Start Date:</label>
        <input 
          type="date" 
          v-model="startDate" 
          class="form-control" 
          @change="fetchEvents" 
        />
      </div>
      <div>
        <label for="endDate">End Date:</label>
        <input 
          type="date" 
          v-model="endDate" 
          class="form-control" 
          @change="fetchEvents" 
        />
      </div>
    </div>

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

    <!-- Event List Container -->
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
          <router-link 
            :to="{ name: 'event-details-public', params: { id: event.id } }" 
            class="btn btn-primary mt-3"
          >
            View Details
          </router-link>
        </div>
      </div>
    </div>

    <!-- No Events Message -->
    <div v-else class="text-center">
      <p>No events found.</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      events: [],
      searchQuery: '',
      startDate: '',
      endDate: ''
    };
  },
  created() {
    this.fetchEvents();
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
    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },
    scrollLeft() {
      const container = this.$refs.eventList;
      const scrollAmount = container.clientWidth * 0.8; // Scroll 80% of container width
      container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    },
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

/* View Details Button */
.btn-primary {
  width: 100%; /* Full width button */
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
