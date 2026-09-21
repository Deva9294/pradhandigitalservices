import { Router } from 'express';
import * as ctrl from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

// All routes require authentication and admin role
router.use(protect);

// Analytics
router.get('/analytics', ctrl.getAnalytics);

// User management
router.get('/users', ctrl.getUsers);
router.get('/users/:id', ctrl.getUser);
router.patch('/users/:id', ctrl.updateUser);
router.delete('/users/:id', ctrl.deleteUser);

// Service management
router.get('/services', ctrl.getServices);
router.post('/services', ctrl.createService);
router.put('/services/:id', ctrl.updateService);
router.delete('/services/:id', ctrl.deleteService);

// Application management
router.get('/applications', ctrl.getApplications);
router.get('/applications/:id', ctrl.getApplication);
router.patch('/applications/:id/status', ctrl.updateApplicationStatus);

// Vacancy management
router.get('/vacancies', ctrl.getVacancies);
router.post('/vacancies', ctrl.createVacancy);
router.put('/vacancies/:id', ctrl.updateVacancy);
router.delete('/vacancies/:id', ctrl.deleteVacancy);

// Form management
router.get('/forms', ctrl.getForms);
router.post('/forms', ctrl.createForm);
router.put('/forms/:id', ctrl.updateForm);
router.delete('/forms/:id', ctrl.deleteForm);

// Payment management
router.get('/payments', ctrl.getPayments);
router.get('/payments/:id', ctrl.getPayment);
router.patch('/payments/:id/refund', ctrl.refundPayment);

// Support management
router.get('/support-tickets', ctrl.getSupportTickets);
router.get('/support-tickets/:id', ctrl.getSupportTicket);
router.patch('/support-tickets/:id/status', ctrl.updateTicketStatus);

// Settings
router.get('/settings', ctrl.getSettings);
router.put('/settings', ctrl.updateSettings);

export default router;