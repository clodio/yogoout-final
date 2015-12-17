var BASE_URL = require('../TEST_CONFIG').BASE_URL;

var should = require('chai').should();
var expect = require('chai').expect;
var supertest = require('supertest');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var api = supertest(BASE_URL);

describe('REST applications resource', function(){

    it('GET /applications?default=true should return 200 and 5 apps', function(done) {
        api.get('/api/v1/applications?default=true')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res){
            res.body[0].should.have.property('name').and.to.be.equal('Contact');
            res.body[1].should.have.property('name').and.to.be.equal('E-poll-it');
            expect(res.body.length).to.equal(5);
        })
        .expect(200, done);
    });

    it('GET /applications should return an array apps', function(done) {
        api.get('/api/v1/applications')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res){
            expect(res.body).to.be.an('array');
        })
        .expect(200, done);
    });

    it('GET /applications?i2a_secured=true should return only i2a securec applications', function(done) {
        api.get('/api/v1/applications?i2a_secured=true')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res){
            res.body.should.be.an('array');
            res.body.forEach(function (elt) {
                elt.should.have.property('i2a_secured').equal(true);
            })
        })
        .expect(200, done);
    });

});