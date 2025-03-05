import { Router } from 'express';

import {
  addHolidaysToCalendar,
  getAllCountries,
  getCountryInfo,
} from '../controllers/Api.Controller.ts';

const ApiRouter = Router();

ApiRouter.get('/countries', getAllCountries);
ApiRouter.get('/country/:id', getCountryInfo);
ApiRouter.post('/users/:userId/calendar/holidays', addHolidaysToCalendar);
export default ApiRouter;
