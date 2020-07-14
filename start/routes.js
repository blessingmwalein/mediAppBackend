'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')
Route.on('/').render('welcome')
Route.group(()=>{
   Route.post('login', 'UserController.login')
   Route.post('register', 'UserController.register')
   Route.get('show/:id', 'UserController.show')
   Route.get('/', 'UserController.index')
   Route.get('/doctor/:id', 'UserController.getByUser')
   Route.get('/patient/:id', 'UserController.getByUserPatient')
}).prefix('medico')

Route.group(()=>{
   Route.post('save', 'DistrictController.store')
   Route.get('show/:id', 'DistrictController.show')
   Route.get('/', 'DistrictController.index')
}).prefix('district')

Route.group(() => { 
   Route.post('save', 'HospitalController.store')
   Route.get('show/:id','HospitalController.show')
 }).prefix('hospital')

 Route.group(()=>{
    Route.post('save', 'DoctorController.store')
    Route.get('/:id', 'DoctorController.index')
    Route.get('show/:id', 'DoctorController.show')
    Route.put('edit/:id', 'DoctorController.update')
    Route.post('delete/:id', 'DoctorController.delete')
    Route.post('login', 'DoctorController.login')
    Route.get('/user/:id', 'DoctorController.getByUser')
 }).prefix('doctors')
 Route.group(()=>{
   Route.post('save', 'PatientController.store')
   Route.get('/:id', 'PatientController.index')
   Route.get('show/:id', 'PatientController.show')
   Route.put('edit/:id', 'PatientController.update')
   Route.post('delete/:id', 'PatientController.delete')
   Route.get('/appointments/:id', 'PatientController.appointments');
}).prefix('patients')

Route.group(() => { 
   Route.post('save', 'BotchatmessageController.store') 
   Route.get('show/:id','BotchatmessageController.show' )
   Route.get('polarity','BotchatmessageController.polarity' )
}).prefix('bot')

Route.group(()=>{
   Route.post('save/:id', 'AppointmentController.store')
   Route.get('/:id', 'AppointmentController.index')
   Route.delete('delete/:id', 'AppointmentController.delete')
   Route.post('/switch', 'AppointmentController.switchApp')

}).prefix('appointment')

Route.group(() => { 
   Route.get('/', 'RoleController.index') 
   Route.post('/save','RoleController.store' )
}).prefix('roles')
Route.get('moment', 'AppointmentController.moment')

Route.get('app', 'AppointmentController.show')