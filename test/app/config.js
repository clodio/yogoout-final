'use strict';

var sinon = require('sinon');

var config = require('../../config.js');
var mock;

describe('Config manager', function () {
    beforeEach(function () {
        mock = sinon.mock(config);
    });

    after(function (done) {
        mock.restore();
        done();
    });

    it('should call the method loadFile from convict once', function (done) {
        // given
        var expectation = mock.expects('loadFile');

        // when
        config.refresh();

        // then
        expectation.once();
        mock.verify();
        done();
    });
});