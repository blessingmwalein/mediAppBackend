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
    Route.get('/', 'DoctorController.index')
    Route.get('show/:id', 'DoctorController.show')
    Route.put('edit/:id', 'DoctorController.update')
    Route.delete('delete/:id', 'DoctorController.delete')
 }).prefix('doctors')

 Route.group(()=>{
   Route.post('save', 'PatientController.store')
   Route.get('/', 'PatientController.index')
   Route.get('show/:id', 'PatientController.show')
   Route.put('edit/:id', 'PatientController.update')
   Route.delete('delete/:id', 'PatientController.delete')
}).prefix('patients')


Route.group(() => { 
   Route.post('save', 'BotchatmessageController.store') 
   Route.get('show/:id','BotchatmessageController.show' )
   Route.get('polarity','BotchatmessageController.polarity' )
}).prefix('bot')

Route.group(()=>{
   Route.post('save', 'AppointmentController.store')
   Route.get('/', 'AppointmentController.index')
   Route.delete('delete/:id', 'AppointmentController.delete')
}).prefix('appointment')