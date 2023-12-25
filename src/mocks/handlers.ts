import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post(`http://localhost:3000/register`, () => {
    console.log('captured a post /register request');

    return HttpResponse.json({
      success: 'New user created',
    });
  }),
];
