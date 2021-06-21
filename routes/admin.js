var express = require('express');
var router = express.Router();
var adminHandler = require('../controllers/admin_controller');


/* GET home page. */
router.get('/', adminHandler.getDashboard);

router.get('/add_event', adminHandler.addEventForm);

router.post('/add_event', adminHandler.addEvent);

router.get('/events', adminHandler.getEventsView);

router.get('/edit_event=:id', adminHandler.editEvent);

router.post('/edit_event=:id', adminHandler.updateEvent);

router.get('/delete_event=:id', adminHandler.deleteEvent);

router.get('/add_category', adminHandler.addCategoryForm);

router.post('/add_category', adminHandler.addCategory);

router.get('/categories', adminHandler.getCategoriesView);

router.get('/edit_category=:id', adminHandler.editCategory);

router.post('/edit_category=:id', adminHandler.updateCategory);

router.get('/delete_category=:id', adminHandler.deleteCategory);

router.get('/customers', adminHandler.getCustomers);

router.get('/edit_customer=:id', adminHandler.editCustomer);

router.post('/edit_customer=:id', adminHandler.updateCustomer);

router.get('/delete_customer=:id', adminHandler.deleteCustomer);

router.get('/orders', adminHandler.getOrders);

router.get('/delete_order=:id', adminHandler.deleteOrder);

router.get('/orders', adminHandler.getOrders);

router.get('/delete_order=:id', adminHandler.deleteOrder);

router.get('/payments', adminHandler.getPayments);

router.get('/delete_payment=:id', adminHandler.deletePayment);

router.get('/add_user', adminHandler.addUserForm);

router.post('/add_user', adminHandler.addUser);

router.get('/users', adminHandler.getAdmins);

router.get('/edit_user=:id', adminHandler.editUser);

router.post('/edit_user=:id', adminHandler.updateUser);

router.get('/delete_user=:id', adminHandler.deleteUser);

router.get('/add_slider', adminHandler.addSliderForm);

router.post('/add_slider', adminHandler.addSlider);

router.get('/sliders', adminHandler.getSliders);

router.get('/edit_slider=:id', adminHandler.editSlider);

router.post('/edit_slider=:id', adminHandler.updateSlider);

router.get('/delete_slider=:id', adminHandler.deleteSlider);



module.exports = router;