import { createApp } from 'vue';
import App from './App.vue';
import { createRouter, createWebHistory } from 'vue-router';
import EventListPublic from './components/EventListPublic.vue'; // Import the public event list component
import EventList from './components/EventList.vue';
import EditEvent from './components/EditEvent.vue';
import Login from './components/Login.vue';   // Login component
import Register from './components/Register.vue'; // Register component
import EventDetails from './components/EventDetails.vue';  // Import EventDetails component
import UserDashboard from './components/UserDashboard.vue'; // User Dashboard component
import OrganizeEvents from './components/OrganizeEvents.vue'; // Organizer page component
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';
import EventDetailsPublic from './components/EventDetailsPublic.vue';
// Define the routes
const routes = [
  { path: '/', component: EventListPublic , name: 'home', 
  props: route => ({ filters: route.query })}, // Public event list page
  { path: '/login', component: Login, name: 'login', meta: { hideNavbar: true } },  // Login route
  { path: '/register', component: Register, name: 'register', meta: { hideNavbar: true } }, // Register route
  { path: '/dashboard', component: UserDashboard, meta: { requiresAuth: true } },  // User dashboard, protected
  { path: '/events', component: EventList, name: 'events', meta: { requiresAuth: true }, props: route => ({ filters: route.query })  },  // EventList route, protected
  { path: '/organize', component: OrganizeEvents, meta: { requiresAuth: true, role: 'organizer' } }, // Organizer page, role-based access
  { path: '/events/:id/edit', component: EditEvent, name: 'edit-event', props: true, meta: { requiresAuth: true } }, // Edit event
  { path: '/events/:id', component: EventDetails, name: 'event-details', props: true, meta: { requiresAuth: true } },
  { path: '/events/:id', component: EventDetailsPublic, name: 'event-details-public', props: true }
];

// Create the router
const router = createRouter({
  history: createWebHistory(),
  routes
});

const app = createApp(App);

// Use the Toastification plugin
app.use(Toast, {
    timeout: 3000, // Set timeout for 3 seconds
    position: 'top-right' // Set the position of the toast
});

// Add a navigation guard to protect routes and enforce role-based access
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role'); // Get role from localStorage
  
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!token) {
        next({ name: 'login' });
      } else if (to.matched.some(record => record.meta.role === 'organizer' && role !== 'organizer' && role !== 'admin')) {
        next(false);  // Deny access if user is not an organizer or admin
      } else {
        next();
      }
    } else {
      next();
    }
  });
  

// Mount the app
app.use(router);
app.mount('#app');
