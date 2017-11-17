process.env.NODE_ENV = 'test';
const HttpMock = require('node-mocks-http');
const Boom = require('boom');
const DrugsController = require('../controllers/DrugsController');

describe('DrugsController', () => {
  const drugsController = new DrugsController({
    getAll: jest.fn(),
    getOne: jest.fn(),
    create: jest.fn()
  });

  describe('create', () => {
    it('should respond with HTTP status 201 and the created entity', async () => {
      const input = {
        generic: 'Some generic name',
        brand: 'Some brand name',
        indications: 'Some indications'
      };

      const expected = Object.assign({}, input, { id: 1 });

      const request = HttpMock.createRequest({ body: input });
      const response = HttpMock.createResponse();

      await drugsController.create(request, response, () => {});

      const actual = JSON.parse(response._getData());

      expect(actual).toEqual(expected);
      expect(response._isJSON()).toBe(true);
      expect(response._getStatusCode()).toBe(201);
      expect(response._getHeaders().Location).toBe(`/entities/1`);
    });

    it('should respond with HTTP status 400 when underlying service detects invalid input', async () => {
      const input = {
        brand: 'Some brand name',
        indications: 'Some indications'
      };

      const request = HttpMock.createRequest({ body: input });
      const response = HttpMock.createResponse();

      const next = jest.fn();

      await drugsController.create(request, response, next);

      expect(next).toBeCalledWith(
        Boom.badRequest('Service.ERROR_INVALID_INPUT')
      );
    });
  });
});
