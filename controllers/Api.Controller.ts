import { Request, Response, NextFunction } from 'express';
import { newRequest, newRequestSecond } from '../utils/newRequest.ts';
import { CalendarEvent } from '../models/Calendar.ts';
import { validateFields } from '../utils/FieldsValidator.ts';
import { Country, PublicHoliday } from '../@types/common.ts';

export const getAllCountries = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const response = await newRequest.get('/api/v3/AvailableCountries');
    res.status(200).json({ success: true, message: response.data });
  } catch (error) {
    next(error);
  }
};

export const getCountryInfo = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params;
    const countryIsoRes = await newRequestSecond.get(`countries/iso`);
    const countryData: Country | undefined = countryIsoRes.data.data.find(
      (c: Country) => c.Iso2.toUpperCase() === id.toUpperCase(),
    );
    if (!countryData) {
      throw new Error('Invalid country ISO2 code');
    }

    const countryName = countryData.name;

    const [populationRes, flagRes, countryInfoRes] = await Promise.all([
      newRequestSecond.post(`/countries/population`, { country: countryName }),
      newRequestSecond.post(`countries/flag/images`, { iso2: id }),
      newRequest.get(`/api/v3/CountryInfo/${id}`),
    ]);

    const responseData = {
      country: countryName,
      isoCode: id,
      population: populationRes.data?.data || [],
      flag: flagRes.data?.data?.flag || '',
      countryInfo: countryInfoRes.data || {},
    };

    res.status(200).json({ success: true, data: responseData });
  } catch (error) {
    next(error);
  }
};
export const addHolidaysToCalendar = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { userId } = req.params;
    const { countryCode, year, holidays } = req.body;
    validateFields(['countryCode', 'year', 'holidays'])(req);

    const holidayResponse = await newRequest.get(
      `/api/v3/PublicHolidays/${year}/${countryCode}`,
    );
    let publicHolidays = holidayResponse.data;
    if (Array.isArray(holidays) && holidays.length > 0) {
      publicHolidays = publicHolidays.filter((holiday: PublicHoliday) =>
        holidays.includes(holiday.name),
      );
    } else {
      throw new Error('No holidays found for the given year and country');
    }

    const savedHolidays = await Promise.all(
      publicHolidays.map((holiday: PublicHoliday) =>
        CalendarEvent.create({
          userId,
          title: holiday.localName,
          date: holiday.date,
          countryCode,
        }),
      ),
    );

    res.status(201).json({
      success: true,
      message: 'Holidays added successfully',
      data: savedHolidays,
    });
  } catch (error) {
    next(error);
  }
};
