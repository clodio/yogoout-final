describe('should retrieve configuration file properties', function() {

    var urlTest;
    before(function() {
        urlTest = 'http://www.google.com';
    });

    it("bandeau module should exits in the global scope with a get and post methods", function() {
        assert.equal(typeof bandeauModule, 'object', 'bandeauModule must be an object');
        assert.equal(typeof bandeauModule.get, 'function', 'bandeauModule must have a get function');
        assert.equal(typeof bandeauModule.post, 'function', 'bandeauModule must have a post function');
    });

    it("get method should work", function() {
        bandeauModule.get(urlTest, function (xmlhttp) {
            assert.equal(xmlhttp.status, 200);
            assert.equal(xmlhttp.responseURL, urlTest);
        });
    });

    it("post method should work", function() {
        var data = { title: 'fake_title' };
        bandeauModule.post(urlTest, data, function (xmlhttp) {
            assert.equal(xmlhttp.status, 200);
            assert.equal(xmlhttp.responseURL, urlTest);
        });
    });

    it("bandeau module should have a loadCSS method that works", function() {
        //given
        assert.equal(typeof bandeauModule.loadCSS, 'function');
        //when
        bandeauModule.loadCSS();
        //then
        var link = document.getElementById('bandeau-css-id');
        assert.equal(link.getAttribute('rel'), 'stylesheet');
        assert.equal(link.getAttribute('type'), 'text/css');
    });

});