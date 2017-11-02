'use strict';

process.env.NODE_ENV = 'test';

const { suite, test } = require('mocha');
const request = require('supertest');
// const knex = require('../knex');
const server = require('../server');
const { addDatabaseHooks } = require('./utils');
suite(
  'drugs routes',
  addDatabaseHooks(() => {
    //
    // GET
    //

    test('GET /doctors/:doctorId/drugs', done => {
      request(server)
        .get('/doctors/1/drugs')
        .set('Accept', 'application/json')
        //.expect('Content-Type', /json/)
        .expect(200, [
          {
            id: 1,
            doctorId: 1,
            generic: 'Atorvastatin',
            brand: 'Liptor',
            indications: 'lower cholesterol',
            createdAt: '2016-06-26T14:26:16.000Z',
            updatedAt: '2016-06-26T14:26:16.000Z'
          },
          {
            id: 2,
            doctorId: 1,
            generic: 'Levothyroxine',
            brand: 'Synthroid',
            indications: 'treat hypothyroidism',
            createdAt: '2016-06-26T14:26:16.000Z',
            updatedAt: '2016-06-26T14:26:16.000Z'
          },
          {
            id: 3,
            doctorId: 1,
            generic: 'Glucophage',
            brand: 'Glucophage',
            indications: 'treat type 2 diabetes',
            createdAt: '2016-06-26T14:26:16.000Z',
            updatedAt: '2016-06-26T14:26:16.000Z'
          },
          {
            id: 4,
            doctorId: 1,
            generic: 'omeprazole',
            brand: 'Prilosec',
            indications: 'treat gastroesophageal reflux disease',
            createdAt: '2016-06-26T14:26:16.000Z',
            updatedAt: '2016-06-26T14:26:16.000Z'
          },
          {
            id: 5,
            doctorId: 1,
            generic: 'azithromycin',
            brand: 'Zithromax',
            indications: 'treat infections caused by bacteria',
            createdAt: '2016-06-26T14:26:16.000Z',
            updatedAt: '2016-06-26T14:26:16.000Z'
          }
        ])
        .expect('Content-Type', /json/);
      done();
    });

    //
    // GET :id
    //

    test('GET /doctors/:doctorId/drugs/:id', done => {
      request(server)
        .get('/doctors/1/drugs/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          id: 1,
          doctorId: 1,
          generic: 'Atorvastatin',
          brand: 'Liptor',
          indications: 'lower cholesterol',
          createdAt: '2016-06-26T14:26:16.000Z',
          updatedAt: '2016-06-26T14:26:16.000Z'
        })
        .expect('Content-Type', /json/);
      done();
    });

    test('GET /drugs/9000', done => {
      request(server)
        .get('/drugs/9000')
        .set('Accept', 'application/json')
        .expect('Content-Type', /plain/)
        .expect(404, 'Not Found', done);
    });

    test('GET /drugs/-1', done => {
      request(server)
        .get('/drugs/-1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /plain/)
        .expect(404, 'Not Found', done);
    });

    test('GET /drugs/one', done => {
      request(server)
        .get('/drugs/one')
        .set('Accept', 'application/json')
        .expect('Content-Type', /plain/)
        .expect(404, 'Not Found', done);
    });

    //
    // POST
    //

    test('POST /doctors/:doctorId/drugs', done => {
      request(server)
        .post('/doctors/1/drugs')
        .set('Accept', 'application/json')
        .send({
          generic: 'azithromycin',
          brand: 'Zithromax',
          indications: 'treat infections caused by bacteria'
        })
        .expect('Content-Type', /json/)
        .expect(res => {
          delete res.body.createdAt;
          delete res.body.updatedAt;
        })
        .expect(200, {
          id: 9,
          doctorId: 1,
          generic: 'azithromycin',
          brand: 'Zithromax',
          indications: 'treat infections caused by bacteria'
        })
        .expect('Content-Type', /json/);
      done();
    });

    test('POST /doctors/:doctorId/drugs without generic', done => {
      request(server)
        .post('/doctors/1/drugs')
        .set('Accept', 'application/json')
        .send({
          doctorId: 1,
          brand: 'Zithromax',
          indications: 'treat infections caused by bacteria'
        })
        .expect('Content-Type', /plain/)
        .expect(400, 'Generic must not be blank', done);
    });

    test('POST /doctors/:doctorId/drugs without brand', done => {
      request(server)
        .post('/doctors/1/drugs')
        .set('Accept', 'application/json')
        .send({
          doctorId: 1,
          generic: 'omeprazole',
          indications: 'treat gastroesophageal reflux disease'
        })
        .expect('Content-Type', /plain/)
        .expect(400, 'Brand must not be blank', done);
    });

    test('POST /doctors/:doctorId/drugs without indications', done => {
      request(server)
        .post('/doctors/1/drugs')
        .set('Accept', 'application/json')
        .send({
          doctorId: 1,
          generic: 'omeprazole',
          brand: 'Prilosec'
        })
        .expect('Content-Type', /plain/)
        .expect(400, 'Indications must not be blank', done);
    });

    //PATCH

    test('PATCH /drugs/:id', done => {
      request(server)
        .patch('/drugs/1')
        .set('Accept', 'application/json')
        .send({
          generic: 'acetaminophen and hydrocodone',
          brand: 'Vicodin',
          indications: 'pain'
        })
        .expect('Content-Type', /json/)
        .expect(res => {
          delete res.body.createdAt;
          delete res.body.updatedAt;
        })
        .expect(200, {
          id: 1,
          generic: 'acetaminophen and hydrocodone',
          brand: 'Vicodin',
          indications: 'pain'
        })
        .expect('Content-Type', /json/);
      done();
    });

    test('PATCH /drugs/9000', done => {
      request(server)
        .patch('/drugs/9000')
        .set('Accept', 'application/json')
        .expect('Content-Type', /plain/)
        .expect(404, 'Not Found', done);
    });

    test('PATCH /drugs/-1', done => {
      request(server)
        .patch('/drugs/-1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /plain/)
        .expect(404, 'Not Found', done);
    });

    test('PATCH /drugs/one', done => {
      request(server)
        .patch('/drugs/one')
        .set('Accept', 'application/json')
        .expect('Content-Type', /plain/)
        .expect(404, 'Not Found', done);
    });

    //
    // DELETE
    //

    test('DELETE /drugs/:id', done => {
      request(server)
        .del('/drugs/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(res => {
          delete res.body.createdAt;
          delete res.body.updatedAt;
        })
        .expect(200, {
          generic: 'Atorvastatin',
          brand: 'Liptor',
          indications: 'lower cholesterol'
        })
        .expect('Content-Type', /json/);
      done();
    });

    test('DELETE /drugs/9000', done => {
      request(server)
        .del('/drugs/9000')
        .set('Accept', 'application/json')
        .expect('Content-Type', /plain/)
        .expect(404, 'Not Found', done);
    });

    test('DELETE /drugs/-1', done => {
      request(server)
        .del('/drugs/-1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /plain/)
        .expect(404, 'Not Found', done);
    });

    test('DELETE /drugs/one', done => {
      request(server)
        .del('/drugs/one')
        .set('Accept', 'application/json')
        .expect('Content-Type', /plain/)
        .expect(404, 'Not Found', done);
    });
  })
);
