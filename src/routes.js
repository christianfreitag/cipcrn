const express = require('express');
const EstatistcController = require('./controllers/EstatistcController');
const routes = express.Router();
const InquiresController = require('./controllers/InquiriesController');
const InvolvedController = require('./controllers/InvolvedController');
const jwCheck = require('./controllers/jwCheck');
const MeasurePreventController = require('./controllers/MeasurePreventController');
const sessionController = require('./controllers/sessionController');
const TypeficsController = require('./controllers/TypeficsController');
const UserController = require('./controllers/UserController');
const VerifyCodeController = require('./controllers/VerifyCodeController');

const LoginAuth = require('./middleware/login');

routes.get('/jwcheck-auto',LoginAuth.validation,jwCheck.index);
routes.post('/inquiries',LoginAuth.validation,InquiresController.create);
routes.put('/inquiries/:id',LoginAuth.validation,InquiresController.update);
routes.delete('/inquiries/:id',LoginAuth.validation,InquiresController.delete);
routes.get('/inquiries/',LoginAuth.validation,InquiresController.index);
routes.get('/inquiries/:id',LoginAuth.validation,InquiresController.indexonly);
routes.delete('/inquiries/:id/involved',LoginAuth.validation,InvolvedController.delete);
routes.delete('/inquiries/:id/measure-prevent',LoginAuth.validation,MeasurePreventController.delete);
routes.delete('/inquiries/:id/typefics',LoginAuth.validation,TypeficsController.delete);

routes.post('/generate-cod',LoginAuth.validation,VerifyCodeController.create);
routes.put('/generate-cod/:id',LoginAuth.validation,VerifyCodeController.update);
routes.get('/generate-cod',LoginAuth.validation,VerifyCodeController.index);
routes.post('/estatistic',LoginAuth.validation,EstatistcController.search);
//routes.get('/generate-cod/:id',LoginAuth.validation,VerifyCodeController.index);




routes.post('/user',UserController.create);
routes.get('/user',LoginAuth.validation,UserController.index);
routes.put('/user',LoginAuth.validation,UserController.update);

routes.post('/session',sessionController.create);
module.exports = routes;