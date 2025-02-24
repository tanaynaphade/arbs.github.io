// booking-api.js - Backend API for customer bookings

// Database simulation (in a real app, this would connect to a real database)
let bookings = [
    {
      id: "B12345",
      customerId: "C001",
      customerName: "John Smith",
      customerEmail: "john.smith@example.com",
      customerPhone: "555-123-4567",
      carId: 3,
      carName: "Ford Explorer",
      pickupLocation: "Seattle Airport",
      pickupDate: "2025-03-01T10:00:00",
      returnDate: "2025-03-05T10:00:00",
      totalPrice: 340,
      status: "confirmed",
      createdAt: "2025-02-20T14:32:11"
    },
    {
      id: "B12346",
      customerId: "C001",
      customerName: "John Smith",
      customerEmail: "john.smith@example.com",
      customerPhone: "555-123-4567",
      carId: 1,
      carName: "Toyota Corolla",
      pickupLocation: "Downtown Seattle",
      pickupDate: "2025-01-15T09:00:00",
      returnDate: "2025-01-17T17:00:00",
      totalPrice: 90,
      status: "completed",
      createdAt: "2025-01-10T11:23:45"
    },
    {
      id: "B12347",
      customerId: "C002",
      customerName: "Jane Doe",
      customerEmail: "jane.doe@example.com",
      customerPhone: "555-987-6543",
      carId: 4,
      carName: "Mercedes C-Class",
      pickupLocation: "Portland Airport",
      pickupDate: "2025-02-28T14:00:00",
      returnDate: "2025-03-03T12:00:00",
      totalPrice: 360,
      status: "confirmed",
      createdAt: "2025-02-15T09:12:33"
    }
  ];
  
  // Express server setup
  const express = require('express');
  const cors = require('cors');
  const bodyParser = require('body-parser');
  const app = express();
  
  // Middleware
  app.use(cors());
  app.use(bodyParser.json());
  
  // Authentication middleware (simplified for demo)
  function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized access' });
    }
    
    const token = authHeader.split(' ')[1];
    
    // In a real app, verify the JWT token here
    // For demo, we'll use a simple check
    if (token === 'invalid-token') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    
    // Add user info to request (in real app, this would come from token)
    req.user = { id: 'C001', name: 'John Smith' };
    next();
  }
  
  // Routes
  
  // Get all bookings for the logged-in customer
  app.get('/api/bookings', authenticate, (req, res) => {
    // Filter bookings by customer ID
    const customerBookings = bookings.filter(booking => booking.customerId === req.user.id);
    res.json(customerBookings);
  });
  
  // Get a specific booking by ID
  app.get('/api/bookings/:id', authenticate, (req, res) => {
    const booking = bookings.find(b => b.id === req.params.id && b.customerId === req.user.id);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    res.json(booking);
  });
  
  // Create a new booking
  app.post('/api/bookings', authenticate, (req, res) => {
    const { carId, pickupLocation, pickupDate, returnDate } = req.body;
    
    // Validation
    if (!carId || !pickupLocation || !pickupDate || !returnDate) {
      return res.status(400).json({ error: 'Missing required booking information' });
    }
    
    // Find car details (in real app, fetch from database)
    const car = cars.find(c => c.id === parseInt(carId));
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }
    
    // Calculate dates and price
    const start = new Date(pickupDate);
    const end = new Date(returnDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    const totalPrice = car.price * days;
    
    // Create new booking
    const newBooking = {
      id: `B${Math.floor(10000 + Math.random() * 90000)}`,
      customerId: req.user.id,
      customerName: req.user.name,
      customerEmail: req.body.email || 'john.smith@example.com', // Demo data
      customerPhone: req.body.phone || '555-123-4567', // Demo data
      carId: car.id,
      carName: car.name,
      pickupLocation,
      pickupDate,
      returnDate,
      totalPrice,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    // Save to database (in this case, our array)
    bookings.push(newBooking);
    
    res.status(201).json(newBooking);
  });
  
  // Cancel a booking
  app.post('/api/bookings/:id/cancel', authenticate, (req, res) => {
    const bookingIndex = bookings.findIndex(b => b.id === req.params.id && b.customerId === req.user.id);
    
    if (bookingIndex === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    // Update booking status
    bookings[bookingIndex].status = 'cancelled';
    
    res.json(bookings[bookingIndex]);
  });
  
  // Integration with car data from your existing application
  const cars = [
    {
      id: 1,
      name: "Toyota Corolla",
      type: "Economy",
      image: "corolla.jpeg",
      seats: 5,
      luggage: 2,
      transmission: "Automatic",
      price: 45,
      available: true
    },
    {
      id: 2,
      name: "Honda Civic",
      type: "Compact",
      image: "civic.jpeg",
      seats: 5,
      luggage: 2,
      transmission: "Automatic",
      price: 48,
      available: true
    },
    {
      id: 3,
      name: "Ford Explorer",
      type: "SUV",
      image: "explorer.jpeg",
      seats: 7,
      luggage: 4,
      transmission: "Automatic",
      price: 85,
      available: true
    },
    {
      id: 4,
      name: "Mercedes C-Class",
      type: "Luxury",
      image: "c_class.jpeg",
      seats: 5,
      luggage: 3,
      transmission: "Automatic",
      price: 120,
      available: true
    },
    {
      id: 5,
      name: "Hyundai Elantra",
      type: "Economy",
      image: 'hundai.jpeg',
      seats: 5,
      luggage: 2,
      transmission: "Automatic",
      price: 42,
      available: true
    },
    {
      id: 6,
      name: "BMW 5 Series",
      type: "Luxury",
      image: "5_series.jpeg",
      seats: 5,
      luggage: 3,
      transmission: "Automatic",
      price: 135,
      available: true
    }
  ];
  
  // Check car availability for a specific date range
  app.get('/api/cars/available', (req, res) => {
    const { pickupDate, returnDate } = req.query;
    
    if (!pickupDate || !returnDate) {
      return res.status(400).json({ error: 'Pickup and return dates are required' });
    }
    
    // In a real application, you would check against existing bookings
    // For demo purposes, we'll return all cars as available
    res.json(cars);
  });
  
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });