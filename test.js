"use strict";
var chai = require("chai");
var expect = chai.expect;
var model = require('./model');
var business = require('./business');
var request = require('request');
var dataFeeds = require('./dataFeeds');
var sId = '';
var iDocCount = 0;

function asyncAssertionCheck(done, f) {
	try {
		f();
		done();
	} catch(e) {
		done(e);
	}
}

describe('tbs exercise tests', function () {
	this.timeout(0);
	before(function (done) {
		model.initDb(
				function (err) {
					if (err) {
						console.log(JSON.stringify(err));
						done(err);
					}
					else {
						console.log('initDb SUCCESS');
						done();
					}
				}
		);
	});//before

	describe('Test joinFeeds (business)',
		function () {
			it('should return an array of shows joined with related games', function (done) {
				business.joinFeeds(dataFeeds.shows, dataFeeds.games,
					function (err, result) {
						asyncAssertionCheck(done, function () {
							expect(err).to.not.exist;
							expect(result).to.exist;
							expect(result).to.be.an.array;
							expect(result.length).to.be.greaterThan(0);
							expect(result[0]).to.haveOwnProperty('game');
						});
					}
				);
			});
		}
	);


	describe('Test Data Access (business)',
		function () {
			var doc = {"title": "Hallelujah", "artist": "Jeff Buckley", "released": "1994"};
			it('should insert a song document', function (done) {
				business.insertSong(doc,
						function (err, result) {
							asyncAssertionCheck(done, function () {
								expect(err).to.not.exist;
								expect(result).to.exist;
							});
						}
				);
			});
			it('should return a list of all songs', function (done) {
				business.listSongs(
					function (err, result) {
						asyncAssertionCheck(done, function () {
							expect(err).to.not.exist;
							expect(result).to.exist;
							expect(result).to.be.an.array;
							expect(result.length).to.be.greaterThan(0);
							sId = result[0]._id.toString();								//store a known good id
						});
					}
				);
			});


			it('should return a single document by Id', function (done) {
				business.getSong(sId,
					function (err, result) {
						asyncAssertionCheck(done, function () {
							expect(err).to.not.exist;
							expect(result).to.exist;
							expect(result).to.be.an.object;
							expect(result._id.toString()).to.equal(sId);
						});
					}
				);
			});
		}
	);

	describe('Test Http requests (app, routes)',
			function () {
				it('should return a list of songs', function (done) {
					request.get('http://localhost:8080/songs',
							function (err, response, body) {
								asyncAssertionCheck(done, function () {

									expect(err).to.not.exist;
									expect(body).to.exist;
									var oBody = JSON.parse(body);
									expect(oBody).to.be.an.array;
									expect(oBody.length).to.be.greaterThan(0);
									iDocCount = oBody.length;
									sId = oBody[0]._id.toString();								//store a known good id
								});
							}
					);
				});
				it('should return a single songs by id string', function (done) {
					request.get('http://localhost:8080/songs/' + sId,
							function (err, response, body) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(response).to.exist;
									var oBody = JSON.parse(body);
									expect(oBody).to.be.an.object;
									expect(oBody).to.haveOwnProperty('artist');
								});
							}
					);
				});
				it('should insert a song document', function (done) {
					var doc = {"title": "Hallelujah", "artist": "Leonard Cohen", "released": "1970"};
					request({url: 'http://localhost:8080/song/', method: 'POST', json: doc},
							function (err, response, body) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(response).to.exist;

								});
							}
					);
				});
				it('should return one more song than last time', function (done) {
					request.get('http://localhost:8080/songs',
							function (err, response, body) {
								asyncAssertionCheck(done, function () {
									expect(err).to.not.exist;
									expect(body).to.exist;
									var oBody = JSON.parse(body);
									expect(oBody).to.be.an.array;
									expect(oBody.length).to.be.greaterThan(iDocCount);
								});
							}
					);
				});
			}
	);

});
