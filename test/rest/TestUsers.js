var BASE_URL = require('../TEST_CONFIG').BASE_URL;

var config = require('../../config');
var should = require('chai').should();
var expect = require('chai').expect;
var sinon = require('sinon');
var supertest = require('supertest');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

var server = supertest.agent(BASE_URL);

describe('REST users resource', function(){

    var stub_config_get;

    before(function () {
        stub_config_get = sinon.stub(config, 'get');
    });

    it('login', loginUser());

    it('GET /users/RHID007/favorites should return 200 and 6 apps', function(done) {

        server.get('/api/v1/users/RHID007/favorites')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res){
            res.body[0].should.have.property('name').and.to.be.equal('Contact');
            res.body[2].should.have.property('name').and.to.be.equal('Jyraphe');
            expect(res.body.length).to.equal(6);
        })
        .expect(200, done);
    });

    it('GET /users/self/favorites should return 200 and 6 apps', function(done) {

        server.get('/api/v1/users/self/favorites')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res){
            res.body[0].should.have.property('name').and.to.be.equal('Contact');
            res.body[2].should.have.property('name').and.to.be.equal('Jyraphe');
            expect(res.body.length).to.equal(6);
        })
        .expect(200, done);
    });

    it('GET /users/RHID007/applications should return 200 and 5 apps when mode dev activated', function(done) {

        stub_config_get.withArgs('features.mock_webservice').returns(true);

        server.get('/api/v1/users/RHID007/applications')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res){
            res.body[0].should.have.property('name').and.to.be.equal('Portail Entreprise BSCC');
            expect(res.body.length).to.equal(1);
        })
        .expect(200, done);
    });

    it('logout', logoutUser());

    it('GET /users/RHID007/favorites when not logged in should return 401', function(done) {

        server.get('/api/v1/users/RHID007/favorites')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect('access-control-allow-credentials', 'true')
        .expect(function(res){
            res.body.should.have.property('code').and.to.be.equal('202');
        })
        .expect(401, done);
    });

    it('login', loginUser());

    it('GET /users/RHID123/favorites with different RHID than the logged in', function(done) {

        server.get('/api/v1/users/RHID123/favorites')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res){
            res.body.should.have.property('code').and.to.be.equal('203');
        })
        .expect(403, done);
    });

    it('GET /users/RH1234567/favorites with bad RHID format', function(done) {

        server.get('/api/v1/users/RH1234567/favorites')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res){
            res.body.should.have.property('code').and.to.be.equal('201');
        })
        .expect(400, done);
    });

    it('logout', logoutUser());


    it('GET /users/RHID007 should returns 401 when not authenticated', function(done) {

        server.get('/api/v1/users/RHID007')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res){
            res.body.should.have.property('code').and.to.be.equal('202');
        })
        .expect(401, done);
    });


    it('login', loginUser());

    it('GET /users/RHID007 should returns user data', function(done) {

        server.get('/api/v1/users/RHID007')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(function(res){
            res.body.should.have.property('uid').and.to.be.equal('RHID007');
            res.body.should.have.property('first_name').and.to.be.equal('John');
            res.body.should.have.property('last_name').and.to.be.equal('DURAND');
            res.body.should.have.property('email').and.to.be.equal('john.durant@laposte.fr');
            res.body.should.have.property('phone').and.to.be.equal('0123456789');
            res.body.should.have.property('title').and.to.be.equal('Chef de projet');
            res.body.should.have.property('salutation').and.to.be.equal('Mr');
        })
        .expect(200, done);
    });

});

function loginUser() {
    return function(done) {
        server
            .post('/login')
            .expect(302)
            .end(onResponse);

        function onResponse(err, res) {
           if (err) return done(err);
           return done();
        }
    };
};function logoutUser() {
    return function(done) {
        server
            .post('/logout')
            .expect(200)
            .end(onResponse);

        function onResponse(err, res) {
           if (err) return done(err);
           return done();
        }
    };
};